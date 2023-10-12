import { Block } from "../schema";
import { isStreamTerminatingBlock } from "./utils";

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
      // If this block signals termination, hang up!
      if (isStreamTerminatingBlock(block)) {
        controller.terminate();
        return;
      }
    },
  });
}

export { BlockStreamToBlockJsonStream };
