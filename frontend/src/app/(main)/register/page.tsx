import { redirect } from "next/navigation";

// Register lives inside the combined auth page at /login?mode=register
export default function RegisterPage() {
  redirect("/login?mode=register");
}
