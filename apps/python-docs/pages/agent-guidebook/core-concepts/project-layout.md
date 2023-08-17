# Project Layout

Here's a quick guide to your [agent project](https://github.com/steamship-core/multimodal-agent-starter).

The starting codebase is small but very extensible.

- It's built atop the [Steamship SDK](https://github.com/steamship-core/python-client), which you can think of as Flask for AI Agents.
- It deploys to the [Steamship Cloud](https://steamship.com), which manages all the AI orchestration & monitoring to power your agent.

## Key Files

There are only three critical files required to run and deploy an agent to Steamship:

- `steamship.json` contains information used during deployment: your agent's name, version, etc.
- `requirements.txt` contains pip modules your agent depends upon. This is necessary to run in the cloud.
- `src/api.py` contains:
  - your `AgentService`, which is a Flask-like API container
  - the `Agent` within it, with access to Tools, LLMs, Memory, and async task queues

Everything else in the starter project is just a convenience file to help things build & run smoothly.
