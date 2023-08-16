# Run Your Agent

Run your agent on your local computer by typing the following in your terminal:

```python
ship run local
```

This command will boot a local server that provides a number of options to interact with your agent:

```python
~/multimodal-agent-starter (main*) » ship run local                                                                                                             1 ↵ edwardbenson@Steamship
Steamship Python CLI version 2.17.8
Running your project...

📝 Log file:   logs/shiplog--2023-07-13--16:06:27.log
🌎 Public API: https://some-identifier.ngrok-free.app
🌎 Local API:  http://localhost:8443
🌎 Web UI:     https://steamship.com/debug?endpoint=https://some-identifier.ngrok-free.app/prompt

💬 Interactive REPL below. Type to interact.

Starting REPL for Agent...
If you make code changes, restart this REPL. Press CTRL+C to exit at any time.

Input: _
```

You can use the console to REPL to begin talking with your agent immediately, but you can also:

* Use the Web UI to interact via your browser
* Use the local API endpoint to interact programmatically
* Use the public API endpoint to test integrations (e.g. with Telegram or Slack)

## Common Problems when Running

* **I'm getting an error that the port is in use.**
  Sometimes the development server gets stuck shutting down. Just re-run with another port number using the `--port` flag. 
  For example:  `ship run local --port 8889`. The original port will usually be released within about a minute.

* **I'm getting an NGROK error.**
  Sometimes VPNs or other network situations can cause complications with NGROK. Just run with the `--no-ngrok` flag to
  suppress the creation of a public URL. Note that this will prevent you from testing integrations with external webhooks.

* **I'm getting an error about the Steamship manifest or api.py file.**
  This may mean you're running the `ship run local` command from a directory other than the one containing your agent.
  Make sure you are running from your project directory and try again.