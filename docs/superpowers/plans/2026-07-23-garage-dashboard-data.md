# Garage Dashboard Real Data (Products/Customers/Orders) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the garage dashboard fetch and mutate real Products, Customers, and Orders from the database, replacing the hardcoded template.

**Architecture:** One shared Prisma migration adds Customer/Order/OrderItem and cleans Product. Three NestJS modules (`garage/products`, `garage/customers`, `garage/orders`) expose garage-scoped CRUD, all resolving the caller's garage from the JWT userId. The Next.js dashboard fetches per-tab client-side with the session access token; metric cards derive from the fetched data.

**Tech Stack:** NestJS + Prisma (API), Next.js 16 App Router + NextAuth v4 (frontend), TypeScript, pnpm.

## Global Constraints

- API port `8080`, global prefix `/api`. Frontend port `3000`. `NEXT_PUBLIC_API_URL=http://localhost:8080/api`.
- Repos: API `/home/alphauser/Documents/github/mtokaahero/mtokaa-api`, frontend `/home/alphauser/Documents/github/mtokaahero/mtokaahero`. Both on branch `feat/auth-e2e`. Commit to each independently. Stage only files each task names — never `git add -A` (pre-existing user changes must not be swept in).
- No test framework in either repo. Each task's "test" is a build and/or a runtime curl/UI check with exact expected output. Do not add a test framework.
- JWT payload `{ id, email, role }`; `JwtAuthGuard` sets `req.user`. `req.user.id` is the User id.
- Every garage endpoint resolves `garageId` from `req.user.id` via `resolveGarageId` and scopes all queries by it. `:id` mutations verify the row's `garageId` matches the caller (else 404). Never trust a client-supplied garageId.
- Order item unit price: for a `productId`/`serviceId` reference, capture the catalog record's current `price` server-side (ignore any client `unitPrice`). Only ad-hoc items (no reference) require a client `unitPrice` (≥ 0). Exactly one of productId/serviceId per item, or neither.
- Order `total` = sum of `quantity * unitPrice` over items, computed server-side in a transaction. Revenue metric excludes CANCELLED orders.
- OrderStatus enum: PENDING, IN_PROGRESS, COMPLETED, CANCELLED.

---

## Task 1: Prisma schema migration (Product cleanup + Customer/Order/OrderItem)

**Files:**
- Modify: `mtokaa-api/prisma/schema.prisma`
- Create (generated): `mtokaa-api/prisma/migrations/<timestamp>_garage_orders/migration.sql`

**Interfaces:**
- Produces: Prisma models `Customer`, `Order`, `OrderItem`, enum `OrderStatus`; cleaned `Product` (garageId required, garage relation, orderItems back-relation); `Service.orderItems` back-relation; `Garage.customers`/`Garage.orders` relations. Prisma client regenerated with these types.

- [ ] **Step 1: Edit the Product model** in `prisma/schema.prisma` — replace the existing `Product` model with:

```prisma
model Product {
  id          String      @id @default(uuid())
  name        String
  price       Float
  description String?
  garageId    String
  garage      Garage      @relation(fields: [garageId], references: [id], onDelete: Cascade)
  orderItems  OrderItem[]
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
}
```

- [ ] **Step 2: Edit the Service model** — add the back-relation line `orderItems OrderItem[]` inside the existing `Service` model (leave all other fields unchanged). The `Product?`/`Shop?` relations that referenced Product from Shop must be handled: also remove the `products Product[]` field from the `Shop` model (Shop no longer relates to Product). Locate `model Shop { ... products Product[] ... }` and delete the `products  Product[]` line.

- [ ] **Step 3: Add customers/orders relations to Garage** — inside `model Garage`, next to the existing `products  Product[]`, add:

```prisma
  customers Customer[]
  orders    Order[]
```

- [ ] **Step 4: Append the new models + enum** at the end of `schema.prisma`:

```prisma
enum OrderStatus {
  PENDING
  IN_PROGRESS
  COMPLETED
  CANCELLED
}

model Customer {
  id          String   @id @default(uuid())
  name        String
  phoneNumber String?
  vehicleInfo String?
  garageId    String
  garage      Garage   @relation(fields: [garageId], references: [id], onDelete: Cascade)
  orders      Order[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Order {
  id         String      @id @default(uuid())
  garageId   String
  garage     Garage      @relation(fields: [garageId], references: [id], onDelete: Cascade)
  customerId String
  customer   Customer    @relation(fields: [customerId], references: [id])
  status     OrderStatus @default(PENDING)
  total      Float       @default(0)
  items      OrderItem[]
  createdAt  DateTime    @default(now())
  updatedAt  DateTime    @updatedAt
}

model OrderItem {
  id          String   @id @default(uuid())
  orderId     String
  order       Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  productId   String?
  product     Product? @relation(fields: [productId], references: [id])
  serviceId   String?
  service     Service? @relation(fields: [serviceId], references: [id])
  description String
  quantity    Int      @default(1)
  unitPrice   Float
  createdAt   DateTime @default(now())
}
```

- [ ] **Step 5: Generate + apply the migration.**

Run: `cd /home/alphauser/Documents/github/mtokaahero/mtokaa-api && npx prisma migrate dev --name garage_orders`
Expected: a new migration folder is created and applied; output ends with "Your database is now in sync with your schema." If Prisma prompts that the change requires dropping data / a reset because of the Product/Shop relation removal, STOP and report BLOCKED with the exact prompt — do NOT auto-confirm a reset (the DB is empty so a reset would be safe, but a human must consent; the controller will provide `PRISMA_USER_CONSENT_FOR_DANGEROUS_AI_ACTION` if needed).

- [ ] **Step 6: Verify the client compiles with new types.**

Run: `cd /home/alphauser/Documents/github/mtokaahero/mtokaa-api && pnpm build`
Expected: exit 0. (Confirms `@prisma/client` regenerated and the schema is valid TypeScript-side.)

- [ ] **Step 7: Verify new tables exist.**

Run this from the API dir:
```bash
cd /home/alphauser/Documents/github/mtokaahero/mtokaa-api
cat > _verify.js <<'EOF'
const { Pool } = require('pg');
(async () => {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 1 });
  const t = await pool.query("select table_name from information_schema.tables where table_schema='public' order by table_name");
  console.log('tables:', t.rows.map(r=>r.table_name).join(', '));
  const c = await pool.query("select column_name from information_schema.columns where table_schema='public' and table_name='Product' order by ordinal_position");
  console.log('Product cols:', c.rows.map(r=>r.column_name).join(', '));
  await pool.end();
})();
EOF
node -r dotenv/config _verify.js dotenv_config_path=.env 2>&1 | grep -v "npm warn"
rm -f _verify.js
```
Expected: tables include `Customer, Order, OrderItem, Product` (and existing ones); Product cols are `id, name, price, description, garageId, createdAt, updatedAt` (no shopId/mechanicId).

- [ ] **Step 8: Commit.**

```bash
cd /home/alphauser/Documents/github/mtokaa-api 2>/dev/null || cd /home/alphauser/Documents/github/mtokaahero/mtokaa-api
git add prisma/schema.prisma prisma/migrations/
git commit -m "feat(db): add Customer/Order/OrderItem models, garage-scope Product"
```

---

## Task 2: Shared garage-scope helper

**Files:**
- Create: `mtokaa-api/src/garage/shared/garage-scope.service.ts`
- Create: `mtokaa-api/src/garage/shared/garage-scope.module.ts`

**Interfaces:**
- Consumes: `PrismaService`.
- Produces: `GarageScopeService.resolveGarageId(userId: string): Promise<string>` (throws `NotFoundException` if the user has no garage). Exported via `GarageScopeModule` for the products/customers/orders modules to import.

