---
title: Generate DALL-E Images
description: Give your agent the ability to return DALL-E images.
---

You can use the [`DalleTool`](https://github.com/steamship-core/python-client/blob/main/src/steamship/agents/tools/image_generation/dalle.py) to generate and return DALL-E images from your agent.

## Building a ReACT Agent with `DalleTool`

Just provide the [`DalleTool`](https://github.com/steamship-core/python-client/blob/main/src/steamship/agents/tools/image_generation/dalle.py) to your [`FunctionsBasedAgent`](https://github.com/steamship-core/python-client/blob/main/src/steamship/agents/functional/functions_based.py) to use it.

```python
from steamship.agents.tools.image_generation import DalleTool

self._agent = FunctionsBasedAgent(
    tools=[
        DalleTool(),
    ],
    llm=OpenAI(self.client),
)
```

By default, this will cause the ReACT agent to generate an image when you request a picture of something.
It will do so using Steamship's managed DALL-E plugin.

If you want to change or constrain the circumstances when this tool is used, you can set the `ai_description` field during initialization:

```python
DalleTool(
    ai_description=(
        "Used to generate company logos. "
        "Only use if the user has asked for a company logo. "
        "The input is a description of what the logo should look like, in detail. "
        "The output is the desired logo."
    )
)
```

## Full-working examples of `DalleTool`

The following examples can be copy-pasted into your project:

- [CaptainPicardWithVoice](https://github.com/steamship-core/multimodal-agent-starter/blob/main/src/example_agents/captain_picard_with_voice.py) - Uses Stable Diffusion to generate pictures when you ask him what he sees outside the space ship. Just change `StableDiffusionTool` for `DalleTool`.

## Deploying an AgentService with `DalleTool`

To deploy an agent with this tool, just make sure it's properly wrapped in an [`AgentService`](/agent-guidebook/core-concepts/api-py) wrapper and then follow the normal [deployment instructions](/agent-guidebook/getting-started/deploy-your-agent).
You will get a URL that you can visit to create instances of your agent in the cloud and connect to it from the web & chat apps.
