# Add APIs

Give your agent extra API endpoints

Your AgentService can define HTTP API endpoints.
These can be useful for loading information into your agent's vector stores, setting configuration dynamically, or performing other operations.

To do so, simply use the `@post` and `@get` decorators to define paths:

```python
from steamship.invocable import get, post

class MyAssistant(AgentService):
    @get("say_hello")
    def say_hello(self, name: str = None) -> str:
        """Accepts URL query-string `name` input."""
        return "Hello"

    @post("echo_number")
    def echo_number(self, number: int = None) -> dict:
        """Accepts a JSON-encoded post body."""
        return {"number": number}
```

More information on defining your own API endpoints is available in the [Steamship SDK Docs](https://docs.steamship.com/packages).