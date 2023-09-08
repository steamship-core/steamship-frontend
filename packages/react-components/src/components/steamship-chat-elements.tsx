import { ReactNode } from "react";
import { Skeleton, cn } from "../ui";
import { BotIcon, UserIcon } from "lucide-react";
import clsx from "clsx";

export const SteamshipChatMessageContainer = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      "steamship-border steamship-border-foreground/10 steamship-px-2 steamship-py-4 steamship-rounded-md steamship-mb-4 steamship-grid steamship-grid-cols-12",
      className
    )}
  >
    {children}
  </div>
);

export const SteamshipChatUserContainer = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      "steamship-col-span-1 steamship-flex steamship-justify-center",
      className
    )}
  >
    {children}
  </div>
);

export const SteamshipChatUser = ({
  role,
  className,
  iconClassName,
}: {
  role: "function" | "user" | "system" | "assistant";
  className?: string;
  iconClassName?: string;
}) => (
  <SteamshipChatUserContainer className={className}>
    {role === "user" ? (
      <UserIcon className={cn("steamship-h-6 steamship-w-6", iconClassName)} />
    ) : (
      <BotIcon className={cn("steamship-h-6 steamship-w-6", iconClassName)} />
    )}
  </SteamshipChatUserContainer>
);

export const SteamshipChatMessageContentsContainer = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => (
  <div className={cn("steamship-space-y-2 steamship-col-span-11", className)}>
    {children}
  </div>
);

export const SteamshipChatLoadingMessage = () => (
  <SteamshipChatMessageContainer>
    <SteamshipChatUserContainer>
      <Skeleton className="steamship-h-6 steamship-w-6 steamship-bg-foreground/20" />
    </SteamshipChatUserContainer>
    <SteamshipChatMessageContentsContainer>
      <Skeleton className="steamship-w-full steamship-h-8 steamship-bg-foreground/20" />
      <div className="steamship-flex steamship-gap-4">
        <Skeleton className="steamship-w-1/4 steamship-h-8 steamship-bg-foreground/20" />
        <Skeleton className="steamship-w-3/4 steamship-h-8 steamship-bg-foreground/20" />
      </div>
      <Skeleton className="steamship-w-2/3 steamship-h-8 steamship-bg-foreground/20" />
    </SteamshipChatMessageContentsContainer>
  </SteamshipChatMessageContainer>
);