- [ ] **Step 1: Create the service** `src/garage/shared/garage-scope.service.ts`:

```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';

@Injectable()
export class GarageScopeService {
    constructor(private readonly prisma: PrismaService) {}

    /** Resolve the caller's garage id from their User id. */
    async resolveGarageId(userId: string): Promise<string> {
        const garage = await this.prisma.garage.findUnique({
            where: { userId },
            select: { id: true },
        });
        if (!garage) throw new NotFoundException(`No garage found for user ${userId}`);
        return garage.id;
    }
}
```

- [ ] **Step 2: Create the module** `src/garage/shared/garage-scope.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/shared/prisma/prisma.module';
import { GarageScopeService } from './garage-scope.service';

@Module({
    imports: [PrismaModule],
    providers: [GarageScopeService],
    exports: [GarageScopeService],
})
export class GarageScopeModule {}
```

- [ ] **Step 3: Build to verify.**

Run: `cd /home/alphauser/Documents/github/mtokaahero/mtokaa-api && pnpm build`
Expected: exit 0.

- [ ] **Step 4: Commit.**

```bash
cd /home/alphauser/Documents/github/mtokaahero/mtokaa-api
git add src/garage/shared/
git commit -m "feat(garage): add GarageScopeService to resolve garageId from JWT userId"
```

---

## Task 3: Products module (CRUD, garage-scoped)

**Files:**
- Create: `mtokaa-api/src/garage/products/dto/product.dto.ts`
- Create: `mtokaa-api/src/garage/products/products.service.ts`
- Create: `mtokaa-api/src/garage/products/products.controller.ts`
- Create: `mtokaa-api/src/garage/products/products.module.ts`
- Modify: `mtokaa-api/src/app/app.module.ts` (register `ProductsModule`)

**Interfaces:**
- Consumes: `GarageScopeService` (Task 2), `JwtAuthGuard`, `PrismaService`.
- Produces: routes `GET/POST /api/garage/products`, `PATCH/DELETE /api/garage/products/:id`.

- [ ] **Step 1: DTOs** `src/garage/products/dto/product.dto.ts`:

```typescript
import { IsNumber, IsOptional, IsString, Min, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
    @ApiProperty({ example: 'Brake Pads' })
    @IsString()
    @MinLength(1)
    name: string;

    @ApiProperty({ example: 2500 })
    @IsNumber()
    @Min(0)
    price: number;

    @ApiProperty({ example: 'Front brake pads, OEM', required: false })
    @IsString()
    @IsOptional()
    description?: string;
}

export class UpdateProductDto {
    @ApiProperty({ required: false })
    @IsString()
    @MinLength(1)
    @IsOptional()
    name?: string;

    @ApiProperty({ required: false })
    @IsNumber()
    @Min(0)
    @IsOptional()
    price?: number;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    description?: string;
}
```

- [ ] **Step 2: Service** `src/garage/products/products.service.ts`:

```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { GarageScopeService } from '../shared/garage-scope.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';

@Injectable()
export class ProductsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly scope: GarageScopeService,
    ) {}

    async list(userId: string) {
        const garageId = await this.scope.resolveGarageId(userId);
        return this.prisma.product.findMany({ where: { garageId }, orderBy: { createdAt: 'desc' } });
    }

    async create(userId: string, dto: CreateProductDto) {
        const garageId = await this.scope.resolveGarageId(userId);
        return this.prisma.product.create({
            data: { name: dto.name, price: dto.price, description: dto.description, garageId },
        });
    }

    private async ownedProduct(userId: string, id: string) {
        const garageId = await this.scope.resolveGarageId(userId);
        const product = await this.prisma.product.findFirst({ where: { id, garageId } });
        if (!product) throw new NotFoundException(`Product ${id} not found`);
        return product;
    }

    async update(userId: string, id: string, dto: UpdateProductDto) {
        await this.ownedProduct(userId, id);
        return this.prisma.product.update({ where: { id }, data: dto });
    }

    async remove(userId: string, id: string) {
        await this.ownedProduct(userId, id);
        await this.prisma.product.delete({ where: { id } });
        return { deleted: true };
    }
}
```

- [ ] **Step 3: Controller** `src/garage/products/products.controller.ts`:

```typescript
import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { ProductsService } from './products.service';

@ApiTags('Garage Products')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('garage/products')
export class ProductsController {
    constructor(private readonly products: ProductsService) {}

    @Get()
    list(@Request() req) {
        return this.products.list(req.user.id);
    }

    @Post()
    create(@Request() req, @Body() dto: CreateProductDto) {
        return this.products.create(req.user.id, dto);
    }

    @Patch(':id')
    update(@Request() req, @Param('id') id: string, @Body() dto: UpdateProductDto) {
        return this.products.update(req.user.id, id, dto);
    }

    @Delete(':id')
    remove(@Request() req, @Param('id') id: string) {
        return this.products.remove(req.user.id, id);
    }
}
```

- [ ] **Step 4: Module** `src/garage/products/products.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/shared/prisma/prisma.module';
import { PlatformModule } from 'src/platform/platform.module';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { GarageScopeModule } from '../shared/garage-scope.module';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
    imports: [PrismaModule, PlatformModule, GarageScopeModule],
    controllers: [ProductsController],
    providers: [ProductsService, JwtAuthGuard],
})
export class ProductsModule {}
```

Note: `PlatformModule` is imported because it exports `JwtModule` (needed by `JwtAuthGuard`), mirroring how `GarageModule` depends on it.

- [ ] **Step 5: Register in app module** — in `src/app/app.module.ts`, add `import { ProductsModule } from 'src/garage/products/products.module';` and add `ProductsModule` to the `imports` array.

- [ ] **Step 6: Build.**

Run: `cd /home/alphauser/Documents/github/mtokaahero/mtokaa-api && pnpm build`
Expected: exit 0.

- [ ] **Step 7: Commit.**

```bash
cd /home/alphauser/Documents/github/mtokaahero/mtokaa-api
git add src/garage/products/ src/app/app.module.ts
git commit -m "feat(garage): add garage/products CRUD endpoints"
```

---

## Task 4: Customers module (CRUD, garage-scoped)

**Files:**
- Create: `mtokaa-api/src/garage/customers/dto/customer.dto.ts`
- Create: `mtokaa-api/src/garage/customers/customers.service.ts`
- Create: `mtokaa-api/src/garage/customers/customers.controller.ts`
- Create: `mtokaa-api/src/garage/customers/customers.module.ts`
- Modify: `mtokaa-api/src/app/app.module.ts` (register `CustomersModule`)

**Interfaces:**
- Consumes: `GarageScopeService`, `JwtAuthGuard`, `PrismaService`.
- Produces: routes `GET/POST /api/garage/customers`, `PATCH/DELETE /api/garage/customers/:id`.

- [ ] **Step 1: DTOs** `src/garage/customers/dto/customer.dto.ts`:

```typescript
import { IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCustomerDto {
    @ApiProperty({ example: 'John Mwangi' })
    @IsString()
    @MinLength(1)
    name: string;

    @ApiProperty({ example: '+254700000000', required: false })
    @IsString()
    @IsOptional()
    phoneNumber?: string;

    @ApiProperty({ example: 'Toyota Corolla 2015, KDA 123A', required: false })
    @IsString()
    @IsOptional()
    vehicleInfo?: string;
}

export class UpdateCustomerDto {
    @ApiProperty({ required: false })
    @IsString()
    @MinLength(1)
    @IsOptional()
    name?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    phoneNumber?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    vehicleInfo?: string;
}
```

