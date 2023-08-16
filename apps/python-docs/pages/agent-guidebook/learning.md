# Learning Information

You can add the ability to **learn things** to your agent.
When you do, each [new instance](/agent-guidebook/getting-started/share-your-agent) of your agent will maintain its own set of vector databases in which to put the information it learns.
These vector databases can be used in a number of ways, but the most common is to combine it with a [question answering tool](/learn/agent-guidebook/question-answering).

{% definition term="vector-database" /%}

Each section in this chapter covers a different way you may want your agent to learn information and how to accomplish it:

- [Learning facts from user conversations](/agent-guidebook/learning/learning-facts-from-users)
- [Learning from PDFs](/agent-guidebook/learning/learn-from-pdfs)
- [Learning from YouTube videos](/agent-guidebook/learning/learn-from-youtube)

## What you can build with this chapter

Together with the [Question Answering chapter](/agent-guidebook/question-answering), this chapter will let you build:

- An agent that answers questions about your PDFs or Books
- An agent that answers questions about your YouTube channel
- An agent that answers questions about facts you've uploaded via API
- An agent that remembers specific things for its human users and can answer questions about them later

You can combine these skills with [personalities](/agent-guidebook/personality/add-a-personality) to:

- Acts like a character from a book, with knowledge from having learned the book
- Acts like your favorite podcast host, with the ability to answer questions about specific interviews from having learned the YouTube videos
- Adopt a socratic tone, acting as a tutor who gives some, but not all, of an answer
- Acts as a friend who remembers your preferences and brings them up when chatting

You can combine these skills with [image generation](/agent-guidebook/generate-images) to:

- Generate imagined pictures from books or PDFs
- Fetch and send Google Image Search results relevant to an answer
