# Parts of Your Agent
Your agent is a custom AI entity you’ve designed.
Some agents perform reasoning and planning.
Others add tasking and scheduling.
You can build one that's entirely made of Python rules if you wish.

This guidebook focuses on **multimodal agents**.
These are agents which rely on the LLM to decide what to do, based on a set of tools provided.

These agents have:

- **General purpose knowledge**, from the LLM it's connected to
- **A personality and moods** that you can control via prompt engineering
- **Multimodal skills** like generating images
- **Voice support** both incoming and outgoing
- **Memory** across a variety of channels: vector search, chat history, and prompt databases

## The code

Here's the full content of the [src/api.py](https://github.com/steamship-core/multimodal-agent-starter/blob/main/src/api.py) in your starter project.

```python
from steamship.agents.functional import FunctionsBasedAgent
from steamship.agents.llms.openai import ChatOpenAI
from steamship.agents.mixins.transports.steamship_widget import \
    SteamshipWidgetTransport
from steamship.agents.service.agent_service import AgentService
from steamship.agents.tools.search.search import SearchTool
from steamship.utils.repl import AgentREPL

SYSTEM_PROMPT = """You are Assistant, an assistant who helps search the web.

Who you are:
- You are a helpful robot.
- You were created by Steamship.
- You are kind, compassionate, optimistic robot.

NOTE: Some functions return images, video, and audio files. These multimedia files will be represented in messages as
UUIDs for Steamship Blocks. When responding directly to a user, you SHOULD print the Steamship Blocks for the images,
video, or audio as follows: `Block(UUID for the block)`.

Example response for a request that generated an image:
Here is the image you requested: Block(288A2CA1-4753-4298-9716-53C1E42B726B).

Only use the functions you have been provided with."""

MODEL_NAME = "gpt-4"


class ImageSearchBot(AgentService):
    """Deployable Multimodal Agent that lets you talk to Google Search & Google Images."""

    USED_MIXIN_CLASSES = [SteamshipWidgetTransport]

    def __init__(self, **kwargs):
        super().__init__(**kwargs)

        # The agent's planner is responsible for making decisions about what to do for a given input.
        self._agent = FunctionsBasedAgent(
            tools=[SearchTool(), GoogleImageSearchTool()],
            llm=ChatOpenAI(self.client, model_name=MODEL_NAME),
        )
        self._agent.PROMPT = SYSTEM_PROMPT

        # This Mixin provides HTTP endpoints that connects this agent to a web client
        self.add_mixin(
            SteamshipWidgetTransport(
                client=self.client, agent_service=self, agent=self._agent
            )
        )


if __name__ == "__main__":
    AgentREPL(ImageSearchBot, agent_package_config={},).run()
```

Let's divide that into three sections.

## Part 1 - The System Prompt

```python
SYSTEM_PROMPT = """You are Assistant, an assistant who helps search the web.

Who you are:
- You are a helpful robot.
- You were created by Steamship.
- You are kind, compassionate, optimistic robot.

NOTE: Some functions return images, video, and audio files. These multimedia files will be represented in messages as
UUIDs for Steamship Blocks. When responding directly to a user, you SHOULD print the Steamship Blocks for the images,
video, or audio as follows: `Block(UUID for the block)`.

Example response for a request that generated an image:
Here is the image you requested: Block(288A2CA1-4753-4298-9716-53C1E42B726B).

Only use the functions you have been provided with."""
```

The system prompt provides the core set of instructions for you agent.

In starter project has a system prompt that contains:

- A personality (see the [Personality Chapter](/agent-guidebook/personality/add-a-personality))
- Instructions for [using tools](/agent-guidebook/core-concepts/tools), including multi-modal tools like 
  for generating [images](/agent-guidebook/generate-images) and [audio](/agent-guidebook/generate-speech).

The wording of this prompt plays a huge role in how your LLM reasoner will behave, so spend a lot of time watching how changes you make impacts things.

## Part 2 - Tools

```python
         tools=[SearchTool(), GoogleImageSearchTool()],
```

We'll cover tools in the [next section](/agent-guidebook/core-concepts/tools), but for now think of them as targeted skills that your agent can learn.

## Part 3 - A REPL

```python
if __name__ == "__main__":
    AgentREPL(ImageSearchBot, agent_package_config={},).run()
```

Your `AgentREPL` is just a miniature program you can run on your local machine to interact with it.

This lets you run and debug your agent on localhost, without having to first deploy it to the cloud.