- [ ] **Step 2: Service** `src/garage/customers/customers.service.ts` (mirror ProductsService structure exactly, substituting `customer` for `product`):

```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { GarageScopeService } from '../shared/garage-scope.service';
import { CreateCustomerDto, UpdateCustomerDto } from './dto/customer.dto';

@Injectable()
export class CustomersService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly scope: GarageScopeService,
    ) {}

    async list(userId: string) {
        const garageId = await this.scope.resolveGarageId(userId);
        return this.prisma.customer.findMany({ where: { garageId }, orderBy: { createdAt: 'desc' } });
    }

    async create(userId: string, dto: CreateCustomerDto) {
        const garageId = await this.scope.resolveGarageId(userId);
        return this.prisma.customer.create({
            data: { name: dto.name, phoneNumber: dto.phoneNumber, vehicleInfo: dto.vehicleInfo, garageId },
        });
    }

    private async ownedCustomer(userId: string, id: string) {
        const garageId = await this.scope.resolveGarageId(userId);
        const customer = await this.prisma.customer.findFirst({ where: { id, garageId } });
        if (!customer) throw new NotFoundException(`Customer ${id} not found`);
        return customer;
    }

    async update(userId: string, id: string, dto: UpdateCustomerDto) {
        await this.ownedCustomer(userId, id);
        return this.prisma.customer.update({ where: { id }, data: dto });
    }

    async remove(userId: string, id: string) {
        await this.ownedCustomer(userId, id);
        await this.prisma.customer.delete({ where: { id } });
        return { deleted: true };
    }
}
```

- [ ] **Step 3: Controller** `src/garage/customers/customers.controller.ts` (mirror ProductsController, `@Controller('garage/customers')`, `@ApiTags('Garage Customers')`, using `CustomersService` and the customer DTOs):

```typescript
import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { CreateCustomerDto, UpdateCustomerDto } from './dto/customer.dto';
import { CustomersService } from './customers.service';

@ApiTags('Garage Customers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('garage/customers')
export class CustomersController {
    constructor(private readonly customers: CustomersService) {}

    @Get()
    list(@Request() req) {
        return this.customers.list(req.user.id);
    }

    @Post()
    create(@Request() req, @Body() dto: CreateCustomerDto) {
        return this.customers.create(req.user.id, dto);
    }

    @Patch(':id')
    update(@Request() req, @Param('id') id: string, @Body() dto: UpdateCustomerDto) {
        return this.customers.update(req.user.id, id, dto);
    }

    @Delete(':id')
    remove(@Request() req, @Param('id') id: string) {
        return this.customers.remove(req.user.id, id);
    }
}
```

- [ ] **Step 4: Module** `src/garage/customers/customers.module.ts` (mirror ProductsModule):

```typescript
import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/shared/prisma/prisma.module';
import { PlatformModule } from 'src/platform/platform.module';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { GarageScopeModule } from '../shared/garage-scope.module';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';

@Module({
    imports: [PrismaModule, PlatformModule, GarageScopeModule],
    controllers: [CustomersController],
    providers: [CustomersService, JwtAuthGuard],
})
export class CustomersModule {}
```

- [ ] **Step 5: Register in app module** — add `import { CustomersModule } from 'src/garage/customers/customers.module';` and add `CustomersModule` to `imports` in `src/app/app.module.ts`.

- [ ] **Step 6: Build.**

Run: `cd /home/alphauser/Documents/github/mtokaahero/mtokaa-api && pnpm build`
Expected: exit 0.

- [ ] **Step 7: Commit.**

```bash
cd /home/alphauser/Documents/github/mtokaahero/mtokaa-api
git add src/garage/customers/ src/app/app.module.ts
git commit -m "feat(garage): add garage/customers CRUD endpoints"
```

---

## Task 5: Orders module (CRUD with server-computed totals)

**Files:**
- Create: `mtokaa-api/src/garage/orders/dto/order.dto.ts`
- Create: `mtokaa-api/src/garage/orders/orders.service.ts`
- Create: `mtokaa-api/src/garage/orders/orders.controller.ts`
- Create: `mtokaa-api/src/garage/orders/orders.module.ts`
- Modify: `mtokaa-api/src/app/app.module.ts` (register `OrdersModule`)

**Interfaces:**
- Consumes: `GarageScopeService`, `JwtAuthGuard`, `PrismaService`.
- Produces: routes `GET /api/garage/orders`, `GET /:id`, `POST`, `PATCH /:id`, `DELETE /:id`. Order create/update accept `{ customerId, status?, items: OrderItemInput[] }` where `OrderItemInput = { productId?, serviceId?, description, quantity, unitPrice? }`.

- [ ] **Step 1: DTOs** `src/garage/orders/dto/order.dto.ts`:

```typescript
import { Type } from 'class-transformer';
import {
    ArrayMinSize, IsArray, IsEnum, IsInt, IsNumber, IsOptional, IsString, Min, MinLength, ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '@prisma/client';

export class OrderItemInput {
    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    productId?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    serviceId?: string;

    @ApiProperty({ example: 'Front brake pads' })
    @IsString()
    @MinLength(1)
    description: string;

    @ApiProperty({ example: 2 })
    @IsInt()
    @Min(1)
    quantity: number;

    @ApiProperty({ required: false, description: 'Required only for ad-hoc items (no productId/serviceId)' })
    @IsNumber()
    @Min(0)
    @IsOptional()
    unitPrice?: number;
}

export class CreateOrderDto {
    @ApiProperty()
    @IsString()
    @MinLength(1)
    customerId: string;

    @ApiProperty({ enum: OrderStatus, required: false })
    @IsEnum(OrderStatus)
    @IsOptional()
    status?: OrderStatus;

    @ApiProperty({ type: [OrderItemInput] })
    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => OrderItemInput)
    items: OrderItemInput[];
}

export class UpdateOrderDto {
    @ApiProperty({ enum: OrderStatus, required: false })
    @IsEnum(OrderStatus)
    @IsOptional()
    status?: OrderStatus;

    @ApiProperty({ type: [OrderItemInput], required: false })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OrderItemInput)
    @IsOptional()
    items?: OrderItemInput[];
}
```

- [ ] **Step 2: Service** `src/garage/orders/orders.service.ts` — resolves the garage, validates the customer + each item belongs to the garage, captures catalog prices server-side, computes total in a transaction:

