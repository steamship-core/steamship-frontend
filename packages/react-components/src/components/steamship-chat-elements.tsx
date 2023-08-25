import { ReactNode } from "react";
import { Skeleton } from "../ui";
import { BotIcon, UserIcon } from "lucide-react";

export const SteamshipChatMessageContainer = ({
  children,
}: {
  children: ReactNode;
}) => (
  <div className="steamship-border steamship-border-foreground/10 steamship-px-2 steamship-py-4 steamship-rounded-md steamship-mb-4 steamship-grid steamship-grid-cols-12">
    {children}
  </div>
);

export const SteamshipChatUserContainer = ({
  children,
}: {
  children: ReactNode;
}) => (
  <div className="steamship-col-span-1 steamship-flex steamship-justify-center">
    {children}
  </div>
);

export const SteamshipChatUser = ({
  role,
}: {
  role: "function" | "user" | "system" | "assistant";
}) => (
  <SteamshipChatUserContainer>
    {role === "user" ? (
      <UserIcon className="steamship-h-6 steamship-w-6" />
    ) : (
      <BotIcon className="steamship-h-6 steamship-w-6" />
    )}
  </SteamshipChatUserContainer>
);

export const SteamshipChatMessageContentsContainer = ({
  children,
}: {
  children: ReactNode;
}) => (
  <div className="steamship-space-y-2 steamship-col-span-11">{children}</div>
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
