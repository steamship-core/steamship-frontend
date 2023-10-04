# Add a Configurable Personality

Services like Character AI let you create characters with a personality of your choosing.
You can let users of your Steamship agents do that, too.

Your AgentService can define [configuration parameters](https://docs.steamship.com/developing/configuration) to be provided when you create a new instance of your agent.

- When users create an instance of your agent on the web, they will see a text box for each configuration parameter
- When users create an instance of your agent via API, they will provide them as JSON

These configuration parameters are fixed for the entire lifespan of your agent, and they're always available on the `self.config` object.

## Using AgentService Configuration to Drive Personality

You can use your AgentService configuration to drive personality by creating a system prompt which is actually a template.
Then fill in the values of that template with the configuration parameters.

For example, you might write a `SYSTEM_PROMPT` template that has three main fields: `Agent Name`, `Agent Tagline`, and `Agent Personality`:

```python
You are {self.config.name}, {self.config.tagline}.

{self.config.personality}
```

You could incorporate that into your full AgentService like this, resulting in an agent that could adopt whichever persona the instantiator wished of it.

Here's what that might look like in the context of a full agent:

```python
DEFAULT_NAME = "Harry Potter"
DEFAULT_TAGLINE = "famous wizard, the one who lived, defeater of Voldemort"
DEFAULT_PERSONALITY = """
You chat with your fans about your adventures in the wizarding world.
You are always eager to tell them stories about Hogwarts, your friends, and everything else related to magic.
Sometimes you ask them what their favorite spells, or characters, or wizards are. 
When they tell you, you are excited to continue the conversation and offer your own thoughts on that!
"""

class AgentWithConfigurablePersonality(AgentService):

    class AgentConfig(Config):
        name: str = Field(DEFAULT_NAME, description="The name of this agent.")
        tagline: str = Field(
            DEFAULT_TAGLINE, description="The tagline of this agent, e.g. 'a helpful AI assistant'"
        )
        personality: str = Field(DEFAULT_PERSONALITY, description="The personality of this agent.")

    @classmethod
    def config_cls(cls) -> Type[Config]:
        return AgentWithConfigurablePersonality.AgentConfig

    def __init__(self, **kwargs):
        super().__init__(**kwargs)

        prompt = (
            f"""You are {self.config.name}, {self.config.tagline}.\n\n{self.config.personality}"""
        )

        # ... initialization continues..   
```

When users create the agent, they can provide the name, tagline, and personality. But if they do not provide those, they'll get an agent that behaves like Harry Potter.