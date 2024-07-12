"use client";

import { useState, useMemo } from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface Product {
  id: number;
  image: string;
  title: string;
  description: string;
  price: number;
  category: string;
}

const products: Product[] = [
  {
    id: 1,
    image: "/placeholder.svg",
    title: "Brake Pads",
    description: "High-quality brake pads for improved stopping power",
    price: 29.99,
    category: "Brakes",
  },
  {
    id: 2,
    image: "/placeholder.svg",
    title: "Engine Oil",
    description: "Synthetic motor oil for enhanced engine performance",
    price: 24.99,
    category: "Engine",
  },
  {
    id: 3,
    image: "/placeholder.svg",
    title: "Windshield Wipers",
    description: "Durable all-weather wiper blades for clear visibility",
    price: 14.99,
    category: "Accessories",
  },
  {
    id: 4,
    image: "/placeholder.svg",
    title: "Spark Plugs",
    description: "Iridium-tipped spark plugs for improved fuel efficiency",
    price: 9.99,
    category: "Engine",
  },
  {
    id: 5,
    image: "/placeholder.svg",
    title: "Cabin Air Filter",
    description: "Replacement air filter for cleaner cabin air",
    price: 19.99,
    category: "Filters",
  },
  {
    id: 6,
    image: "/placeholder.svg",
    title: "Tire Pressure Gauge",
    description: "Digital tire pressure gauge for accurate readings",
    price: 12.99,
    category: "Accessories",
  },
  {
    id: 7,
    image: "/placeholder.svg",
    title: "Fuel Injector",
    description: "Replacement fuel injector for improved fuel delivery",
    price: 39.99,
    category: "Engine",
  },
  {
    id: 8,
    image: "/placeholder.svg",
    title: "Shock Absorbers",
    description: "Heavy-duty shock absorbers for a smooth ride",
    price: 99.99,
    category: "Suspension",
  },
];

const categories = ["Brakes", "Engine", "Accessories", "Filters", "Suspension"];

export default function ProductList() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (selectedCategories.length === 0) return true;
      return selectedCategories.includes(product.category);
    });
  }, [selectedCategories]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  return (
    <div className="grid md:grid-cols-[240px_1fr] gap-8 p-6">
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Categories</h2>
        <div className="grid gap-2">
          {categories.map((category) => (
            <Label
              key={category}
              className="flex items-center gap-2 font-normal"
            >
              <Checkbox
                checked={selectedCategories.includes(category)}
                onCheckedChange={() => handleCategoryChange(category)}
              />
              {category}
            </Label>
          ))}
        </div>
      </div>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="bg-background rounded-lg overflow-hidden shadow-sm">
      <Image
        src={product.image}
        alt={product.title}
        width={300}
        height={200}
        className="w-full h-48 object-cover"
      />
      <div className="p-4 flex flex-col gap-2">
        <h3 className="font-semibold text-lg">{product.title}</h3>
        <p className="text-muted-foreground">{product.description}</p>
        <div className="flex items-center justify-between">
          <div className="font-medium text-primary">
            ${product.price.toFixed(2)}
          </div>
          <Button variant="outline">Add to Cart</Button>
        </div>
      </div>
    </div>
  );
}
