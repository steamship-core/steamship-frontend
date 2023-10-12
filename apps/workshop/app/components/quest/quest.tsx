"use client";
import QuestNarrative from "./quest-narrative";
import { useEffect, useState } from "react";
import { v4 } from "uuid";
import { QuestContainer } from "./shared/components";

export default function Quest() {
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    setId(v4());
  }, []);

  return <QuestContainer>{id && <QuestNarrative id={id} />}</QuestContainer>;
}
