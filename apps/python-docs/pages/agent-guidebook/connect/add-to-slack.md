# Add your agent to Slack

You can add your agent to Slack as a bot

Use the [`SlackTransport` Mixin](https://github.com/steamship-core/python-client/blob/main/src/steamship/agents/mixins/transports/slack.py) to connect your agent to a Slack Bot.

**[A full working example is here](https://github.com/steamship-core/multimodal-agent-starter/blob/main/src/example_agents/slack_bot.py)**.
You can copy and paste this agent into your `api.py` file or use it as a reference.

{% definition term="mixin" /%}

## Adding the `SlackTransport` Mixin

1. Add `SlackTransport` to the static `USED_MIXIN_CLASSES` list in your AgentService
2. Register `SlackTransport` in your AgentService `__init__` with
   ```python
   self.add_mixin(SlackTransport(
       self.client,
       config=SlackTransportConfig(),
       self, 
       self.agent
   ))
   ```

## Connecting your Steamship Agent to Slack

With your Steamship agent running in either development or production:

1. Visit the `/slack_install_link` method of your agent instance. This will generate a URL that will initiate Slack's installation process.
2. Within the Slack admin console, complete the installation process.
3. Within the Slack admin console, fetch your Slack API Token 
4. Invoke the `/set_slack_access_token' method of your agent instance with the body `{"token": "YOUR TOKEN"}`.
5. From a Slack chatroom, mention your bot by name. It should respond!

## Testing your Slack Connection

{% versionRequirement version="2.17.18" /%}

You do not need to deploy your agent to test the Slack connection -- you can test with Slack directly from your local machine.

Run `ship run local` to run a local copy of your Agent with the provided configuration.

It will automatically create a public URL using Ngrok that enables it to receive Slack notifications. Then follow the instructions above as if it were running in production.

Note that you will have to repeat the entire Slack installation process every time you stop your development server to update your agent's code.
For this reason, we recommend **testing your agent via the REPL, not Slack** and then only testing against Slack just prior to final deployment. There is no need to use Slack in your Agent development loop.

## Using your Slack Connection in Production

After [deploying](/agent-guidebook/getting-started/deploy-your-agent), when you [create an instance from the web](/agent-guidebook/getting-started/share-your-agent) just follow the instructions above.
