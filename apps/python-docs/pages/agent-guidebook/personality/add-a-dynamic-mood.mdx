# Add Mood

Your agent's personality can change over time based on memories and events.

- You can program it to act caring for the next 24 hours after you've told it you've had a bad day.
- You can program it to challenge you if you ask it to help prepare for an interview.

They key to achieving this is the following strategy:

1. Mood is just a temporary change or addition to the personality prompt.
2. You save moods & mood timeouts using Steamship's persistence stack.
3. You can detect when to activate a mood in a number of places of your agent's operation.

Let's unpack this below.

## Mood is just a temporary change to personality.

For example, imagine your `SYSTEM_PROMPT` contains the following instructions:

```python
SYSTEM_PROMPT = """Who you are:
- You are a helpful assistatnt.
- You are kind, compassionate, and optimistic.

How you behave:
- You engage in casual conversations and have feelings.
- You always help with a user's question.
- You include supportive ideas that extend ideas posed to you.
"""
```

You could imagine breaking this system prompt into a default prompt, plus a mood:

```python

WHO_YOU_ARE_MOODS = {
    "normal": """- You are a helpful assistatnt.
- You are kind, compassionate, and optimistic.""",
   "mischievous": """- You are a mischievous assistatnt.
- You are mostly kind, but enjoy pranking others."""
}

HOW_YOU_BEHAVE_MOODS = {
    "normal": """- You always help with a user's question.
- You include supportive ideas that extend ideas posed to you.""",
   "mischievous": """- You always answer a user's question, but you intentionally misinterpret the meaning in a silly way.
- You include pretend to be surprised when accused of intentionally misinterpreting a user's words."""
}

SYSTEM_PROMPT = """Who you are:
{who_you_are_mood_extension}

How you behave:
- You engage in casual conversations and have feelings.
{how_you_behave_mood_extension}
  """
```

You've essentially templatized the system prompt into two layers:

- The personality layer, which always applies (this is your agent's personality)
- The mood layer, which may differ based on the agent's mood (listed as `normal` and `mischievous` above)

To get the final system prompt, you need only use Python's built-in string formatting:

```python

mood = "mischievous"
who_you_are_mood_extension = WHO_YOU_ARE_MOODS[mood]
how_you_behave_mood_extension = HOW_YOU_BEHAVE_MOODS[mood]
final_system_prompt = SYSTEM_PROMPT.format(
    who_you_are_mood_extension=who_you_are_mood_extension,
    how_you_behave_mood_extension=how_you_behave_mood_extension
)
```

## Save a mood & timeout using Steamship's persistence stack

The above description shows you how to add a mood, but not how to save that mood so that your Agent will maintain it until you want otherwise.

You can save it using Steamship's `KeyValueStore`, which is available **anywhere** in your agent that has access to the Steamship client or `AgentContext`.

```python
import time
from steamship.utils.kv_store import KeyValueStore

MOOD_KEY = "agent-mood"

def set_mood(mood: str, lasts_for_seconds: int = 60, context: AgentContext):
    """Set a mood on the agent."""
    kv = KeyValueStore(client=context.client, MOOD_KEY)
    mood_settings = {
        "current_mood": "mischievous",
        "mood_expires_on": time.time() + lasts_for_seconds
    }
    # Note: The root value to the key-value store MUST be dict objects.
    kv.set("mood", mood_settings)

def get_mood(context: AgentContext) -> str:
    """Get the mood on the agent."""
    kv = KeyValueStore(client=context.client, MOOD_KEY)
    now = time.time()
    mood_settings = kv.get("mood") or {}
    current_mood = mood_settings.get("current_mood", "normal")  # Fails back to 'normal'
    mood_expires_on = mood_settings.get("mood_expires_on", now)  # Fails back to `now`

    if now >= mood_expires_on:
        return "normal"
    return current_mood
```

## Activate a mood in a number of places

This documentation is somewhat open-ended because "AI mood swings" aren't exactly well understood territory.
That said, here are a few ideas for how you might incorporate moods into your agent:

- **From inside a `Tool`**: When a `Tool` runs, it has access to the `AgentContext`, which means it can have a side effect of persisting a mood.

- **By listening the Agent's Message traffic** You could augment the `Agent` class to listen to messages. In addition to planning work & responding with LLMs, you could react to keywords in the messages going back and forth by altering your agent's mood.
- **Via API Endpoint** Your `AgentService` allows you to add arbitrary `HTTP GET` and `HTTP POST` endpoints. You can use these to create a API that manually changes the mood.

## Challenges to expect

The above technique blends mood into your `SYSTEM_PROMPT`.

This can work well, but it also means you'll have to engineer your mood descriptions that don't interact badly with the other purposes of that prompt.
(In a way, this isn't so different that a strong mood impairing the normal behavior of us humans.)
