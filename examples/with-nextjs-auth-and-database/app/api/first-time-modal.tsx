"use client";
import { buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TypographySmall } from "@/components/ui/typography/TypographySmall";

import { Button } from "@steamship/react";
import { useEffect, useState } from "react";

// Only renders a modal if the user has never been to the site before
const FirstTimeModal = () => {
  const [hasVisited, setHasVisited] = useState(false);

  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisited");
    if (!hasVisited) {
      localStorage.setItem("hasVisited", "true");
      setHasVisited(true);
    }
  }, []);

  return (
    <Dialog open={hasVisited} onOpenChange={setHasVisited}>
      <DialogTrigger asChild>
        <Button variant="ghost">About this demo</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Welcome to Dog Bot!</DialogTitle>
          <DialogDescription>
            This is a demo of a chatbot that can help you manage your pet dogs.
            Add your dogs and ask the chatbot questions about them. You can even
            ask for pictures!
          </DialogDescription>
        </DialogHeader>
        <div className="pb-4 space-y-2">
          <TypographySmall>
            Dogbot was built using{" "}
            <a className="text-blue-600" href="https://www.steamship.com/">
              Steamship
            </a>
            , a framework for building multi-modal chatbots. For authentication,
            this example uses{" "}
            <a className="text-blue-600" href="https://www.clerk.com/">
              Clerk
            </a>
            . As a database, this example uses{" "}
            <a
              className="text-blue-600"
              href="https://vercel.com/docs/storage/vercel-postgres"
            >
              Vercel Postgres
            </a>
            . The UI is built with{" "}
            <a className="text-blue-600" href="https://ui.shadcn.com/">
              shadcn/ui
            </a>
            .
          </TypographySmall>
          <a
            className={buttonVariants({
              variant: "outline",
            })}
            href="https://github.com/steamship-core/steamship-frontend/tree/main/examples/with-nextjs-auth-and-database"
          >
            Checkout the repo
          </a>
        </div>
        <DialogFooter>
          <Button>Get Started</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FirstTimeModal;
