"use client";
import { Button } from "@/components/ui/button";

const ResetAgentButton = () => {
  const onClick = async () => {
    await fetch("/api/reset-agent", { method: "POST" });
  };

  return (
    <Button variant="outline" onClick={onClick}>
      Reset Agent
    </Button>
  );
};

export default ResetAgentButton;
