"use client";
import { Block } from "@steamship/client";
import { DebugBlock } from "./debug-blocks";
import { useEffect } from "react";

export const StreamingBlock = ({ block }: { block: Block }) => {
  useEffect(() => {
    const readStream = async () => {
      const response = await fetch("/api/steamship/stream-block", {
        method: "POST",
        body: JSON.stringify({ blockId: block.id }),
      });
      if (!response.ok) {
        console.log("not ok");
        return;
      }
      if (!response.body) {
        console.log("not body");
        return;
      }
      console.log("begin reading");
      const reader = response.body.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          console.log("time to leave!");
          // Do something with last chunk of data then exit reader
          return;
        }
        // Otherwise do something here to process current chunk
        console.log(value);
      }
    };
    readStream();
  }, [block.id]);

  return (
    <DebugBlock block={block} className="border-pink-600" title="Streaming" />
  );
};
