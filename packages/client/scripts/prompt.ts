const S = require("..");
const SteamshipStream = S.SteamshipStream;
const Steamship = S.Steamship;
const fs = require("fs");
const os = require("os");

const parts = (process as any).argv.slice(2);
const url = parts[0];
const text = parts[1];
const contextId = "default";

console.log(`🌎 URL:    ${url}`);
console.log(`📝 Prompt: ${text}`);

const userHomeDir = os.homedir();
const steamship = fs.readFileSync(`${userHomeDir}/.steamship.json`, "utf8");
const steamshipJson = JSON.parse(steamship);
const apiKey = steamshipJson["apiKey"];

const client = new Steamship({ apiKey });

client.agent
  .respondAsync({
    url: url,
    input: { prompt: text, context_id: contextId },
  })
  .then(async (response: any) => {
    const stream = await SteamshipStream(response, client, {
      streamTimeoutSeconds: 60,
    });
    let done = false;
    let reader = stream.getReader();
    while (!done) {
      try {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (done) {
          break;
        }
        console.log(value);
      } catch (e) {
        console.log(e);
      }
    }
    console.log("<END>");
  });
