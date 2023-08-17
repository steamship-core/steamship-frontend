# Generate Speech

Your agent can speak to you with a voice.

**This is a preview: we'll add official support soon**.

The [`src/example_agents/captain_picard_with_voice.py`](https://github.com/steamship-core/multimodal-agent-starter/blob/main/src/example_agents/captain_picard_with_voice.py) agent in your example project shows how to return spoken output instead of text.

That agent overrides the `run_agent` method of Agent service to patch each `emit_func` in `AgentContext` with a function that transforms any outgoing text into a voice block:

```python
def run_agent(self, agent: Agent, context: AgentContext):
    """Override run-agent to patch in audio generation as a finishing step for text output."""

    speech = GenerateSpeechTool()
    speech.generator_plugin_config = {
        "voice_id": "pNInz6obpgDQGcFmaJgB"  # Adam on ElevenLabs
    }
    def to_speech_if_text(block: Block):
        nonlocal speech
        if not block.is_text():
            return block

        output_blocks = speech.run([block], context)
        return output_blocks[0]

    # Note: EmitFunc is Callable[[List[Block], Metadata], None]
    def wrap_emit(emit_func: EmitFunc):
        def wrapper(blocks: List[Block], metadata: Metadata):
            blocks = [to_speech_if_text(block) for block in blocks]
            return emit_func(blocks, metadata)
        return wrapper

    context.emit_funcs = [wrap_emit(emit_func) for emit_func in context.emit_funcs]
    super().run_agent(agent, context)
```

## Full-working examples of `GenerateSpeechTool`

The following examples can be copy-pasted into your project:

- [CaptainPicardWithVoice](https://github.com/steamship-core/multimodal-agent-starter/blob/main/src/example_agents/captain_picard_with_voice.py) - Uses `GenerateSpeechTool` to generate spoken responses from a pretend starship captain.

## Use a custom voice

Our `GenerateSpeechTool` is powered by Eleven Labs. To use a custom public voice, simply invoke the tool as follows:

```python
speech = GenerateSpeechTool()
speech.generator_plugin_config = {
    "voice_id": "pNInz6obpgDQGcFmaJgB"  # Adam on ElevenLabs
}
```

To use a private voice, provide your own API key as well:

```python
speech = GenerateSpeechTool()
speech.generator_plugin_config = {
    "voice_id": "your-voice"
    "elevenlabs_api_key": "your-api-key"
}
```

To alter the voice stability and similarty boost, you can provide those parameters:

```python
speech = GenerateSpeechTool()
speech.generator_plugin_config = {
    "stability": 0.5,
    "similarity_boost": 0.8
}
```
