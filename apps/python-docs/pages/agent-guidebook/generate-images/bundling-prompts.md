---
title: Custom Image Prompt Tools
description: How to bundle your special prompt into a tool.
---

A great example of building your own tool -- using existing tools as a building block -- is one that combines a prompt template with an image generator.

Consider this prompt to generate a Pixar-style image:

```text
Pixar style superhero, 4k, 8k, unreal engine, octane render photorealistic by cosmicwonder,
hdr, photography by cosmicwonder, high definition, symmetrical face, volumetric lighting, dusty haze,
photo, octane render, 24mm, 4k, 24mm, DSLR, high quality, 60 fps, ultra realistic
```

You could turn this prompt into a template with the following Python:

```python
prompt_template = ("Pixar style {subject}, 4k, 8k, unreal engine, octane render photorealistic by cosmicwonder, "
    "hdr, photography by cosmicwonder, high definition, symmetrical face, volumetric lighting, dusty haze, "
    "photo, octane render, 24mm, 4k, 24mm, DSLR, high quality, 60 fps, ultra realistic")

prompt = prompt_template.format(subject="penguin")
```

And wrap into a tool of its own, capable of generating Pixar-style images:

```python
class PixarStyleTool(ImageGeneratorTool):
    name: str = "PixarStyleTool"
    human_description: str = "Generates a Pixar-style image from text."
    agent_description = (
        "Used to generate a Pixar-style image of something. "
        "Only use if the user has asked directly for a Pixar-style image of something. "
        "Input: the subject of the image "
        "Output: the Pixar-style image."
    )

    prompt_template = ("Pixar style {subject}, 4k, 8k, unreal engine, octane render photorealistic by cosmicwonder, "
        "hdr, photography by cosmicwonder, high definition, symmetrical face, volumetric lighting, dusty haze, "
        "photo, octane render, 24mm, 4k, 24mm, DSLR, high quality, 60 fps, ultra realistic")

    def run(self, tool_input: List[Block], context: AgentContext) -> Union[List[Block], Task[Any]]:
        # Modify the tool inputs by interpolating them with stored prompt here
        modified_inputs = [Block(text=self.prompt_template.format(subject=block.text)) for block in tool_input]

        # Create the Stable Diffusion tool we want to wrap
        stable_diffusion_tool = StableDiffusionTool()

        # Now return the results of running Stable Diffusion on those modified prompts.
        return stable_diffusion_tool.run(modified_inputs, context)
```

This tool is located as an example in your starter project at [`src/example_tools/pixar-style_tool.py`](https://github.com/steamship-core/multimodal-agent-starter/blob/main/src/example_tools/pixar_style_tool.py)
