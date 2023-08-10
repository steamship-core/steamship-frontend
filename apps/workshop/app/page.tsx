import Image from "next/image";
import {
  Steamship,
  SteamshipChatPromptContainer,
} from "./components/steamship";

export default function Home() {
  return (
    <main className="flex flex-col items-center p-6 md:p-24">
      <h1 className="text-xl">Steamship Chatbox Demo</h1>
      <div className="h-[600px] w-full max-w-[800px] border border-gray-500 rounded-md mt-6">
        <Steamship />
      </div>
      <h1 className="text-xl my-8">Steamship Chatprompt Demo</h1>
      <SteamshipChatPromptContainer />
    </main>
  );
}
