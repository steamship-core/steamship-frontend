# Memory

Your agent can remember and reference previous parts of conversation with users by leveraging its memory.

The storage mechanism for memory is the `ChatHistory` object. It allows agents to record and access 
the interactions that it has with users and format it for addition into prompts.

`ChatHistory` is available within the `AgentContext` object, which can be accessed from `Agents` and `Tools`. Implementors of `Agents`, 
`Tools`, and `Transports` can decide when is the appropriate time to append conversational data to the `ChatHistory` object.

Conversation in `ChatHistory` can be accessed linearly or via `search`, which is backed by Steamship's vector database.

## Fetching by context keys

If you need to keep different `ChatHistory` objects for different contexts (different users, for example) you 
can control which `AgentContext` object you receive by passing different context keys to `AgentContext.get_or_create`. Context keys
are an arbitrary dict; sending the same keys means you will receive the same context object back.

For example, the Telegram transport uses the Telegram `chat_id` to create contexts specific to individual chats.

## Windowing access to memory

Since we cannot pass infinite tokens into LLMs for context, we must choose which pieces of the 
memory to pass into LLM prompts. The `MessageSelector` interface is for choosing which pieces of 
the `ChatHistory` object are relevant for the current situation.

Two `MessageSelectors` are provided with Steamship:
- `MessageWindowMessageSelector` selects the `n` most recent user or assistant messages
- `TokenWindowMessageSelector` selects the most recent user or assistant messages, up to a specified number of tokens

You may also implement your own `MessageSelectors` to filter messages in the way you see fit. Using `MessageSelectors` 
allows you fine control over the amount of context and cost incurred by including it.

## Using memory in your agent

When implementing an `Agent`, you can decide how to incorporate `ChatHistory` into the messages sent
to the LLM. By default, the `FunctionsBasedAgent` uses both messages from search history and a set of most
recent messages in its history.

The code for the use of memory lives in the `next_action` method of `FunctionsBasedAgent`:

```
    def next_action(self, context: AgentContext) -> Action:
        messages = []

        # get system messsage
        system_message = Block(text=self.PROMPT)
        system_message.set_chat_role(RoleTag.SYSTEM)
        messages.append(system_message)
        
        messages_from_memory = []
        
        # get prior conversations
        if context.chat_history.is_searchable():
            messages_from_memory.extend(
                context.chat_history.search(context.chat_history.last_user_message.text, k=3)
                .wait()
                .to_ranked_blocks()
            )

            # remove the actual prompt from the semantic search (it will be an exact match)
            messages_from_memory = [
                msg
                for msg in messages_from_memory
                if msg.id != context.chat_history.last_user_message.id
            ]

        # get most recent context
        messages_from_memory.extend(context.chat_history.select_messages(self.message_selector))

        # de-dupe the messages from memory
        ids = []
        for msg in messages_from_memory:
            if msg.id not in ids:
                messages.append(msg)
                ids.append(msg.id)

        # put the user prompt in the appropriate message location
        # this should happen BEFORE any agent/assistant messages related to tool selection
        messages.append(context.chat_history.last_user_message)
        
        # get completed steps
        actions = context.completed_steps
        for action in actions:
            messages.extend(action.to_chat_messages())

        # call chat()
        output_blocks = self.llm.chat(messages=messages, tools=self.tools)

        return self.output_parser.parse(output_blocks[0].text, context)
```

If you wish to use memory differently in tool selection (and otherwise) for your agent, you can extend `FunctionsBasedAgent` to override
`next_action`.

## Difference between `ChatHistory` and `AgentContext.completed_steps`

By convention, `ChatHistory` is updated whenever messages are exchanged between a user and 
your `AgentService`. This means that the only messages in the history are the ones that are part
of a two-way conversation between your agent and you.

The actions that an `Agent` takes in order to answer a prompt are stored in `AgentContext.completed_steps`. 
Those steps represent the internal state of an `Agent` as it works through trying to answer a prompt. This "thinking"
area is refreshed with  each new prompt, and is not added to `ChatHistory` (avoiding message pollution).