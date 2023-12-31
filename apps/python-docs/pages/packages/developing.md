<a id="developing-packages"></a>

# Developing Packages

Steamship is the fastest way to build and deploy a full-stack language AI package.

Here’s how to go from zero-to-deployed in about 60 seconds.
Then you can customize your new package from there.

First, clone our empty package repository and install requirements.txt:

```bash
git clone https://github.com/steamship-packages/empty-package.git my-new-package
cd my-new-package
pip install -r requirements.txt
```

Then deploy the package to the cloud:

```bash
ship deploy
```

<a id="creating-package-instances"></a>

Now let’s create an instance and invoke it from Python.
After running `pip install steamship`, run the following code, replacing your package and instance handles:

```python
from steamship import Steamship

# TODO: Replace with your package and instance handle below
instance = Steamship.use("PACKAGE_HANDLE", "INSTANCE_HANDLE", config={
    "default_name": "Beautiful"
})

print(instance.invoke("greet"))
```

That’s it!
You’ve just created a new package, deployed it, and invoked it from two different environments.

Now the real fun begins…

## Customizing your Package

Steamship packages run on top of a cloud stack designed for Language AI.
You can import files, parse and tag them, query over them, return custom results – and far more.

Understand the basic project structure that defines a package and how to develop in it.

A cookbook of common operations you may want to perform, such as parsing files, transcribing audio, and querying results.

Lower-level details on Steamship development, such as environment setup, configuration, testing, and secret management.
