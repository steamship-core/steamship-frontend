<a id="plugins"></a>

# Plugins

[Steamship Plugins](https://www.steamship.com/plugins) perform specific tasks related to AI.

- How to [use plugins](/plugins/using#using-plugins)
- How to [develop plugins](/plugins/developing#developingpluginssec)

Steamship supports the following types of plugins:

## File Importers

Importers pull raw data from common external sources into a [File](/plugins/../data/files.md#files).

*Examples*: A YouTube video importer imports video content given a URL, A Notion importer imports a document from a Notion space.

- [Using File Importers](/plugins/using/importers#file-importers)
- [Developing File Importers](/plugins/developing/importers.md#developingfileimporters)

## Blockifiers

Blockifiers extract text and other content from raw data in a [File](/plugins/../data/files.md#files) to [Blocks](/plugins/../data/blocks.md#blocks).

*Examples*: Whisper speech to text turns an audio file into a text transcript, a PDF extractor could pull the text chunks and images from a PDF document.

- [Using Importers](/plugins/using/blockifiers#blockifiers)
- [Developing Importers](/plugins/developing/blockifiers.md#developingblockifierssec)

## Taggers

Taggers create [Tags](/plugins/../data/tags.md#tags) (annotations) on [Files](/plugins/../data/files.md#files) and [Blocks](/plugins/../data/blocks.md#blocks).

*Examples*: A text classifier would attach a classification `Tag` to a `Block`, an image object recognizer would add `Tags` to a `Block` that identified known objects.

- [Using Taggers](/plugins/using/taggers#taggers)
- [Developing Taggers](/plugins/developing/taggers.md#developingtaggers)

## Generators

Generators create new content from existing content.

*Examples*: GPT4 creates more text based on the existing text in a conversation, DALL-E creates an image based on a description.

- [Using Generators](/plugins/using/generators#generators)
- [Developing Taggers](/plugins/developing/generators.md#developinggenerators)

## Embedders

Embedders convert content into a vector representation. This is primarily used in combination with Steamship’s built in :ref:<Embedding Search Index>.

*Examples*: Use OpenAI to embed sentences into vectors for search; embed images into vectors for search

- [Using Embedders](/plugins/using/embedders#embedders)
- [Developing Embedders](/plugins/developing/embedders.md#developingembedders)
