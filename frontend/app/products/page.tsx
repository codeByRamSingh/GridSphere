"use client";

import { useQuery } from "@tanstack/react-query";
import { ProductCard } from "@/components/dashboard/product-card";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { dashboardApi } from "@/lib/api";
import { products } from "@/lib/mock-data";
import { Plus } from "lucide-react";

export default function ProductsPage() {
  const { data = products } = useQuery({
    queryKey: ["products"],
    queryFn: dashboardApi.products,
    initialData: products
  });

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Products"
        title="Portfolio command center"
        description="Track each SaaS product by stage, revenue, active users, growth rate, bug load, deployment status, and overall product health."
        action={
          <Button>
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        }
      />

      <section className="grid gap-4 lg:grid-cols-3">
        {data.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </section>
    </div>
  );
}
