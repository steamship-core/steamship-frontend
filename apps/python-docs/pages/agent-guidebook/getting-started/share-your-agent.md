# Share Your Agent

When you run `ship deploy`, you will see output that looks like this:

```text
Deployment was successful. View and share your new package here:

https://steamship.com/packages/{your-agent-name}
```

You can think of that URL as your agent's **app store page**: it's a URL you can share with others to create their own instances of what you've built.

Each instance is separate. It's a running copy of your agent.

- It has its own data & memory
- It provides its own API & Web interface
- It is pinned to a version of your agent
- Any cloud service usage is associated with the account that created the instance.

{% callout type="warning" title="You can only share public agents" %}

When you deployed for the first time, you have to mark your agent as `public` if you wish to share it.

{% /callout %}
