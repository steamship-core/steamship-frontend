<a id="data-model"></a>

# Data Model

There are only three core concepts you need to know.

1. [Files](/data/files.md#files) are the top level object for storing data. A `File` can store raw data and an ordered list of `Blocks`.
2. [Blocks](/data/blocks.md#blocks) are chunks of content within a `File`.  They can contain raw data and/or text, and an unordered set of `Tags`.
3. [Tags](/data/tags.md#tags) are typed annotations on a `Block` or `File`.

The following diagram shows how data is created and used within Steamship:

![Lifecycle of a File](//data/data/file-lifecycle.png)
1. File raw data can either be [created directly](/data/files.md#creating-files-directly) or [imported via a File Importer](/data/../plugins/using/importers#file-importers)
2. Blocks on Files can either be [created directly](/data/blocks.md#creating-blocks) or [created from raw data by a Blockifier](/data/../plugins/using/blockifiers#blockifiers)
3. Once you have blocks, you can run [Generators](/data/../plugins/using/generators#generators) and [Taggers](/data/../plugins/using/taggers#taggers)
4. Find data that you need by [querying](/data/queries#queries)
5. Index data for search with [the embedding search index](/data/../embedding-search#embedding-search-index)

* [Workspaces](/data/workspaces.md)
* [Files](/data/files.md)
* [Blocks](/data/blocks.md)
* [Tags](/data/tags.md)
* [Querying Data](/data/queries)
