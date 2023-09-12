# Nextjs Auth and DB

This is an example of building a Next.js application with: Authentication, a Postgres DB, and Steamship agents.

## Deploy your own

Once you have access to [the environment variables you'll need](#set-up-environment-variables), deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=next-example):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/steamship-core/steamship-frontend/tree/main/examples/nextjs-advanced&project-name=steamship-web-app&repository-name=steamship-web-app&env=CLERK_SECRET_KEY,NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL,NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL,NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,NEXT_PUBLIC_CLERK_SIGN_IN_URL,NEXT_PUBLIC_CLERK_SIGN_UP_URL,STEAMSHIP_API_KEY,STEAMSHIP_API_URL,STEAMSHIP_PACKAGE_HANDLE)

**Important!** Once deployed, you'll need to [configure your database](#configure-the-database)

## Overview

This example repo uses:

1. [Clerk](https://clerk.com/) for authentication
2. [Vercel](https://vercel.com/) Postgres for a database
3. [Shadcn](https://ui.shadcn.com/) for it's ui
4. [Steamship](https://steamship.com) for a Multi-Modal agent

This demo application creates an AI Doggy Daycare where you can add dogs and chat with the dog trainer bot about the dogs you've added. You can ask questions about individual dogs, or ask for pictures.

## Set up Environment Variables

### Clerk

1. Create an account with [Clerk](https://clerk.com/)
2. Create a new project
3. Set the following env vars in Vercel

```
CLERK_SECRET_KEY=YOUR_CLERK_SECRET_KEY
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=YOUR_CLERK_PUBLISHABLE_KEY
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
```

### Configure Steamship

1. Create an account with [Steamship](https://steamship.com)
2. Get your API Key [here](https://www.steamship.com/account/api)
3. Set the following env vars in Vercel:

```
STEAMSHIP_API_KEY=YOUR_API_KEY
STEAMSHIP_PACKAGE_HANDLE=ai-dog-trainer
```

## Configure the Database

1. Within Vercel, open the new project, and select the "Storage" tab
2. Create a new postgres database
3. The environment variables should be automatically set now within vercel. You can verify this by navigating to project settings > environmental variables > looking for postgres related env vars.

More on setting up your database can be found here: https://vercel.com/docs/storage/vercel-postgres/quickstart.

### Create the database tables

We use prisma to talk to our database.

1. Install the vercel cli `npm i -g vercel`
2. Install repo dependencies `npm i`
3. Connect to Vercel `vercel link`. Follow the prompts to connect to the project you just created
4. Generate the prisma types: `npx prisma generate`

#### Update the production DB

1. `vercel pull --environment=production`
2. Create the tables in the DB: `npm run prod:db-push`

#### Update the development DB

1. `vercel pull --environment=development`
2. Create the tables in the DB: `npm run dev:db-push`

### Redeploy your appplication

After configuring your production database. Make sure to re-deploy your project. You can do that by navigating to your project in Vercel and clicking the redeploy option.

## Local Development

1. `vercel dev`
