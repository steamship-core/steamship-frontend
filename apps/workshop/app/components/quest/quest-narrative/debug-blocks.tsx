import { cn } from "@/lib/utils";
import { Block } from "@steamship/client";
import { TypographySmall } from "../../ui/typography/TypographySmall";

export const DebugBlock = ({
  block,
  className,
  title,
}: {
  block: Block;
  className: string;
  title: string;
}) => {
  return (
    <div
      className={cn(
        "p-2 border border-yellow-600 rounded-md opacity-70 text-sm",
        className
      )}
    >
      <TypographySmall>{title}</TypographySmall>
      <p>{block.text}</p>
    </div>
  );
};

export const FallbackBlock = ({ block }: { block: Block }) => {
  return (
    <DebugBlock block={block} className="border-foreground" title="Fallback" />
  );
};

export const StatusBlock = ({ block }: { block: Block }) => {
  return (
    <DebugBlock block={block} className="border-yellow-600" title="Status" />
  );
};

export const SystemBlock = ({ block }: { block: Block }) => {
  return (
    <DebugBlock block={block} className="border-orange-600" title="System" />
  );
};

export const ChatHistoryBlock = ({ block }: { block: Block }) => {
  return (
    <DebugBlock
      block={block}
      className="border-indigo-600"
      title="Chat History"
    />
  );
};

export const FunctionCallBlock = ({ block }: { block: Block }) => {
  return (
    <DebugBlock
      block={block}
      className="border-blue-600"
      title="Function Call"
    />
  );
};

export const UserMessageBlock = ({ block }: { block: Block }) => {
  return (
    <DebugBlock
      block={block}
      className="border-green-600"
      title="User Message"
    />
  );
};