```typescript
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { GarageScopeService } from '../shared/garage-scope.service';
import { CreateOrderDto, OrderItemInput, UpdateOrderDto } from './dto/order.dto';

@Injectable()
export class OrdersService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly scope: GarageScopeService,
    ) {}

    async list(userId: string) {
        const garageId = await this.scope.resolveGarageId(userId);
        const orders = await this.prisma.order.findMany({
            where: { garageId },
            orderBy: { createdAt: 'desc' },
            include: { customer: { select: { id: true, name: true } }, _count: { select: { items: true } } },
        });
        return orders.map((o) => ({
            id: o.id, status: o.status, total: o.total, createdAt: o.createdAt,
            customer: o.customer, itemCount: o._count.items,
        }));
    }

    async findOne(userId: string, id: string) {
        const garageId = await this.scope.resolveGarageId(userId);
        const order = await this.prisma.order.findFirst({
            where: { id, garageId },
            include: {
                customer: { select: { id: true, name: true, phoneNumber: true, vehicleInfo: true } },
                items: {
                    include: {
                        product: { select: { id: true, name: true } },
                        service: { select: { id: true, description: true } },
                    },
                },
            },
        });
        if (!order) throw new NotFoundException(`Order ${id} not found`);
        return order;
    }

    /** Resolve unitPrice per item, capturing catalog price server-side; validate ownership. */
    private async buildItems(garageId: string, items: OrderItemInput[]) {
        const built = [];
        for (const it of items) {
            if (it.productId && it.serviceId) {
                throw new BadRequestException('An item cannot reference both a product and a service');
            }
            let unitPrice: number;
            if (it.productId) {
                const p = await this.prisma.product.findFirst({ where: { id: it.productId, garageId } });
                if (!p) throw new BadRequestException(`Product ${it.productId} not found for this garage`);
                unitPrice = p.price;
            } else if (it.serviceId) {
                const s = await this.prisma.service.findFirst({ where: { id: it.serviceId, garageId } });
                if (!s) throw new BadRequestException(`Service ${it.serviceId} not found for this garage`);
                unitPrice = s.price;
            } else {
                if (it.unitPrice == null) {
                    throw new BadRequestException('Ad-hoc items require a unitPrice');
                }
                unitPrice = it.unitPrice;
            }
            built.push({
                productId: it.productId ?? null,
                serviceId: it.serviceId ?? null,
                description: it.description,
                quantity: it.quantity,
                unitPrice,
            });
        }
        const total = built.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);
        return { built, total };
    }

    async create(userId: string, dto: CreateOrderDto) {
        const garageId = await this.scope.resolveGarageId(userId);
        const customer = await this.prisma.customer.findFirst({ where: { id: dto.customerId, garageId } });
        if (!customer) throw new BadRequestException(`Customer ${dto.customerId} not found for this garage`);

        const { built, total } = await this.buildItems(garageId, dto.items);

        return this.prisma.order.create({
            data: {
                garageId,
                customerId: dto.customerId,
                status: dto.status ?? 'PENDING',
                total,
                items: { create: built },
            },
            include: { items: true, customer: { select: { id: true, name: true } } },
        });
    }

    async update(userId: string, id: string, dto: UpdateOrderDto) {
        const garageId = await this.scope.resolveGarageId(userId);
        const existing = await this.prisma.order.findFirst({ where: { id, garageId } });
        if (!existing) throw new NotFoundException(`Order ${id} not found`);

        return this.prisma.$transaction(async (tx) => {
            let data: any = {};
            if (dto.status) data.status = dto.status;
            if (dto.items) {
                const { built, total } = await this.buildItems(garageId, dto.items);
                await tx.orderItem.deleteMany({ where: { orderId: id } });
                data.total = total;
                data.items = { create: built };
            }
            return tx.order.update({
                where: { id },
                data,
                include: { items: true, customer: { select: { id: true, name: true } } },
            });
        });
    }

    async remove(userId: string, id: string) {
        const garageId = await this.scope.resolveGarageId(userId);
        const existing = await this.prisma.order.findFirst({ where: { id, garageId } });
        if (!existing) throw new NotFoundException(`Order ${id} not found`);
        await this.prisma.order.delete({ where: { id } });
        return { deleted: true };
    }
}
```

- [ ] **Step 3: Controller** `src/garage/orders/orders.controller.ts`:

```typescript
import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { CreateOrderDto, UpdateOrderDto } from './dto/order.dto';
import { OrdersService } from './orders.service';

@ApiTags('Garage Orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('garage/orders')
export class OrdersController {
    constructor(private readonly orders: OrdersService) {}

    @Get()
    list(@Request() req) {
        return this.orders.list(req.user.id);
    }

    @Get(':id')
    findOne(@Request() req, @Param('id') id: string) {
        return this.orders.findOne(req.user.id, id);
    }

    @Post()
    create(@Request() req, @Body() dto: CreateOrderDto) {
        return this.orders.create(req.user.id, dto);
    }

    @Patch(':id')
    update(@Request() req, @Param('id') id: string, @Body() dto: UpdateOrderDto) {
        return this.orders.update(req.user.id, id, dto);
    }

    @Delete(':id')
    remove(@Request() req, @Param('id') id: string) {
        return this.orders.remove(req.user.id, id);
    }
}
```

- [ ] **Step 4: Module** `src/garage/orders/orders.module.ts` (mirror ProductsModule with OrdersController/OrdersService).

```typescript
import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/shared/prisma/prisma.module';
import { PlatformModule } from 'src/platform/platform.module';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { GarageScopeModule } from '../shared/garage-scope.module';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
    imports: [PrismaModule, PlatformModule, GarageScopeModule],
    controllers: [OrdersController],
    providers: [OrdersService, JwtAuthGuard],
})
export class OrdersModule {}
```

- [ ] **Step 5: Register in app module** — add `import { OrdersModule } from 'src/garage/orders/orders.module';` and add `OrdersModule` to `imports` in `src/app/app.module.ts`.

- [ ] **Step 6: Build.**

Run: `cd /home/alphauser/Documents/github/mtokaahero/mtokaa-api && pnpm build`
Expected: exit 0.

- [ ] **Step 7: Commit.**

```bash
cd /home/alphauser/Documents/github/mtokaahero/mtokaa-api
git add src/garage/orders/ src/app/app.module.ts
git commit -m "feat(garage): add garage/orders CRUD with server-computed totals"
```

---

## Task 6: Backend runtime smoke test (all three resources + ownership)

**Files:** none (verification only).

**Interfaces:** Consumes routes from Tasks 3–5, plus `POST /api/garage/auth/register`, `POST /api/auth/login`.

- [ ] **Step 1: Start the API.**

Run (background): `cd /home/alphauser/Documents/github/mtokaahero/mtokaa-api && node dist/src/main`
Wait for log: `Application is running on: http://localhost:8080/api`. Confirm the route map shows `/api/garage/products`, `/api/garage/customers`, `/api/garage/orders` mapped.

- [ ] **Step 2: Get a garage token** (reuse the Task-4 auth account, or register fresh):

```bash
BASE=http://localhost:8080/api
curl -s -X POST $BASE/garage/auth/register -H 'Content-Type: application/json' \
  -d '{"firstName":"Dash","lastName":"Garage","email":"dash-garage@test.local","phoneNumber":"+254700000222","password":"Passw0rd!","garageName":"Dash Test Garage","address":"1 Dash St","location":"Nairobi"}' >/dev/null 2>&1
TOKEN=$(curl -s -X POST $BASE/auth/login -H 'Content-Type: application/json' -d '{"email":"dash-garage@test.local","password":"Passw0rd!"}' | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>console.log(JSON.parse(s).accessToken))")
echo "token: ${TOKEN:0:20}..."
```
Expected: prints a token prefix.

- [ ] **Step 3: Product CRUD.**

```bash
BASE=http://localhost:8080/api; AUTH="Authorization: Bearer $TOKEN"
PID=$(curl -s -X POST $BASE/garage/products -H "$AUTH" -H 'Content-Type: application/json' -d '{"name":"Brake Pads","price":2500,"description":"OEM"}' | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>console.log(JSON.parse(s).id))")
echo "created product $PID"
curl -s $BASE/garage/products -H "$AUTH"; echo
curl -s -X PATCH $BASE/garage/products/$PID -H "$AUTH" -H 'Content-Type: application/json' -d '{"price":3000}'; echo
```
Expected: create returns the product with `garageId`; list contains it; patch shows `price: 3000`.

- [ ] **Step 4: Customer CRUD.**

