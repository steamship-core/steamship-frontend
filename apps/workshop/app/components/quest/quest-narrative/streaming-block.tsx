"use client";
import { Block } from "@steamship/client";
import { DebugBlock } from "./debug-blocks";
import { useEffect, useState } from "react";

export const StreamingBlock = ({ block }: { block: Block }) => {
  const [innerBlock, setInnerBlock] = useState<Block>(block);

  useEffect(() => {
    const readStream = async () => {
      console.log("Streaming block!", block.id);
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
        try {
          var txt = (innerBlock.text = new TextDecoder().decode(value));

          // Sometimes an update has TWO updates.. as JSON-L
          var lines = txt.split("\n");
          var lastUpdate = lines[lines.length - 1];
          var newBlock = JSON.parse(lastUpdate);
          setInnerBlock(newBlock);
        } catch (ex) {
          console.log(ex);
          var txt = (innerBlock.text = new TextDecoder().decode(value));
          console.log(txt);
        }
      }
    };
    readStream();
  }, [block.id]);

  return (
    <DebugBlock
      block={innerBlock}
      className="border-pink-600"
      title="Streaming"
    />
  );
};
