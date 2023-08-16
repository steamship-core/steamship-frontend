# Create your Agent

You can build and deploy your Agent without a programming environment on your computer. You just need:

1. **A web browser** with internet access
2. **A GitHub account** - for a cloud programming environment
3. **A Steamship account** - for AI hosting in the cloud

Click on the way you'd like to create your starter project below. Then return to complete your setup with the documentation below.


* [Clone GitHub Project](https://steamship.com/learn/agent-guidebook/clone-github) - _⭐️ Best for Developers_
* [Use a Dev Container in your Browser](https://steamship.com/learn/agent-guidebook/clone-devcontainer-browser) - _🎓 Easiest for Classrooms_
* [Use a Dev Container in Docker on Localhost](https://steamship.com/learn/agent-guidebook/clone-devcontainer-local)

## Git Clone (Local) Setup

<YouTube youTubeId="6fYO1hUpyz4" />

To build an Agent on your local machine, first you'll need to make sure your machine has the right dependencies:

1. Python 3.8
2. git
3. An IDE of your preference

Then, just:

1. Follow the link above.
2. Copy the GitHub repository link.
3. Open a terminal and run:
   ```bash
    git clone <url>
   ```
4. Change directories into your new project.
5. Set up a Python Virtual environment with the required dependencies:

   In MacOS or Linux:
      ```bash
        python3.8 -m venv .venv
        source .venv/bin/activate
        python3.8 -m pip install -r requirements.txt
      ```

   In Windows:
      ```bash
        python38 -m venv .venv
        .venv\Scripts\activate
        python38 -m pip install -r requirements.txt
      ```

6. Once your Python dependencies are installed, run:
   ```bash
    ship login
   ```

That's it! You should be ready to begin.


## Dev Container (Browser) Setup

<YouTube youTubeId="sLhfB7f4-kw" />

To build an Agent in your browser using GitHub Dev Containers:

1. Follow the link above.
2. Click on the **GitHub** link at the lower-left side of the browser
3. Select **Continue Working in New CodeSpace** from the menu that appears center-top
4. Select a machine type to run in
5. Wait until your environment is fully ready
6. Test by typing the `ship` command in your console

That's it! You should be ready to begin.

## Dev Container (Local) Setup

<YouTube youTubeId="Xpdja3y_ZgY" />

To build an Agent in a local GitHub Dev Container, first you'll need to make sure your machine has the right dependencies:

1. Docker
2. Visual Studio Code

Then, just:

1. Follow the link above.
2. When your Dev Container opens, run:
   ```bash
    pip install -r requirements.txt
   ```
3. Once your Python dependencies are installed, run:
   ```bash
    ship login
   ```

That's it! You should be ready to begin.

