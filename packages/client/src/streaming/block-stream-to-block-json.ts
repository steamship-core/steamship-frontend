import { Block } from "../schema";

/**
 * Converts a stream of Blocks to a stream of JSON that repeats blocks if they themselves are in the process of streaming.
 * @param client
 * @returns
 */
function BlockStreamToBlockJsonStream(): TransformStream<Block, string> {
  return new TransformStream<Block, string>({
    transform(block: Block, controller) {
      const json = JSON.stringify(block) + "\n";
      console.log(json);
      controller.enqueue(json);
    },
  });
}

export { BlockStreamToBlockJsonStream };
