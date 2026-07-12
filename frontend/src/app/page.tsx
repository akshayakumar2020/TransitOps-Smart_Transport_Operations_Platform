import { redirect } from "next/navigation";

/** Root route — redirects straight into the app flow. */
export default function HomePage() {
  redirect("/dashboard");
}
