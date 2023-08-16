# Learn Facts from Users

Learn facts from your users and save them to a vector database

You can use the [`VectorSearchLearnerTool`](https://github.com/steamship-core/python-client/blob/main/src/steamship/agents/tools/question_answering/vector_search_learner_tool.py) to learn facts from users and save them to a vector database.

{% definition term="vector-database" /%}

Using this tool only requires providing it to your [`FunctionsBasedAgent`](https://github.com/steamship-core/python-client/blob/main/src/steamship/agents/functional/functions_based.py):

```python
self._agent = FunctionsBasedAgent(
    tools=[
        VectorSearchLearnerTool()
    ],
    llm=OpenAI(self.client),
)
```

By default, the tool will:

- Use your agent's default vector database, created on demand for you inside Steamship
- Ask the agent to save facts whenever the user requests that the agent **learn or remember something**

To customize these to behaviors, just provide these arguments to the tool's constructor:

- `index_handle` - The name of the vector database to use (created on-demand for you; must be `a-z` and dashes)
- `ai_description` - Tells your agent how and when to use the tool
- `name` - The name of this tool; only important if you plan to create multiple copies of the tool

For example, to add a `VectorSearchLearnerTool` that records your likes and dislikes to a specific vector database, you might say:

```python
VectorSearchLearnerTool(
    name="PreferenceLearner",
    index_handle="personal-preference-index",
    agent_description = (
        "Used to remember a personal preference. Use this tool every time the user expresses a like, dislike, or preference. ",
        "Use this tool even if the user did not mention they want something remembered. ",
        "The input is a personal preference to learn. ",
        "The output is a confirmation of the personal preference that will be remembered.",
    )
```

## Building an Agent with `VectorSearchLearnerTool`

This tool can be provided to a [`FunctionsBasedAgent`](https://github.com/steamship-core/python-client/blob/main/src/steamship/agents/functional/functions_based.py) which will decide when to use it based on its `ai_description`.
For example, if the tool's `ai_description` says the tool is "**Used to remember a fact. Only use this tool if someone asks to remember or learn something**", then the agent will tend to use the tool when the user makes a statement like "Remember that Susan lives in Boston."

In your [`AgentService`](/agent-guidebook/core-concepts/api-py), here's how you can provide this tool to a [`FunctionsBasedAgent`](https://github.com/steamship-core/python-client/blob/main/src/steamship/agents/functional/functions_based.py):

```python
# Create the AgentService's agent, providing it the tool
self._agent = FunctionsBasedAgent(
    tools=[
        VectorSearchLearnerTool(),
    ],
    llm=OpenAI(self.client),
)
```

A full, working example can be found at TODO.

## Deploying an AgentService with `VectorSearchLearnerTool`

To deploy an agent with this tool, just make sure it's properly wrapped in an [`AgentService`](/agent-guidebook/core-concepts/api-py) wrapper and then follow the normal [deployment instructions](/agent-guidebook/getting-started/deploy-your-agent).
You will get a URL that you can visit to create instances of your agent in the cloud and connect to it from the web & chat apps.

## Customizing the Behavior of `VectorSearchLearnerTool`

Steamship tools are just open-source Python.
The source for this tool is available [here](https://github.com/steamship-core/python-client/blob/main/src/steamship/agents/tools/question_answering/vector_search_learner_tool.py).
You can customize it by copy-pasting the tool into your own project, changing the code, and then using your new version.

This particular tool works by:

1. Loading an Embedding Index Plugin from Steamship (this auto-manages embeddings & vector databases for you)
2. Adding the provided text to the Embedding Index
3. Responding with templated statement that the new facts will be remembered

A few ways you might customize it might be:

- Apply a prompt before saving it to the embedding index, using the LLM in the provided `AgentContext`. Perhaps the prompt can rewrite, summarize, or expand upon the provided information.
- Add additional information to the `metadata` that is saved with the embedded item. Perhaps context in which the fact is being learned.

If you create an interesting customization of this tool, please consider sending us a [pull request on GitHub](https://github.com/steamship-core/python-client)!
