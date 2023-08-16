---
title: Answering Questions with Google Search
description: A simple form of question-answering that works with Google Search
---

You can use the [`SearchTool`](https://github.com/steamship-core/python-client/blob/main/src/steamship/agents/tools/search/search.py) to help your agent answer questions from Google Search results.

Using this tool only requires that you provide one argument:

- `ai_description` - Tells your agent how and when to use the tool.

For example, if you want to give your agent the ability to answer questions about historical events, you might say:

```python
from steamship.agents.tools.search.search import SearchTool

tool = SearchTool(
    ai_description=(
        "Used to answer questions about historical events. "
        "The input is a question about a historical event. "
        "The output is the answer to the question."
    )
)
```

## Building an Agent with `SearchTool`

This tool can be provided to a [`FunctionsBasedAgent`](https://github.com/steamship-core/python-client/blob/main/src/steamship/agents/functional/functions_based.py) which will decide when to use it based on its `ai_description`.
For example, if the tool's `ai_description` says the tool is "**used to answer question about historical events**", then the agent will tend to use the tool when the user asks a question that matches that use.

In your [`AgentService`](/agent-guidebook/core-concepts/api-py), here's how you can provide this tool to a [`FunctionsBasedAgent`](https://github.com/steamship-core/python-client/blob/main/src/steamship/agents/functional/functions_based.py):

```python
# Create an instance of the tool
from steamship.agents.tools.search.search import SearchTool
search_tool = SearchTool(
    ai_description="..." # See above
)

# Create the AgentService's agent, providing it the tool
self._agent = FunctionsBasedAgent(
    tools=[
        search_tool,
    ],
    llm=OpenAI(self.client),
)
```

A full, working example can be found at TODO.

## Deploying an AgentService with `SearchTool`

To deploy an agent with this tool, just make sure it's properly wrapped in an [`AgentService`](/agent-guidebook/core-concepts/api-py) wrapper and then follow the normal [deployment instructions](/agent-guidebook/getting-started/deploy-your-agent).
You will get a URL that you can visit to create instances of your agent in the cloud and connect to it from the web & chat apps.

## Customizing the Behavior of `SearchTool`

Steamship tools are just open-source Python.
The source for this tool is available [here](https://github.com/steamship-core/python-client/blob/main/src/steamship/agents/tools/search/search.py).
You can customize it by copy-pasting the tool into your own project, changing the code, and then using your new version.

This particular tool works by creating a prompt that:

1. Uses Steamship's managed SERP service to ask Google the input question
2. Returns that input question to the end-user

If you create an interesting customization of this tool, please consider sending us a [pull request on GitHub](https://github.com/steamship-core/python-client)!
