import { redirect } from "next/navigation";

// Tenant procurement data lives in the workspace, not the HQ view.
export default function BuildGridProcurementHQRedirect() {
  redirect("/products/buildgrid/dashboard");
}
