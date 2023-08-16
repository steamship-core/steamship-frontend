# Deploy Your Agent

To deploy your agent to the cloud, just open a shell and type:

```bash
ship deploy
```

Your first time, you'll be asked a few questions:

- **What you want to name your agent.** Choose a name with only lowercase letters and dashes.
- **What version you want.** You can just accept the default suggestion

After you've completed those questions, you'll see the following:

```text
Deployment was successful. View and share your new package here:

https://steamship.com/packages/{your-agent-name}
```

Click that URL to create a new instance of your agent.

## What exactly IS deployment?

Deploying your agent is like releasing software:

- Your agent will get a name, like `customer-service-bot`
- Your deployment will result in a version, like `1.0.0`

That version -- `customer-service-bot@1.0.0` -- lives in the cloud.
If you deployed it as a `public` agent, anyone can create their own **instances**.

Each instance is separate. It's a running copy of your agent.

- It has its own data & memory
- It provides its own API & Web interface
- It is pinned to a version of your agent

## How do I deploy Version 2?

Whenever you want to deploy a new version, just run:

```bash
ship deploy
```

The wizard will ask you what the new version number should be and push it up to the cloud.

The most recently deployed version always becomes the default version for new instances.

{% callout type="warning" title="Deploying a new version doesn't upgrade running ones!" %}

When you deploy a new version, it's like releasing a new version of software.

The agent instances already running in the cloud continue to run on whatever version they were created with.

Reach out to us at crew@steamship.com if this is problematic and we can assist with upgrading.
{% /callout %}