```bash
CID=$(curl -s -X POST $BASE/garage/customers -H "$AUTH" -H 'Content-Type: application/json' -d '{"name":"John Mwangi","phoneNumber":"+254711000000","vehicleInfo":"Corolla"}' | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>console.log(JSON.parse(s).id))")
echo "created customer $CID"
curl -s $BASE/garage/customers -H "$AUTH"; echo
```
Expected: create returns customer with `garageId`; list contains it.

- [ ] **Step 5: Order with catalog + ad-hoc items; verify server-computed total.**

```bash
curl -s -X POST $BASE/garage/orders -H "$AUTH" -H 'Content-Type: application/json' \
  -d "{\"customerId\":\"$CID\",\"items\":[{\"productId\":\"$PID\",\"description\":\"Brake pads\",\"quantity\":2},{\"description\":\"Labour\",\"quantity\":1,\"unitPrice\":1500}]}"; echo
```
Expected: an order with `total` = 2*3000 + 1*1500 = **7500** (product price captured server-side as 3000, ignoring any client price), `status: "PENDING"`, two items. Then `curl -s $BASE/garage/orders -H "$AUTH"` shows the order with `itemCount: 2`, `total: 7500`, and the customer name.

- [ ] **Step 6: Ownership isolation.**

```bash
# second garage cannot see the first garage's data
curl -s -X POST $BASE/garage/auth/register -H 'Content-Type: application/json' \
  -d '{"firstName":"Other","lastName":"Garage","email":"other-garage@test.local","phoneNumber":"+254700000333","password":"Passw0rd!","garageName":"Other Garage","address":"2 St","location":"Nbi"}' >/dev/null 2>&1
T2=$(curl -s -X POST $BASE/auth/login -H 'Content-Type: application/json' -d '{"email":"other-garage@test.local","password":"Passw0rd!"}' | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>console.log(JSON.parse(s).accessToken))")
echo "other garage products (expect []):"; curl -s $BASE/garage/products -H "Authorization: Bearer $T2"; echo
echo "other garage PATCH first product (expect 404):"; curl -s -o /dev/null -w "%{http_code}\n" -X PATCH $BASE/garage/products/$PID -H "Authorization: Bearer $T2" -H 'Content-Type: application/json' -d '{"price":1}'
```
Expected: `[]` for the other garage's product list; `404` when it tries to PATCH the first garage's product.

- [ ] **Step 7: Bad input.**

```bash
echo "cross-garage customer on order (expect 400):"; curl -s -o /dev/null -w "%{http_code}\n" -X POST $BASE/garage/orders -H "Authorization: Bearer $T2" -H 'Content-Type: application/json' -d "{\"customerId\":\"$CID\",\"items\":[{\"description\":\"x\",\"quantity\":1,\"unitPrice\":10}]}"
```
Expected: `400` (the first garage's customer isn't visible to the second).

- [ ] **Step 8: Stop the server.** Stop the background process. No commit (verification only).

---

## Task 7: Frontend API clients (http helper + products/customers/orders)

**Files:**
- Create: `mtokaahero/lib/api/http.ts`
- Create: `mtokaahero/lib/api/products.ts`
- Create: `mtokaahero/lib/api/customers.ts`
- Create: `mtokaahero/lib/api/orders.ts`

**Interfaces:**
- Produces:
  - `apiFetch<T>(path: string, opts: { method?: string; body?: unknown; token: string }): Promise<T>` — Bearer auth, JSON, throws `Error(message)` on non-2xx.
  - `productsApi.list/create/update/remove`, `customersApi.list/create/update/remove`, `ordersApi.list/get/create/update/remove`, with typed interfaces `Product`, `Customer`, `OrderListItem`, `OrderDetail`, `OrderItemInput`.

- [ ] **Step 1: http helper** `lib/api/http.ts`:

```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api';

export async function apiFetch<T>(
    path: string,
    opts: { method?: string; body?: unknown; token: string },
): Promise<T> {
    const res = await fetch(`${API_URL}${path}`, {
        method: opts.method ?? 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${opts.token}`,
        },
        body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
        cache: 'no-store',
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
        throw new Error((data as any)?.message ?? `Request failed (${res.status})`);
    }
    return data as T;
}
```

- [ ] **Step 2: products client** `lib/api/products.ts`:

```typescript
import { apiFetch } from './http';

export interface Product {
    id: string;
    name: string;
    price: number;
    description?: string | null;
    garageId: string;
    createdAt: string;
    updatedAt: string;
}

export interface ProductInput {
    name: string;
    price: number;
    description?: string;
}

export const productsApi = {
    list: (token: string) => apiFetch<Product[]>('/garage/products', { token }),
    create: (token: string, body: ProductInput) => apiFetch<Product>('/garage/products', { method: 'POST', body, token }),
    update: (token: string, id: string, body: Partial<ProductInput>) =>
        apiFetch<Product>(`/garage/products/${id}`, { method: 'PATCH', body, token }),
    remove: (token: string, id: string) =>
        apiFetch<{ deleted: boolean }>(`/garage/products/${id}`, { method: 'DELETE', token }),
};
```

- [ ] **Step 3: customers client** `lib/api/customers.ts`:

```typescript
import { apiFetch } from './http';

export interface Customer {
    id: string;
    name: string;
    phoneNumber?: string | null;
    vehicleInfo?: string | null;
    garageId: string;
    createdAt: string;
    updatedAt: string;
}

export interface CustomerInput {
    name: string;
    phoneNumber?: string;
    vehicleInfo?: string;
}

export const customersApi = {
    list: (token: string) => apiFetch<Customer[]>('/garage/customers', { token }),
    create: (token: string, body: CustomerInput) => apiFetch<Customer>('/garage/customers', { method: 'POST', body, token }),
    update: (token: string, id: string, body: Partial<CustomerInput>) =>
        apiFetch<Customer>(`/garage/customers/${id}`, { method: 'PATCH', body, token }),
    remove: (token: string, id: string) =>
        apiFetch<{ deleted: boolean }>(`/garage/customers/${id}`, { method: 'DELETE', token }),
};
```

- [ ] **Step 4: orders client** `lib/api/orders.ts`:

```typescript
import { apiFetch } from './http';

export type OrderStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface OrderListItem {
    id: string;
    status: OrderStatus;
    total: number;
    createdAt: string;
    customer: { id: string; name: string };
    itemCount: number;
}

export interface OrderItemInput {
    productId?: string;
    serviceId?: string;
    description: string;
    quantity: number;
    unitPrice?: number;
}

export interface OrderDetail {
    id: string;
    status: OrderStatus;
    total: number;
    createdAt: string;
    customer: { id: string; name: string; phoneNumber?: string | null; vehicleInfo?: string | null };
    items: Array<{
        id: string;
        description: string;
        quantity: number;
        unitPrice: number;
        product?: { id: string; name: string } | null;
        service?: { id: string; description: string } | null;
    }>;
}

export interface CreateOrderInput {
    customerId: string;
    status?: OrderStatus;
    items: OrderItemInput[];
}

