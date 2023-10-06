# Steamship Typescript Client Library

Typescript library for communicating with Steamship Agents.

## Installation

```
  npm i @steamship/client
```

## Documentation

Documentation is stored here:

[https://docs.steamship.com/](https://docs.steamship.com/)

 @vercel/ai integration to come in followup 3.0.1 release.

## Command Line Utils

When developing an this package or an Agent, it can be helpful to see what the streaming response to a given input would be.

Assuming you have the following:
- A `~/steamship.json` credential file
- The Agent Base URL. To get this url...
  - ...while developing an agent: run `ship run local` from your Steamship project
  - ...for an agent running in the cloud: see the **Connect > Vercel** tab for your Agent's Base URL

Simply run:

```bash
npm run prompt BASE_URL "Input String"
```