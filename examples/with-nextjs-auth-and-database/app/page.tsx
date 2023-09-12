import { UserButton, auth } from "@clerk/nextjs";
import { sql } from "@vercel/postgres";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AddPetButton from "./add-pet-button";
import Steamship from "./steamship";
import ResetAgentButton from "./reset-agent-button";
import prisma from "@/lib/db";
import FirstTimeModal from "./api/first-time-modal";
import { TypographyH1 } from "@/components/ui/typography/TypographyH1";
import { TypographyH2 } from "@/components/ui/typography/TypographyH2";
import { TypographySmall } from "@/components/ui/typography/TypographySmall";
import Image from "next/image";

export default async function Home(): Promise<JSX.Element> {
  const { userId } = auth();
  const dogs = await prisma.dogs.findMany({
    where: {
      ownerId: userId!,
    },
  });

  return (
    <main className="px-4 py-4 sm:px-12 overflow-scroll flex flex-col">
      <div className="flex w-full justify-between items-center mb-8">
        <div>
          <TypographySmall>Powered by</TypographySmall>
          <Image
            alt="Steamship"
            src="/logo-dark@3x.png"
            width={1749 / 10}
            height={381 / 10}
            className="mt-2"
          />
        </div>
        <div className="flex justify-center items-center gap-4">
          <FirstTimeModal />
          <UserButton />
        </div>
      </div>
      <div className="flex w-full justify-between items-center mb-8">
        <div className="max-w-[60%]">
          <h3 className="text-2xl font-medium">Welcome to Dog Bot!</h3>
          <p className="text-gray-500">
            This is a demo of a chatbot that can help you manage your pet dogs.
            Add your dogs and ask the chatbot questions about them. You can even
            ask for pictures!
          </p>
        </div>
        <div className="flex gap-2">
          <ResetAgentButton />
          <AddPetButton />
        </div>
      </div>
      <div>
        <h3 className="text-2xl font-medium">Your Pet Dogs</h3>
      </div>
      <Table>
        <TableCaption>A list of your pets.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Name</TableHead>
            <TableHead>Breed</TableHead>
            <TableHead>Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dogs.map((dog) => (
            <TableRow key={dog.id}>
              <TableCell className="font-medium">{dog.name}</TableCell>
              <TableCell>{dog.breed}</TableCell>
              <TableCell>{dog.description}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex w-full justify-between items-center my-8">
        <h3 className="text-2xl font-medium">Chat about your dogs</h3>
      </div>
      <div className="h-[600px]">
        <Steamship />
      </div>
    </main>
  );
}