export const ordersApi = {
    list: (token: string) => apiFetch<OrderListItem[]>('/garage/orders', { token }),
    get: (token: string, id: string) => apiFetch<OrderDetail>(`/garage/orders/${id}`, { token }),
    create: (token: string, body: CreateOrderInput) => apiFetch<OrderDetail>('/garage/orders', { method: 'POST', body, token }),
    update: (token: string, id: string, body: { status?: OrderStatus; items?: OrderItemInput[] }) =>
        apiFetch<OrderDetail>(`/garage/orders/${id}`, { method: 'PATCH', body, token }),
    remove: (token: string, id: string) =>
        apiFetch<{ deleted: boolean }>(`/garage/orders/${id}`, { method: 'DELETE', token }),
};
```

- [ ] **Step 5: Typecheck.**

Run: `cd /home/alphauser/Documents/github/mtokaahero/mtokaahero && npx tsc --noEmit`
Expected: exit 0.

- [ ] **Step 6: Commit.**

```bash
cd /home/alphauser/Documents/github/mtokaahero/mtokaahero
git add lib/api/http.ts lib/api/products.ts lib/api/customers.ts lib/api/orders.ts
git commit -m "feat(fe): add http helper and products/customers/orders API clients"
```

---

## Task 8: ProductsTab component (fetch + create + edit + delete)

**Files:**
- Create: `mtokaahero/components/dashboard/garage/ProductsTab.tsx`

**Interfaces:**
- Consumes: `productsApi` (Task 7), `useSession` from `next-auth/react`, existing UI primitives (`Card`, `Table`, `Button`, `Input`, `Label`), `sonner` toast.
- Produces: `<ProductsTab onCountChange?={(n: number) => void} />` — a client component that manages its own product list and calls `onCountChange` with the current count after each load/mutation (so the page can drive the Products metric).

- [ ] **Step 1: Create the component.** `components/dashboard/garage/ProductsTab.tsx`:

```tsx
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { productsApi, type Product } from '@/lib/api/products';

