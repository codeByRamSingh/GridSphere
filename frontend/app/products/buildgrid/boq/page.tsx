import { redirect } from "next/navigation";

// Tenant BOQ data lives in the workspace, not the HQ view.
export default function BuildGridBOQHQRedirect() {
  redirect("/products/buildgrid/dashboard");
}
