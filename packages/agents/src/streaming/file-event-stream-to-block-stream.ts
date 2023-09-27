/* ==========================================================================================
 * Steamship FileEventStream
 *
 * A FileStream is a stream of new Blocks added to a File. In the context of chat, these new
 * blocks represent multimedia messages being streamed into the ChatHistory.
 *
 * Portions the FileStream implementation have been adapted from the cohere-stream.
 *
 * =========================================================================================*/

import {FileEvent} from "../schema/event";
import {Client} from "../client";
import {Block} from "../schema/block";
import steamship from "../operations"

const utf8Decoder = new TextDecoder('utf-8')

function FileEventStreamToBlockStream(client: Client): TransformStream<FileEvent, Block> {
    return new TransformStream<FileEvent, Block>({
        transform(event: FileEvent, controller) {
            const blockId = event.data.blockId;
            if (! blockId) {
                controller.error(new Error("Empty Block ID"))
                return;
            }
            steamship.block.get({id: blockId}, client).then((block) => {
              return new Promise<void>((resolve, reject) => {
                  if (!block) {
                      controller.error(new Error("Unable to load block."))
                      reject()
                      return
                  }
                  controller.enqueue(block)
                  resolve()
              })
            })
        },
    });
}

export { FileEventStreamToBlockStream }