export function ProductsTab({ onCountChange }: { onCountChange?: (n: number) => void }) {
    const { data: session } = useSession();
    const token = session?.user?.accessToken;
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const load = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const list = await productsApi.list(token);
            setProducts(list);
            onCountChange?.(list.length);
        } catch (e: any) {
            toast.error(e.message ?? 'Failed to load products');
        } finally {
            setLoading(false);
        }
    }, [token, onCountChange]);

    useEffect(() => {
        load();
    }, [load]);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;
        if (!name || !price) {
            toast.error('Name and price are required');
            return;
        }
        setSubmitting(true);
        try {
            await productsApi.create(token, { name, price: Number(price), description: description || undefined });
            toast.success('Product added');
            setName('');
            setPrice('');
            setDescription('');
            await load();
        } catch (e: any) {
            toast.error(e.message ?? 'Failed to add product');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!token) return;
        try {
            await productsApi.remove(token, id);
            toast.success('Product deleted');
            await load();
        } catch (e: any) {
            toast.error(e.message ?? 'Failed to delete product');
        }
    };

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>Add Product</CardTitle>
                    <CardDescription>Add a product to your garage catalog.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleAdd} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="productName">Product Name</Label>
                                <Input id="productName" value={name} onChange={(e) => setName(e.target.value)} placeholder="Brake Pads" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="productPrice">Price</Label>
                                <Input id="productPrice" type="number" min={0} value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0.00" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="productDescription">Description</Label>
                            <Input id="productDescription" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional" />
                        </div>
                        <Button type="submit" disabled={submitting}>
                            {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />} Add Product
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Products</CardTitle>
                    <CardDescription>{products.length} product(s) in your catalog.</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin" /></div>
                    ) : products.length === 0 ? (
                        <p className="text-sm text-muted-foreground py-4">No products yet. Add your first product above.</p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {products.map((p) => (
                                    <TableRow key={p.id}>
                                        <TableCell>{p.name}</TableCell>
                                        <TableCell>{p.price.toLocaleString()}</TableCell>
                                        <TableCell>{p.description ?? '—'}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)}>
                                                <Trash2 className="h-4 w-4 text-red-500" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
```

- [ ] **Step 2: Typecheck.**

Run: `cd /home/alphauser/Documents/github/mtokaahero/mtokaahero && npx tsc --noEmit`
Expected: exit 0.

- [ ] **Step 3: Commit.**

```bash
cd /home/alphauser/Documents/github/mtokaahero/mtokaahero
git add components/dashboard/garage/ProductsTab.tsx
git commit -m "feat(fe): add ProductsTab with fetch/create/delete"
```

---

## Task 9: CustomersTab component

**Files:**
- Create: `mtokaahero/components/dashboard/garage/CustomersTab.tsx`

**Interfaces:**
- Consumes: `customersApi`, `useSession`, UI primitives, `sonner`.
- Produces: `<CustomersTab onCountChange?={(n: number) => void} />`.

- [ ] **Step 1: Create the component** — same structure as ProductsTab (Task 8) but for customers. Fields: `name` (required), `phoneNumber`, `vehicleInfo`. Table columns: Name, Phone, Vehicle, Actions (delete). Use `customersApi` and the `Customer` type. Full code:

```tsx
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { customersApi, type Customer } from '@/lib/api/customers';

export function CustomersTab({ onCountChange }: { onCountChange?: (n: number) => void }) {
    const { data: session } = useSession();
    const token = session?.user?.accessToken;
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [vehicleInfo, setVehicleInfo] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const load = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const list = await customersApi.list(token);
            setCustomers(list);
            onCountChange?.(list.length);
        } catch (e: any) {
            toast.error(e.message ?? 'Failed to load customers');
        } finally {
            setLoading(false);
        }
    }, [token, onCountChange]);

    useEffect(() => {
        load();
    }, [load]);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;
        if (!name) {
            toast.error('Name is required');
            return;
        }
        setSubmitting(true);
        try {
            await customersApi.create(token, { name, phoneNumber: phoneNumber || undefined, vehicleInfo: vehicleInfo || undefined });
            toast.success('Customer added');
            setName('');
            setPhoneNumber('');
            setVehicleInfo('');
            await load();
        } catch (e: any) {
            toast.error(e.message ?? 'Failed to add customer');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!token) return;
        try {
            await customersApi.remove(token, id);
            toast.success('Customer deleted');
            await load();
        } catch (e: any) {
            toast.error(e.message ?? 'Failed to delete customer');
        }
    };

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>Add Customer</CardTitle>
                    <CardDescription>Record a walk-in customer.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleAdd} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="custName">Name</Label>
                                <Input id="custName" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Mwangi" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="custPhone">Phone</Label>
                                <Input id="custPhone" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="+254..." />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="custVehicle">Vehicle Info</Label>
                            <Input id="custVehicle" value={vehicleInfo} onChange={(e) => setVehicleInfo(e.target.value)} placeholder="Toyota Corolla, KDA 123A" />
                        </div>
                        <Button type="submit" disabled={submitting}>
                            {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />} Add Customer
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Customers</CardTitle>
                    <CardDescription>{customers.length} customer(s).</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin" /></div>
                    ) : customers.length === 0 ? (
                        <p className="text-sm text-muted-foreground py-4">No customers yet. Add your first customer above.</p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Phone</TableHead>
                                    <TableHead>Vehicle</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {customers.map((c) => (
                                    <TableRow key={c.id}>
                                        <TableCell>{c.name}</TableCell>
                                        <TableCell>{c.phoneNumber ?? '—'}</TableCell>
                                        <TableCell>{c.vehicleInfo ?? '—'}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(c.id)}>
                                                <Trash2 className="h-4 w-4 text-red-500" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
```

- [ ] **Step 2: Typecheck.**

Run: `cd /home/alphauser/Documents/github/mtokaahero/mtokaahero && npx tsc --noEmit`
Expected: exit 0.

- [ ] **Step 3: Commit.**

```bash
cd /home/alphauser/Documents/github/mtokaahero/mtokaahero
git add components/dashboard/garage/CustomersTab.tsx
git commit -m "feat(fe): add CustomersTab with fetch/create/delete"
```

---

## Task 10: OrdersTab component (list + create dialog + status + delete)

**Files:**
- Create: `mtokaahero/components/dashboard/garage/OrdersTab.tsx`

**Interfaces:**
- Consumes: `ordersApi`, `productsApi`, `customersApi`, `useSession`, UI primitives (`Card`, `Table`, `Button`, `Input`, `Label`, `Dialog`, `Select`), `sonner`.
- Produces: `<OrdersTab onStatsChange?={(stats: { pending: number; revenue: number }) => void} />` — calls back with the count of PENDING orders and revenue (sum of totals excluding CANCELLED) after each load, so the page can drive the Pending Orders and Revenue metrics.

- [ ] **Step 1: Create the component.** `components/dashboard/garage/OrdersTab.tsx`:

```tsx
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { ordersApi, type OrderListItem, type OrderStatus, type OrderItemInput } from '@/lib/api/orders';
import { productsApi, type Product } from '@/lib/api/products';
import { customersApi, type Customer } from '@/lib/api/customers';

const STATUSES: OrderStatus[] = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];

type DraftItem = { productId?: string; description: string; quantity: number; unitPrice?: number };

export function OrdersTab({ onStatsChange }: { onStatsChange?: (s: { pending: number; revenue: number }) => void }) {
    const { data: session } = useSession();
    const token = session?.user?.accessToken;
    const [orders, setOrders] = useState<OrderListItem[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // draft order state
    const [customerId, setCustomerId] = useState('');
    const [items, setItems] = useState<DraftItem[]>([{ description: '', quantity: 1 }]);

    const recomputeStats = useCallback((list: OrderListItem[]) => {
        const pending = list.filter((o) => o.status === 'PENDING').length;
        const revenue = list.filter((o) => o.status !== 'CANCELLED').reduce((s, o) => s + o.total, 0);
        onStatsChange?.({ pending, revenue });
    }, [onStatsChange]);

    const load = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const [o, p, c] = await Promise.all([
                ordersApi.list(token),
                productsApi.list(token),
                customersApi.list(token),
            ]);
            setOrders(o);
            setProducts(p);
            setCustomers(c);
            recomputeStats(o);
        } catch (e: any) {
            toast.error(e.message ?? 'Failed to load orders');
        } finally {
            setLoading(false);
        }
    }, [token, recomputeStats]);

    useEffect(() => {
        load();
    }, [load]);

    const addItemRow = () => setItems((prev) => [...prev, { description: '', quantity: 1 }]);
    const updateItem = (idx: number, patch: Partial<DraftItem>) =>
        setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, ...patch } : it)));
    const removeItemRow = (idx: number) => setItems((prev) => prev.filter((_, i) => i !== idx));

    // display-only running total (server is authoritative)
    const draftTotal = items.reduce((sum, it) => {
        const p = it.productId ? products.find((x) => x.id === it.productId) : undefined;
        const unit = p ? p.price : (it.unitPrice ?? 0);
        return sum + unit * (it.quantity || 0);
    }, 0);

    const handleCreate = async () => {
        if (!token) return;
        if (!customerId) {
            toast.error('Select a customer');
            return;
        }
        const payloadItems: OrderItemInput[] = items
            .filter((it) => it.description.trim().length > 0)
            .map((it) => it.productId
                ? { productId: it.productId, description: it.description, quantity: it.quantity }
                : { description: it.description, quantity: it.quantity, unitPrice: it.unitPrice ?? 0 });
        if (payloadItems.length === 0) {
            toast.error('Add at least one item with a description');
            return;
        }
        setSubmitting(true);
        try {
            await ordersApi.create(token, { customerId, items: payloadItems });
            toast.success('Order created');
            setDialogOpen(false);
            setCustomerId('');
            setItems([{ description: '', quantity: 1 }]);
            await load();
        } catch (e: any) {
            toast.error(e.message ?? 'Failed to create order');
        } finally {
            setSubmitting(false);
        }
    };

    const handleStatus = async (id: string, status: OrderStatus) => {
        if (!token) return;
        try {
            await ordersApi.update(token, id, { status });
            toast.success('Status updated');
            await load();
        } catch (e: any) {
            toast.error(e.message ?? 'Failed to update status');
        }
    };

    const handleDelete = async (id: string) => {
        if (!token) return;
        try {
            await ordersApi.remove(token, id);
            toast.success('Order deleted');
            await load();
        } catch (e: any) {
            toast.error(e.message ?? 'Failed to delete order');
        }
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Orders</CardTitle>
                    <CardDescription>{orders.length} order(s).</CardDescription>
                </div>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button disabled={customers.length === 0}>
                            <Plus className="mr-2 h-4 w-4" /> New Order
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>New Order</DialogTitle>
                            <DialogDescription>Pick a customer and add line items.</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Customer</Label>
                                <Select value={customerId} onValueChange={setCustomerId}>
                                    <SelectTrigger><SelectValue placeholder="Select a customer" /></SelectTrigger>
                                    <SelectContent>
                                        {customers.map((c) => (
                                            <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-3">
                                <Label>Items</Label>
                                {items.map((it, idx) => (
                                    <div key={idx} className="grid grid-cols-12 gap-2 items-end">
                                        <div className="col-span-4 space-y-1">
                                            <Label className="text-xs">Product (optional)</Label>
                                            <Select
                                                value={it.productId ?? 'adhoc'}
                                                onValueChange={(v) => {
                                                    if (v === 'adhoc') updateItem(idx, { productId: undefined });
                                                    else {
                                                        const p = products.find((x) => x.id === v);
                                                        updateItem(idx, { productId: v, description: it.description || p?.name || '' });
                                                    }
                                                }}
                                            >
                                                <SelectTrigger><SelectValue placeholder="Ad-hoc" /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="adhoc">Ad-hoc</SelectItem>
                                                    {products.map((p) => (
                                                        <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="col-span-3 space-y-1">
                                            <Label className="text-xs">Description</Label>
                                            <Input value={it.description} onChange={(e) => updateItem(idx, { description: e.target.value })} />
                                        </div>
                                        <div className="col-span-2 space-y-1">
                                            <Label className="text-xs">Qty</Label>
                                            <Input type="number" min={1} value={it.quantity} onChange={(e) => updateItem(idx, { quantity: Number(e.target.value) })} />
                                        </div>
                                        <div className="col-span-2 space-y-1">
                                            <Label className="text-xs">Unit Price</Label>
                                            <Input
                                                type="number"
                                                min={0}
                                                disabled={!!it.productId}
                                                value={it.productId ? (products.find((x) => x.id === it.productId)?.price ?? 0) : (it.unitPrice ?? '')}
                                                onChange={(e) => updateItem(idx, { unitPrice: Number(e.target.value) })}
                                            />
                                        </div>
                                        <div className="col-span-1">
                                            <Button variant="ghost" size="icon" onClick={() => removeItemRow(idx)}>
                                                <Trash2 className="h-4 w-4 text-red-500" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                                <Button variant="outline" size="sm" onClick={addItemRow}>
                                    <Plus className="mr-2 h-4 w-4" /> Add Item
                                </Button>
                            </div>

                            <div className="text-right font-semibold">Estimated total: {draftTotal.toLocaleString()}</div>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleCreate} disabled={submitting}>
                                {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Create Order
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin" /></div>
                ) : orders.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-4">No orders yet.</p>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Customer</TableHead>
                                <TableHead>Items</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.map((o) => (
                                <TableRow key={o.id}>
                                    <TableCell>{o.customer.name}</TableCell>
                                    <TableCell>{o.itemCount}</TableCell>
                                    <TableCell>{o.total.toLocaleString()}</TableCell>
                                    <TableCell>
                                        <Select value={o.status} onValueChange={(v) => handleStatus(o.id, v as OrderStatus)}>
                                            <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                {STATUSES.map((s) => (
                                                    <SelectItem key={s} value={s}>{s.replace('_', ' ')}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(o.id)}>
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
}
```

- [ ] **Step 2: Typecheck.**

Run: `cd /home/alphauser/Documents/github/mtokaahero/mtokaahero && npx tsc --noEmit`
Expected: exit 0. (If `@/components/ui/select` or `@/components/ui/dialog` exports differ, adjust imports to match the actual primitives — both exist in `components/ui/`.)

- [ ] **Step 3: Commit.**

```bash
cd /home/alphauser/Documents/github/mtokaahero/mtokaahero
git add components/dashboard/garage/OrdersTab.tsx
git commit -m "feat(fe): add OrdersTab with create dialog, status, delete"
```

---

## Task 11: Wire tabs + real metrics into the garage dashboard page

**Files:**
- Modify: `mtokaahero/app/dashboard/garage/[garageid]/page.tsx`

**Interfaces:**
- Consumes: `ProductsTab`, `CustomersTab`, `OrdersTab` (Tasks 8–10).
- Produces: the dashboard renders the three real tabs, real metric cards driven by their callbacks, and a "Coming soon" Payments placeholder.

- [ ] **Step 1: Replace the hardcoded content.** In `GarageSaasAdmin()`, add state for metrics and swap the metric card values + tabs + payment card. Keep the sidebar/header/theme shell unchanged. Add these imports at the top:

```tsx
import { ProductsTab } from '@/components/dashboard/garage/ProductsTab';
import { CustomersTab } from '@/components/dashboard/garage/CustomersTab';
import { OrdersTab } from '@/components/dashboard/garage/OrdersTab';
```

Inside `GarageSaasAdmin`, after `const { theme, toggleTheme } = useTheme();`, add:

```tsx
    const [productCount, setProductCount] = useState(0);
    const [customerCount, setCustomerCount] = useState(0);
    const [pendingOrders, setPendingOrders] = useState(0);
    const [revenue, setRevenue] = useState(0);
```

- [ ] **Step 2: Replace the four metric-card VALUES** (keep the card markup/icons). Set:
  - Total Revenue card: `<div className="text-2xl font-bold">{revenue.toLocaleString()}</div>` and change the sub-text `<p>` to `<p className="text-xs text-muted-foreground">Gross order value (excl. cancelled)</p>`.
  - Pending Orders card: `<div className="text-2xl font-bold">{pendingOrders}</div>`, sub-text `Orders awaiting action`.
  - Products card: `<div className="text-2xl font-bold">{productCount}</div>`, sub-text `In your catalog`.
  - Active Customers card: `<div className="text-2xl font-bold">{customerCount}</div>`, sub-text `Total customers`.

- [ ] **Step 3: Replace the `<Tabs>` block** (the entire `<Tabs defaultValue="orders">...</Tabs>`) with:

```tsx
                        <Tabs defaultValue="orders" className="space-y-4">
                            <TabsList>
                                <TabsTrigger value="orders">Orders</TabsTrigger>
                                <TabsTrigger value="customers">Customers</TabsTrigger>
                                <TabsTrigger value="products">Products</TabsTrigger>
                            </TabsList>
                            <TabsContent value="orders">
                                <OrdersTab onStatsChange={({ pending, revenue }) => { setPendingOrders(pending); setRevenue(revenue); }} />
                            </TabsContent>
                            <TabsContent value="customers">
                                <CustomersTab onCountChange={setCustomerCount} />
                            </TabsContent>
                            <TabsContent value="products">
                                <ProductsTab onCountChange={setProductCount} />
                            </TabsContent>
                        </Tabs>
```

- [ ] **Step 4: Replace the Payment Information `<Card>`** (the last card) with a "Coming soon" placeholder:

```tsx
                        <Card>
                            <CardHeader>
                                <CardTitle>Payments</CardTitle>
                                <CardDescription>Payment tracking is coming soon.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Recording payments against orders will be available in a future update.
                                </p>
                            </CardContent>
                        </Card>
```

- [ ] **Step 5: Remove now-unused imports** — after the edits, `Input`, `Label`, `Table*`, `Plus`, `DollarSign`/`ShoppingCart`/etc. may be unused in the page (they moved into the tab components). Run the typecheck/build; remove any import the compiler flags as unused. Keep `Card*`, `Tabs*`, `Button`, the theme icons (`Moon`/`Sun`/`Settings`/`User`), `LogoutButton`, and the metric-card icons still referenced.

- [ ] **Step 6: Build.**

Run: `cd /home/alphauser/Documents/github/mtokaahero/mtokaahero && pnpm build`
Expected: exit 0, no unused-import or type errors.

- [ ] **Step 7: Commit.**

```bash
cd /home/alphauser/Documents/github/mtokaahero/mtokaahero
git add 'app/dashboard/garage/[garageid]/page.tsx'
git commit -m "feat(fe): wire real Products/Customers/Orders tabs and metrics into garage dashboard"
```

---

## Task 12: Full end-to-end verification

**Files:** none (verification only).

- [ ] **Step 1: Start both servers.**

API: `cd /home/alphauser/Documents/github/mtokaahero/mtokaa-api && node dist/src/main` (background; wait for running log).
Frontend: `cd /home/alphauser/Documents/github/mtokaahero/mtokaahero && pnpm build && pnpm start -p 3000` (or use an already-running dev server on :3000). Confirm both respond.

- [ ] **Step 2: Drive the flow over HTTP** (equivalent to the browser; uses NextAuth + the new endpoints). Reuse the garage account from Task 6 or register a fresh one, sign in via NextAuth to get a session, then:
  - Create a customer via `POST /api/garage/customers`.
  - Create a product via `POST /api/garage/products`.
  - Create an order referencing both via `POST /api/garage/orders`; confirm the returned `total` matches `qty*price` with the product price captured server-side.
  - `GET /api/garage/orders` shows the order with the right `itemCount`, `total`, customer name, status PENDING.
  - PATCH the order status to COMPLETED; confirm it persists.

Expected: all calls succeed with the documented shapes; totals correct.

- [ ] **Step 3: Dashboard UI check.** With a browser (or by fetching the rendered dashboard route while authenticated), confirm `/dashboard/garage/{id}` renders and the Products/Customers/Orders tabs load real data; the metric cards reflect the created records (Products ≥ 1, Active Customers ≥ 1, Pending Orders reflects status, Revenue = order total); Payments shows "coming soon".

- [ ] **Step 4: Ownership check.** A second garage's session sees empty lists and cannot mutate the first garage's rows (404/400), confirming per-garage isolation end-to-end.

- [ ] **Step 5: Stop servers.** Stop background processes. No commit (verification only).

---

## Notes for the implementer

- Backend module pattern: every garage sub-module imports `PrismaModule`, `PlatformModule` (for `JwtModule` behind `JwtAuthGuard`), and `GarageScopeModule`, declares `JwtAuthGuard` in providers, and guards the controller with `@UseGuards(JwtAuthGuard)`. Follow `garage/profile` + `GarageModule` as the reference.
- The migration alters `Product` (drops columns) on an empty table. `prisma migrate dev` generates the SQL; if it warns about data loss it's fine (table is empty) but if it demands a full reset, escalate for consent rather than auto-confirming.
- Frontend tabs are self-contained client components that fetch with the session `accessToken` and report counts/stats up via callbacks; the page owns the metric state. Do not convert the page to a server component.
- All money values are plain `Float`/`number`; format with `toLocaleString()` for display. No currency symbol is assumed (the template used `$`; the new cards show the number — add a currency prefix later if desired).
