# Transcribe and Learn from YouTube Videos

Give your agent the ability to watch and remember YouTube videos

Use the [`IndexerPipelineMixin`](https://github.com/steamship-core/python-client/blob/main/src/steamship/invocable/mixins/indexer_pipeline_mixin.py) to give your agent the ability to watch and remember YouTube videos.

**[A full working example is available here](https://github.com/steamship-core/multimodal-agent-starter/blob/main/src/example_agents/document_qa_agent.py)**. You can copy and paste this agent into your `api.py` file or use it as a reference.

{% definition term="mixin" /%}

## Adding the `IndexerPipelineMixin`

1. Add `IndexerPipelineMixin` to the static `USED_MIXIN_CLASSES` list in your AgentService
2. Register `IndexerPipelineMixin` in your AgentService `__init__` with
   ```python
   self.add_mixin(IndexerPipelineMixin(self.client, self))
   ```

Adding this mixin registers an entire asynchronous document processing pipeline to your agent, along with an API endpoint (`/learn_url`) to access it.

This pipeline will:

- Import provided URLs
- Convert them to text format (currently only PDF and YouTube are supported -- see the Customizing section below!)
- Chunk the data for use question-answering Tools
- Embed each chunk into your agent's default Vector Database (created on-demand for it)


## Learning new content with `IndexerPipelineMixin`
   
**NOTE: `IndexerPipelineMixin` currently only functions in deployed agents. You will have to run `ship deploy` to learn new information with this Mixin.**

### Via API

Any `AgentService` with the `IndexerPipelineMixin` gains two authenticated endpoints `/index_url` and `/index_text` that let you load information into your agent.

To view the documentation for your agent's learning endpoints:

1. [Deploy your agent](/agent-guidebook/getting-started/deploy-your-agent) if you haven't done so already
2. [Create an instance](/agent-guidebook/getting-started/share-your-agent) so that you can use it
3. [View your agent instance's web page](/agent-guidebook/connect/use-on-the-web)
4. Click on the **Manage** tab of your agent instance's web page
5. Click on the **API** tab in your agent's management console
6. Click on either the `/index_url` or `/index_text` endpoints for customized API documentation

In the case of PDF files, simply provide the URL of the PDF file to the `/index_url` argument as directed by the API documentation.

### Via the Web Interface

Proceed just as with the instructions for API learning, but use the auto-generated web endpoint for the API method.

Note that you only need to provide the `url` argument.

## YouTube Specific Notes

The open source tools used to scrape YouTube videos have a high error rate.

When you use the `IndexerPipelineMixin` to scrape YouTube videos, you should expect that up to 70-80% of your attempts to scrape a video will fail.

In our experience, simply trying a few times, adding a generous (1-2 second) timeout between attempts generally results in success after a few tries.

## Customizing the Behavior of `IndexerPipelineMixin`

Steamship mixins are just open-source Python.
The source for this mixin is available [here](https://github.com/steamship-core/python-client/blob/main/src/steamship/invocable/mixins/indexer_pipeline_mixin.py).
You can customize it by copy-pasting the tool into your own project, changing the code, and then using your new version.

This particular tool works by:

1. Loading three other mixins:
   1. The [`FileImporterMixin`](https://github.com/steamship-core/python-client/blob/main/src/steamship/invocable/mixins/file_importer_mixin.py), which adds API endpoints to scrape data from the web and YouTube.
   2. The [`BlockifierMixin`](https://github.com/steamship-core/python-client/blob/main/src/steamship/invocable/mixins/blockifier_mixin.py), which adds API endpoints to convert PDF and Video data to text.
   3. The [`IndexerMixin`](https://github.com/steamship-core/python-client/blob/main/src/steamship/invocable/mixins/indexer_mixin.py), which adds API endpoints chunk and embed documents into a vector database, for use with question-answering tools.
2. Adds an API endpoint which orchestrates an asynchronous task pipeline that scrapes, converts, chunks, embeds, and stores documents in a vector database.

This pipeline is open source Python and very customizable: you can incorporate tools such as LlamaIndex or LangChain if they contain specific importers or splitters you need.

Here are some ideas for how you might extend it:

- Extend the `FileImporterMixin` to support auto-detection of new URL types, such as Wikipedia or the SEC's EDGAR database
- Extend the `BlockifierMixin` to support new filetypes, such as images (via OCR or other image-to-text models)
- Extend the `IndexerMixin` to utilize different text chunking/splitting strategies
- Add a `/learn_website` endpoint which scrapes an entire website and schedules the learning of it

If you create an interesting customization of this tool, please consider sending us a [pull request on GitHub](https://github.com/steamship-core/python-client)!
