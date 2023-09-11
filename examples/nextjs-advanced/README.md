## Overview

This example repo uses:

1. [Clerk](https://clerk.com/) for authentication
2. [Vercel](https://vercel.com/) Postgres for a database
3. [Shadcn](https://ui.shadcn.com/) for it's ui
4. [Steamship](https://steamship.com) for a Multi-Modal agent

This demo application creates an AI Doggy Daycare where you can add dogs and chat with the dog trainer bot about the dogs you've added. You can ask questions about individual dogs, or ask for pictures.

## Getting Started

### Fork this project and setup a vercel account

1. Fork this repo
2. Create an account with [Vercel](https://vercel.com/)
3. Create a new project for the newly forked repo. Note: The deploy step will fail initialially. We will need to setup a few environmental variables before proceeding.

### Setup the Database

1. Within Vercel, open the new project, and select the "Storage" tab
2. Create a new postgres database
3. The environmental variables should be automatically set now within vercel. You can verify this by navigating to project settings > environmental variables > looking for postgres related env vars.

### Setup Clerk

1. Create an account with [Clerk](https://clerk.com/)
2. Create a new project
3. Copy your env vars into Vercel. These should be:

```
CLERK_SECRET_KEY="..."
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="..."
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
```

### Configure Steamship

1. Create an account with [Steamship](https://steamship.com)
2. Set the following environmental variables:

```
STEAMSHIP_API_KEY=YOUR_API_KEY
STEAMSHIP_API_URL="https://api.steamship.com"
STEAMSHIP_PACKAGE_HANDLE="ai-dog-trainer"
```

### Connect to Vercel locally & initialize the Prisma ORM

We use prisma to talk to our database and vercel to run our app locally.

1. Install the vercel cli `npm i -g vercel`
2. Install repo dependencies `npm i`
3. Connect to Vercel `vercel link`. Follow the prompts to connect to the project you just created
4. Generate the prisma types: `npx prisma generate`
5. Create the tables in the DB: `npm run dev:db-push`

### Running the app

1. `vercel dev`
