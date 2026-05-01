import { redirect } from "next/navigation";

// Tenant project data lives in the workspace, not the HQ view.
export default function BuildGridProjectsHQRedirect() {
  redirect("/products/buildgrid/dashboard");
}
