import useBlockUrl from "../hooks/use-block-url";
import { Skeleton } from "../ui";

const SteamshipImage = ({ blockId }: { blockId: string }) => {
  const url = useBlockUrl(blockId);
  if (!url) {
    return <Skeleton className="steamship-w-44 steamship-h-44" />;
  }
  // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
  return <img src={url} className="steamship-w-auto steamship-h-44" />;
};

export default SteamshipImage;
