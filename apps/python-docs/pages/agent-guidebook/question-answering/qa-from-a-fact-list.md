# Answering Questions from a Prompt Database

A simple form of question-answering that works with pre-loaded information

You can use the [`PromptDatabaseQATool`](https://github.com/steamship-core/python-client/blob/main/src/steamship/agents/tools/question_answering/prompt_database_question_answerer.py) to help your agent answer questions from a fact list that you provide.

Using this tool only requires that you provide two arguments:

- `facts` - Lists the facts that your agent will use to answer questions.
- `ai_description` - Tells your agent how and when to use the tool.

For example, if you want to give your agent the ability to answer questions about how many subway stations each US city has, you might create the tool as follows:

```python
tool = PromptDatabaseQATool(
    facts=[
        "New York City has 424 subway stations",
        "Boston has 51 subway stations",
        "Washington, DC has 97 subway stations",
        "San Francisco has 47 subway stations",
        "Miami has 23 subway stations",
        "Los Angeles has 16 subway stations",
        "Chicago has 145 subway stations",
        "Baltimore has 14 subway stations",
    ],
    ai_description=(
        "Used to answer questions about the number of subway stations in US cities. "
        "The input is the question about subway stations. "
        "The output is the answer as a sentence."
    )
)
```

## Building an Agent with `PromptDatabaseQATool`

This tool can be provided to a [`FunctionsBasedAgent`](https://github.com/steamship-core/python-client/blob/main/src/steamship/agents/functional/functions_based.py) which will decide when to use it based on its `ai_description`.
For example, if the tool's `ai_description` says the tool is "**used to answer question about the number of subway stations in US cities**", then the agent will tend to use the tool when the user asks a question that matches that use.

In your [`AgentService`](/agent-guidebook/core-concepts/api-py), here's how you can provide this tool to a [`FunctionsBasedAgent`](https://github.com/steamship-core/python-client/blob/main/src/steamship/agents/functional/functions_based.py):

```python
# Create an instance of the tool
prompt_database_qa_tool = PromptDatabaseQATool(
    facts=[ .. ], # See above
    ai_description="..." # See above
)

# Create the AgentService's agent, providing it the tool
self._agent = FunctionsBasedAgent(
    tools=[
        prompt_database_qa_tool,
    ],
    llm=OpenAI(self.client),
)
```

A full, working example can be found at TODO.

## Deploying an AgentService with `PromptDatabaseQATool`

To deploy an agent with this tool, just make sure it's properly wrapped in an [`AgentService`](/agent-guidebook/core-concepts/api-py) wrapper and then follow the normal [deployment instructions](/agent-guidebook/getting-started/deploy-your-agent).
You will get a URL that you can visit to create instances of your agent in the cloud and connect to it from the web & chat apps.

## Customizing the Behavior of `PromptDatabaseQATool`

Steamship tools are just open-source Python.
The source for this tool is available [here](https://github.com/steamship-core/python-client/blob/main/src/steamship/agents/tools/question_answering/prompt_database_question_answerer.py).
You can customize it by copy-pasting the tool into your own project, changing the code, and then using your new version.

This particular tool works by creating a prompt that:

1. Provides the LLM your list of facts.
2. Asks it to answer the user's question by using one of those facts.

A few ways you might customize it might be:

- Alter the prompt so that it answers questions in a particular way.
- Alter the tool to take JSON facts (such as datbase rows) instead of natural language sentences
- Alter the tool to look up the facts dynamically, e.g. from an API, and then provide them at runtime

If you create an interesting customization of this tool, please consider sending us a [pull request on GitHub](https://github.com/steamship-core/python-client)!
