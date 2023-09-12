import { Steamship } from "@steamship/client/*";
import prisma from "./db";

const conditionallyCreateAgent = async (userId: string) => {
  const agent = await prisma.agents.findFirst({
    where: {
      ownerId: userId!,
    },
  });

  if (!agent) {
    const steamship = new Steamship({ apiKey: process.env.STEAMSHIP_API_KEY });
    const packageInstance = await steamship.use(
      process.env.STEAMSHIP_PACKAGE_HANDLE!,
      `${process.env.STEAMSHIP_PACKAGE_HANDLE!}-${userId.toLowerCase()}`
    );
    return await prisma.agents.create({
      data: {
        ownerId: userId!,
        agentUrl: packageInstance.invocationURL!,
        handle: packageInstance.handle!,
      },
    });
  }

  return agent;
};

export default conditionallyCreateAgent;
