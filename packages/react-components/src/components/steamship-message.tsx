"use client";

import Markdown from "markdown-to-jsx";
import SyntaxHighlighter from "react-syntax-highlighter";
import { a11yDark } from "react-syntax-highlighter/dist/cjs/styles/hljs";
import { cn } from "../ui";
import SteamshipAudio from "./steamship-audio";
import SteamshipImage from "./steamship-image";

const Code = ({
  className,
  children,
  inline,
  ...props
}: {
  className: string;
  children: any;
  inline: boolean;
}) => {
  const match = /language-(\w+)/.exec(className || "");
  return !inline && match ? (
    <SyntaxHighlighter
      {...props}
      className={cn(
        className,
        "steamship-rounded-md steamship-my-2 steamship-break-words steamship-whitespace-pre-wrap"
      )}
      style={a11yDark}
      language={match[1]}
    >
      {`${children}`}
    </SyntaxHighlighter>
  ) : (
    <code className="steamship-text-blue-500 !steamship-inline">
      {children}
    </code>
  );
};

const SteamshipMessage = ({ message }: { message: string }) => {
  try {
    const messageJson = JSON.parse(message) as {
      text: string;
      id?: string;
      fileId?: string;
      mimeType?: string;
    }[];
    const audioMessage = messageJson.find(
      (m) => m.fileId && m.mimeType?.indexOf("audio") !== -1
    );
    if (audioMessage && audioMessage.id && audioMessage.mimeType) {
      return (
        <SteamshipAudio
          blockId={audioMessage.id}
          mimeType={audioMessage.mimeType}
        />
      );
    }

    return (
      <>
        {messageJson.map((m, i) => {
          if (m.id && m.mimeType?.indexOf("image") !== -1) {
            return <SteamshipImage key={i} blockId={m.id} />;
          }
          let text = m.text;
          if (m.text.startsWith(". ")) {
            text = m.text.slice(2);
          }
          return (
            <div
              key={i}
              className="steamship-code-block steamship-whitespace-pre-wrap"
            >
              <Markdown
                // eslint-disable-next-line react/no-children-prop
                children={text}
                options={{
                  overrides: {
                    code: Code,
                  },
                }}
              />
            </div>
          );
        })}
      </>
    );
  } catch (e) {
    return <span>{message}</span>;
  }
};

export default SteamshipMessage;
