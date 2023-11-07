# LLMs

Your agent can use different LLMs to reason and generate its response to a user.

The [`LLM and ChatLLM base classes`](https://github.com/steamship-core/python-client/blob/main/src/steamship/agents/schema/llm.py) act as Steamship's standardized interfaces into all LLMs.
You can extend these classes to support your LLM, hosted anywhere. 

We also maintain official support for a handful of selected LLMs:

* [OpenAI and ChatOpenAI](https://github.com/steamship-core/python-client/blob/main/src/steamship/agents/llms/openai.py) - Which you can use with a number of OpenAI-based models, [listed here](https://github.com/steamship-plugins/gpt4/blob/540ca2d303afd516ca05317ef5e68801de82a332/src/api.py#L32C1-L32C1)
* [Replicate and ChatReplicate](https://github.com/steamship-core/python-client/blob/main/src/steamship/agents/llms/replicate.py) - Which you can use with the models [listed here](https://github.com/steamship-core/python-client/blob/main/src/steamship/agents/llms/replicate.py)

In our Agent SDK, you can use these LLMs without an API key.
Steamship provides its own enterprise keys and then bills your Steamship account *at cost*.
This ensures that anything you build and deploy to Steamship can be re-used by others (if you permit) with proper assignment of who pays the bill.

## How LLMs are used in Agents, and why you should care

There are different places in Agent development where you can select which LLM to use:

* **In the Core Agent** -- which often reasons about tools to run, outputs to combine, and responses to assemble for a user.
* **In a Tool** -- which often performs a narrow piece of work that might involve an LLM but also might not
* **In utility code** -- ad hoc, within your Agent Service. For example: in an API endpoint that performs some non-chat purpose.

It's important to understand that not all LLMs work well with all use cases.
 
For example:

* **GPT-4** has native support for the [FunctionsBasedAgent](https://github.com/steamship-core/python-client/blob/main/src/steamship/agents/functional/functions_based.py) which can use tools. If you want your agent to be able to call APIs for you, generate Stable Diffusion images, etc, then you should be using this pairing at the Agent level.
* **LLaMA v2 on Replicate** lacks native support for function-calling and tends to perform poorly with the [ReACTAgent](https://github.com/steamship-core/python-client/blob/main/src/steamship/agents/react/react.py) style prompting. It is probably not the right choice for your Agent if it's using tools.

On the other hand, for raw prompt generation:

* **GPT LLMs** tend to be careful in their responses and measured in tone: avoiding opinions, certain topics, and speculation. 
* **Self Hosted LLMs** can contain the ability to veer into conversations, mannerisms, of special expertise difficult to achieve with GPT

In that case, someone looking custom LLM behavior may elect to:

* Pair a function-calling agent, powered by GPT, with Tools which use a different LLM, [like this example](https://github.com/steamship-core/python-client/blob/main/src/steamship/agents/tools/text_generation/custom_llm_prompt.py)
* Implement a non-function-calling agent that exclusively uses a different LLM, [like this example](https://github.com/steamship-core/python-client/blob/main/src/steamship/agents/examples/example_chatbot_with_replicate.py)


