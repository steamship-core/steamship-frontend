# Tools

Tools help your agent perform actions or fetch information from the outside world.

Your starter project already has a few tools in [`src/example_tools`](https://github.com/steamship-core/multimodal-agent-starter/blob/main/src/example_tools/) that you can edit and use.

And you can import or find more open source tools in the [Steamship SDK](https://github.com/steamship-core/python-client):

- Audio Transcription:
  - [Assembly AI](https://github.com/steamship-core/python-client/blob/main/src/steamship/agents/tools/audio_transcription/assembly_speech_to_text_tool.py) - Turns audio into text
  - [Whisper](https://github.com/steamship-core/python-client/blob/main/src/steamship/agents/tools/audio_transcription/whisper_speech_to_text_tool.py) - Turns audio into text
  - [RSS Download](https://github.com/steamship-core/python-client/blob/main/src/steamship/agents/tools/audio_transcription/fetch_audio_urls_from_rss_tool.py) - Returns Audio URLs from an RSS feed
- Classification:
  - [Sentiment Analysis](https://github.com/steamship-core/python-client/blob/main/src/steamship/agents/tools/classification/sentiment_analysis_tool.py) - Can report on the sentiment of a piece of text
  - [Zero Shot Classification](https://github.com/steamship-core/python-client/blob/main/src/steamship/agents/tools/classification/zero_shot_classifier_tool.py) - Can classify a piece of text
- Image Generation:
  - [DALL-E](https://github.com/steamship-core/python-client/blob/main/src/steamship/agents/tools/image_generation/dalle.py) - Generate images with DALL-E
  - [Stable Diffusion](https://github.com/steamship-core/python-client/blob/main/src/steamship/agents/tools/image_generation/stable_diffusion.py) - Generate images with Stable Diffusion
  - [Google Image Search](https://github.com/steamship-core/python-client/blob/main/src/steamship/agents/tools/image_generation/google_image_search.py) - Perform a Google Image Search and return the results
- Speech Generation:
  - [Eleven Labs](https://github.com/steamship-core/python-client/blob/main/src/steamship/agents/tools/speech_generation/generate_speech.py) - Turn text into the spoken word
- Search:
  - [Google Search](https://github.com/steamship-core/python-client/blob/main/src/steamship/agents/tools/search/search.py) - Find answers to questions on the web
- Question Answering:
  - [Vector Search QA](https://github.com/steamship-core/python-client/blob/main/src/steamship/agents/tools/question_answering/vector_search_qa_tool.py) - Find answers to questions in the Steamship Vector Database
  - [Prompt Database QA](https://github.com/steamship-core/python-client/blob/main/src/steamship/agents/tools/question_answering/prompt_database_question_answerer.py) - Find answers to questions from a pre-loaded prompt database
- Text Generation:
  - [Image Prompt Generation](https://github.com/steamship-core/python-client/blob/main/src/steamship/agents/tools/text_generation/image_prompt_generator_tool.py) - Rewrite a topic into a Stable Diffusion image prompt
  - [Personality Tool](https://github.com/steamship-core/python-client/blob/main/src/steamship/agents/tools/text_generation/personality_tool.py) - Reword a response according to a particular personality
  - [Text Summarization](https://github.com/steamship-core/python-client/blob/main/src/steamship/agents/tools/text_generation/summarize_text_with_prompt_tool.py) - Summarize text
  - [Text Rewriter](https://github.com/steamship-core/python-client/blob/main/src/steamship/agents/tools/text_generation/text_rewrite_tool.py) - Utility tool for building tools that use prompts to operate
  - [Translation](https://github.com/steamship-core/python-client/blob/main/src/steamship/agents/tools/text_generation/text_translation_tool.py) - Translate text using an LLM
- Conversation Starters:
  - [Knock Knock Joke Starter](https://github.com/steamship-core/python-client/blob/main/src/steamship/agents/tools/conversation_starters/knock_knock_tool.py) - Initiate a knock knock joke. The world's most useful tool.

## Tools are run in the Cloud

Every Steamship tool is managed for you and run in the cloud. That way you, and your agent, can use them like Python functions without worrying about:

- **Authentication** (for tools that require it, like DALL-E)
- **Logging** so you can track what each agent is doing
- **Metering** so you can track how much each agent is using
- **Load balancing & rate limiting** so you don't have to worry about overloading API endpoints
- **Retry on error** so you don't have to add your own retry logic
- **Async execution** so you can kick off large jobs without worrying about HTTP timeouts

## Building your own tool

A tool is just a basic Python class with a few fields:

```python
class TextRewritingTool(Tool):
    name: str = "TextRewritingTool"
    human_description: str = "Rewrites a piece of text using the provided prompt."
    agent_description: str = "Used to rewrite a piece of text given a prompt. Takes text as input, and provides text as output."

    def run(self, tool_input: List[Block], context: AgentContext) -> Union[List[Block], Task[Any]]:
        pass
```

For now, tools should return lists of [Blocks](https://docs.steamship.com/data/blocks). Async support is coming soon.

- The `name` field is the token that will be used by the ReACT LLM to request the tool.
- The `human_description` is used for logging output for human consumption
- The `agent_description` is used to tell the LLM how the tool should be used.
- The `run` method returns `Block` objects instead of `str` (as with some other frameworks) in order to support multi-modal output.

The `AgentContext` object contains a copy of the [Steamship Client](https://docs.steamship.com/) which is pre-authenticated into the [workspace](https://docs.steamship.com/data/workspaces) in which your agent is running.

That means the tools you write can use it for:

- [Vector Search](https://docs.steamship.com/embedding-search)
- [Key-Value storage](https://github.com/steamship-core/python-client/blob/main/src/steamship/utils/kv_store.py)
- [File storage](https://docs.steamship.com/data/files)
- And arbitrary model invocation on data you have
