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

type Source = {
  page_content: string;
  metadata: {
    block_id: string;
    file_id: string;
    page: number;
    source: string;
  };
};

type PromptAPIMessage = {
  answer: string;
  sources: Source[];
  mime_type?: string;
  file_id?: string;
  id: string;
};

type AnswerAPIMessage = {
  text: string;
  id: string;
  fileId?: string;
  mimeType?: string;
  sources: Source[];
};

const SourceBlock = ({ sources }: { sources: Source[] }) => {
  return (
    <ol className="steamship-mt-2">
      {sources.map((s) => (
        <li key={s.metadata.block_id} className="steamship-text-sm">
          📙
          <a
            href={s.metadata.source}
            className="steamship-ml-2 steamship-text-blue-500"
          >
            {s.metadata.source}
          </a>
          <span className="steamship-ml-2 steamship-text-xs">
            (p. {s.metadata.page + 1})
          </span>
        </li>
      ))}
    </ol>
  );
};

const SteamshipAnswerAPIMessage = ({
  message,
}: {
  message: PromptAPIMessage;
}) => {
  if (message.mime_type?.includes("audio")) {
    return <SteamshipAudio blockId={message.id} mimeType={message.mime_type} />;
  }
  if (message.mime_type?.includes("image")) {
    return <SteamshipImage blockId={message.id} />;
  }
  return (
    <div className="steamship-code-block steamship-whitespace-pre-wrap">
      <Markdown
        // eslint-disable-next-line react/no-children-prop
        children={message.answer || ""}
        options={{
          overrides: {
            code: Code,
          },
        }}
      />
      {message.sources && <SourceBlock sources={message.sources} />}
    </div>
  );
};

const SteamshipMessage = ({ message }: { message: string }) => {
  try {
    let messageJson = JSON.parse(message);
    // if messageJson is not an array
    if (!Array.isArray(messageJson)) {
      return (
        <SteamshipAnswerAPIMessage message={messageJson as PromptAPIMessage} />
      );
    }

    const answerApiMessage = messageJson as AnswerAPIMessage[];

    return (
      <>
        {answerApiMessage.map((m, i) => {
          const mimeType = m.mimeType;
          if (m.fileId && mimeType && mimeType.indexOf("audio") !== -1) {
            return (
              <SteamshipAudio key={i} blockId={m.id} mimeType={mimeType} />
            );
          }

          if (m.id && mimeType && mimeType?.indexOf("image") !== -1) {
            return <SteamshipImage key={i} blockId={m.id} />;
          }

          let text = m.text || "";
          if (text.startsWith(". ")) {
            text = text.slice(2);
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
              {m.sources && <SourceBlock sources={m.sources} />}
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
