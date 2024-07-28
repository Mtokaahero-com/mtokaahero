/**
 * v0 by Vercel.
 * @see https://v0.dev/t/0KbZM5aDrME
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
"use client";

import {  JSX, SVGProps, useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function Component() {
  const [employees, setEmployees] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john@mtokaa.com",
      phone: "555-1234",
      role: "Mechanic",
      attendance: [
        { date: "2023-05-01", status: "Present" },
        { date: "2023-05-02", status: "Present" },
        { date: "2023-05-03", status: "Absent" },
      ],
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@mtokaa.com",
      phone: "555-5678",
      role: "Manager",
      attendance: [
        { date: "2023-05-01", status: "Present" },
        { date: "2023-05-02", status: "Present" },
        { date: "2023-05-03", status: "Present" },
      ],
    },
    {
      id: 3,
      name: "Bob Johnson",
      email: "bob@mtokaa.com",
      phone: "555-9012",
      role: "Receptionist",
      attendance: [
        { date: "2023-05-01", status: "Present" },
        { date: "2023-05-02", status: "Absent" },
        { date: "2023-05-03", status: "Present" },
      ],
    },
  ]);
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Tire",
      category: "Accessories",
      price: 50.99,
      quantity: 25,
    },
    {
      id: 2,
      name: "Engine Oil",
      category: "Fluids",
      price: 24.99,
      quantity: 50,
    },
    {
      id: 3,
      name: "Brake Pads",
      category: "Parts",
      price: 39.99,
      quantity: 15,
    },
    {
      id: 4,
      name: "Car Battery",
      category: "Parts",
      price: 79.99,
      quantity: 10,
    },
  ]);
  const [payments, setPayments] = useState([
    {
      id: 1,
      customer: "John Doe",
      amount: 250.0,
      date: "2023-05-01",
      status: "Paid",
    },
    {
      id: 2,
      customer: "Jane Smith",
      amount: 150.0,
      date: "2023-05-02",
      status: "Pending",
    },
    {
      id: 3,
      customer: "Bob Johnson",
      amount: 350.0,
      date: "2023-05-03",
      status: "Refunded",
    },
    {
      id: 4,
      customer: "Alice Lee",
      amount: 450.0,
      date: "2023-05-04",
      status: "Paid",
    },
  ]);
  const [totalSales, setTotalSales] = useState(1250.0);
  const [totalEmployees, setTotalEmployees] = useState(3);
  const [recentActivities, setRecentActivities] = useState([
    { id: 1, action: "New product added: Tire", date: "2023-05-01" },
    { id: 2, action: "Employee added: Jane Smith", date: "2023-05-02" },
    { id: 3, action: "Payment processed: John Doe", date: "2023-05-01" },
    { id: 4, action: "Product updated: Engine Oil", date: "2023-05-03" },
  ]);
  const [topSellingProducts, setTopSellingProducts] = useState([
    { id: 1, name: "Tire", sales: 15 },
    { id: 2, name: "Engine Oil", sales: 10 },
    { id: 3, name: "Brake Pads", sales: 8 },
    { id: 4, name: "Car Battery", sales: 6 },
  ]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };
  return (
    <div className={`flex flex-col h-screen ${isDarkMode ? "dark" : ""}`}>
      <header className="bg-primary text-primary-foreground py-4 px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <LogInIcon className="w-8 h-8" />
          <h1 className="text-2xl font-bold">MtokaaHero</h1>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={toggleDarkMode}>
            {isDarkMode ? (
              <SunIcon className="w-6 h-6" />
            ) : (
              <MoonIcon className="w-6 h-6" />
            )}
          </Button>
          <Avatar>
            <AvatarImage src="/placeholder-user.jpg" />
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
        </div>
      </header>
      <main className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        <Card>
          <CardHeader>
            <CardTitle>Dashboard Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Total Sales</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold">
                      ${totalSales.toFixed(2)}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Total Employees</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold">{totalEmployees}</div>
                  </CardContent>
                </Card>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activities</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {recentActivities.map((activity) => (
                      <li
                        key={activity.id}
                        className="flex items-center justify-between"
                      >
                        <div>{activity.action}</div>
                        <div className="text-sm text-muted-foreground">
                          {activity.date}
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Top Selling Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {topSellingProducts.map((product) => (
                      <li
                        key={product.id}
                        className="flex items-center justify-between"
                      >
                        <div>{product.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {product.sales} sales
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Employee Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Attendance</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell>{employee.name}</TableCell>
                      <TableCell>{employee.email}</TableCell>
                      <TableCell>{employee.phone}</TableCell>
                      <TableCell>{employee.role}</TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          {employee.attendance.map((record, index) => (
                            <div
                              key={index}
                              className={`px-2 py-1 rounded-md ${
                                record.status === "Present"
                                  ? "bg-green-500/20 text-green-500"
                                  : "bg-red-500/20 text-red-500"
                              }`}
                            >
                              {record.date} - {record.status}
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                          <Button variant="outline" size="sm" color="red">
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex justify-end">
                <Button>Add Employee</Button>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Product Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>${product.price.toFixed(2)}</TableCell>
                      <TableCell>{product.quantity}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                          <Button variant="outline" size="sm" color="red">
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex justify-end">
                <Button>Add Product</Button>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Payments Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>{payment.customer}</TableCell>
                      <TableCell>${payment.amount.toFixed(2)}</TableCell>
                      <TableCell>{payment.date}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            payment.status === "Paid"
                              ? "secondary"
                              : payment.status === "Pending"
                              ? "destructive"
                              : "destructive"
                          }
                        >
                          {payment.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Process
                          </Button>
                          <Button variant="outline" size="sm" color="red">
                            Refund
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex justify-end">
                <Button>Process Payment</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

function LogInIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
      <polyline points="10 17 15 12 10 7" />
      <line x1="15" x2="3" y1="12" y2="12" />
    </svg>
  );
}

function MoonIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}

function SunIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  );
}

function XIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
