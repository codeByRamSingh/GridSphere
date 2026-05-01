"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function BuildGridWorkspaceEntry() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tenantId = searchParams.get("tenant_id");

  useEffect(() => {
    if (tenantId) {
      router.replace(`/products/buildgrid/workspace/dashboard?tenant_id=${tenantId}`);
    } else {
      router.replace("/products/buildgrid/dashboard");
    }
  }, [tenantId, router]);

  return null;
}
