import { redirect } from "next/navigation";

export default function CardPage() {
  redirect("/Dashboard?tab=profile");
}
