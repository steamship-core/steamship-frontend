# Steamship

Steamship is an SDK and hosting platform for AI Agents and Tools.

**Follow our [Agent Guidebook](/agent-guidebook) for a complete tutorial.**  

## Steamship in 30 seconds

- [Build Agents](/agent-guidebook) which run in the cloud.
- [Use Plugins](plugins/using#using-plugins) for common operations like generating text with GPT, converting a CSV to text, or generating an image from text. Steamship manages asynchronicity and retries.
- [Store data in Files, Blocks, and Tags](data#data-model). This allows you to [query](data/queries#queries) or [search](embedding-search#embedding-search-index) it later.
- [Deploy as a Package](packages/developing#developing-packages), creating a scalable API for your front end.
- [Create as many instances of the Package](packages/developing#creating-package-instances) as you want, each with its own data.

## Start from our Multimodal Agent Template

Clone our starter repository:

```bash
git clone https://github.com/steamship-core/multimodal-agent-starter
```

Create a virtual environment and install dependencies:

```bash
python3 -m venv venv
source venv/bin/activate

pip install -r requirements.txt
pip install -r requirements.dev.txt
```

Then run:

```bash
ship run local
````

Now that you've interacted with your new agent, you're ready to start modifying it in `src/api.py`.

See the **[Agent Guidebook](/agent-guidebook)** for details.

# Contents

* [Agent Guidebook](agent-guidebook)
* [Configuration](configuration)
  * [Authentication](configuration/authentication.md)
    * [Steamship Configuration File](configuration/authentication.md#steamship-configuration-file)
    * [Using Multiple Profiles](configuration/authentication.md#using-multiple-profiles)
    * [Environment Variables](configuration/authentication.md#environment-variables)
  * [Client Libraries](configuration/clients.md)
    * [Python Client](configuration/clients.md#python-client)
    * [Typescript Client](configuration/clients.md#typescript-client)
  * [CLI](configuration/cli.md)
  * [HTTP API](configuration/http.md)
    * [Requests](configuration/http.md#requests)
      * [Optional Headers](configuration/http.md#optional-headers)
      * [Engine Response Format](configuration/http.md#engine-response-format)
    * [Creating a Package Instance](configuration/http.md#creating-a-package-instance)
    * [Invoking a Package Method](configuration/http.md#invoking-a-package-method)
* [Agents](agents)
  * [Agent](agents#agent)
  * [AgentContext](agents#agentcontext)
  * [Tool](agents#tool)
  * [AgentService](agents#agentservice)
* [Packages](packages)
* [Plugins](plugins)
  * [File Importers](plugins#file-importers)
  * [Blockifiers](plugins#blockifiers)
  * [Taggers](plugins#taggers)
  * [Generators](plugins#generators)
  * [Embedders](plugins#embedders)
* [Data](data)
  * [Workspaces](data/workspaces.md)
    * [Creating Workspaces](data/workspaces.md#creating-workspaces)
  * [Files](data/files.md)
    * [Creating Files Directly](data/files.md#creating-files-directly)
    * [Making File Data Public](data/files.md#making-file-data-public)
  * [Blocks](data/blocks.md)
    * [Creating Blocks](data/blocks.md#creating-blocks)
    * [Making Block Data Public](data/blocks.md#making-block-data-public)
  * [Tags](data/tags.md)
    * [Ways to use Tags](data/tags.md#ways-to-use-tags)
    * [Tag Schemas](data/tags.md#tag-schemas)
    * [Block and File Tags](data/tags.md#block-and-file-tags)
  * [Querying Data](data/queries)
    * [Usage](data/queries#usage)
    * [Language Description](data/queries#language-description)
      * [Unary Predicates](data/queries#unary-predicates)
      * [Binary Predicates](data/queries#binary-predicates)
      * [Binary Relations](data/queries#binary-relations)
      * [Conjunctions](data/queries#conjunctions)
      * [Special Predicates](data/queries#special-predicates)
* [Embedding Search Index](embedding-search)
* [Inserting Data](embedding-search#inserting-data)
* [Querying Data](embedding-search#querying-data)
* [Developer Reference](developing)
  * [Cloning a Starter Project](developing/project-creation.md)
  * [The Steamship Manifest file](developing/steamship-manifest.md)
    * [Plugin Configuration](developing/steamship-manifest.md#plugin-configuration)
    * [Steamship Registry](developing/steamship-manifest.md#steamship-registry)
  * [Python Environment Setup](developing/environment-setup.md)
  * [Accepting Configuration](developing/configuration.md)
    * [Defining and Accepting configuration in your code](developing/configuration.md#defining-and-accepting-configuration-in-your-code)
  * [Storing Secrets](developing/storing-secrets.md)
  * [Running on Localhost](developing/running.md)
    * [Localhost caveats](developing/running.md#localhost-caveats)
  * [Writing Tests](developing/testing.md)
    * [Logging](developing/testing.md#logging)
    * [Throwing Errors](developing/testing.md#throwing-errors)
    * [Manual Testing](developing/testing.md#manual-testing)
    * [Automated testing](developing/testing.md#automated-testing)
      * [Automated testing setup](developing/testing.md#automated-testing-setup)
      * [Modifying or removing automated testing](developing/testing.md#modifying-or-removing-automated-testing)
  * [Deploying](developing/deploying.md)
    * [Deploying with the Steamship CLI](developing/deploying.md#deploying-with-the-steamship-cli)
    * [Deploying via GitHub Actions](developing/deploying.md#deploying-via-github-actions)
      * [Automated Deployment Setup](developing/deploying.md#automated-deployment-setup)
      * [Modifying or disabling automated deployments](developing/deploying.md#modifying-or-disabling-automated-deployments)
    * [Troubleshooting Deployments](developing/deploying.md#troubleshooting-deployments)
      * [The deployment fails because the version already exists](developing/deploying.md#the-deployment-fails-because-the-version-already-exists)
      * [The deployment fails because the tag does not match the manifest file](developing/deploying.md#the-deployment-fails-because-the-tag-does-not-match-the-manifest-file)
      * [The deployment fails with an authentication error](developing/deploying.md#the-deployment-fails-with-an-authentication-error)
  * [Monitoring your Instances](developing/monitoring.md)
    * [Monitoring via Web](developing/monitoring.md#monitoring-via-web)
      * [Logs](developing/monitoring.md#logs)
      * [Usage](developing/monitoring.md#usage)
      * [Tasks](developing/monitoring.md#tasks)
    * [Using Logging in Instances](developing/monitoring.md#using-logging-in-instances)
    * [Logs Retrieval with `ship` CLI](developing/monitoring.md#logs-retrieval-with-ship-cli)
* [License](license.md)
* [Authors](authors.md)
