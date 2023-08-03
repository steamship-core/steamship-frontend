"use client";

import useBlockUrl from "../hooks/use-block-url";
import { Skeleton } from "../ui";

const SteamshipAudio = ({
  blockId,
  mimeType,
}: {
  blockId: string;
  mimeType: string;
}) => {
  const url = useBlockUrl(blockId);

  if (!url) {
    return <Skeleton className="steamship-w-44 steamship-h-2" />;
  }

  return (
    <audio controls>
      <source src={url} type={mimeType} />
    </audio>
  );
};

export default SteamshipAudio;
