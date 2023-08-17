# AgentService, aka api.py

The `src/api.py` file contains the `AgentService` that houses your agent.

* Run it on localhost with `ship run local`
* Deploy it to the cloud with `ship deploy`

Once deployed to the cloud, you can create multiple instances of it, each with its own private data, logging, and billing.

The minimum viable `api.py` is:

```python
from steamship.agents.functional import FunctionsBasedAgent
from steamship.agents.llms.openai import ChatOpenAI
from steamship.agents.service.agent_service import AgentService


class MyAssistant(AgentService):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self._agent = FunctionsBasedAgent(llm=ChatOpenAI(self.client), tools=[])
```

But you'll probably want an agent you can talk to on the web and via a chat app.

To add both web and Telegram support, just you can use **Transport Mixins**. 
Mixins are like plugins for your agent -- they add capabilities that define endpoints, webhooks, and async task queues.
Transport mixins add ways to connect to different kinds of chat services.

Here is the same ChatGPT service above with Web Widget and Telegram support:

```python
from typing import Type

from pydantic import Field

from steamship.agents.examples.telegram_bot import TelegramBot
from steamship.agents.functional import FunctionsBasedAgent
from steamship.agents.llms.openai import ChatOpenAI
from steamship.agents.mixins.transports.steamship_widget import SteamshipWidgetTransport
from steamship.agents.mixins.transports.telegram import TelegramTransport, TelegramTransportConfig
from steamship.agents.service.agent_service import AgentService
from steamship.invocable import Config
from steamship.utils.repl import AgentREPL


class MyAssistant(AgentService):
    class MyAssistantConfig(Config):
        bot_token: str = Field(description="The secret token for your Telegram bot")

    config: MyAssistantConfig

    @classmethod
    def config_cls(cls) -> Type[Config]:
        return TelegramBot.TelegramBotConfig

    def __init__(self, **kwargs):
        super().__init__(**kwargs)

        self._agent = FunctionsBasedAgent(llm=ChatOpenAI(self.client), tools=[])

        # This Mixin provides HTTP endpoints that connects this agent to a web client
        self.add_mixin(
            SteamshipWidgetTransport(client=self.client, agent_service=self, agent=self._agent)
        )
        # This Mixin provides support for Telegram bots
        self.add_mixin(
            TelegramTransport(
                client=self.client,
                config=TelegramTransportConfig(bot_token=self.config.bot_token),
                agent_service=self,
                agent=self._agent,
            )
        )
```

