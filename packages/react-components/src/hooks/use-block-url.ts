"use client";

import { useEffect, useState } from "react";

const useBlockUrl = (blockId: string) => {
  const [url, setUrl] = useState<string | undefined>();
  useEffect(() => {
    const fetchImage = async () => {
      const res = await fetch(`/api/steamship/blockId/${blockId}`);
      const body = await res.blob();
      setUrl(URL.createObjectURL(body));
    };
    if (!url) {
      fetchImage();
    }
  }, [blockId]);

  return url;
};

export default useBlockUrl;
