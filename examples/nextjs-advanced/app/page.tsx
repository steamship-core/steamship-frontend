import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <main>
      <UserButton afterSignOutUrl="/" />
    </main>
  );
}
