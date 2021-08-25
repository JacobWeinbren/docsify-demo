# Docsify Demo 💻
> Plugin for [Docsify](https://docsify.js.org/#/) 📘 that adds a preview of your component
> 
[![Latest version on NPM](https://img.shields.io/npm/v/docsify-demo?color=blue&label=docsify-demo)](https://www.npmjs.com/package/docsify-demo)
![GitHub top language](https://img.shields.io/github/languages/top/JacobWeinbren/docsify-demo)
![GitHub package.json version](https://img.shields.io/github/package-json/v/JacobWeinbren/docsify-demo)
![MIT License](https://img.shields.io/github/license/JacobWeinbren/docsify-demo?color=blue)

This plugin is focused on testing local code within [Docsify](https://docsify.js.org/#/), based on the [@shoelace](https://github.com/shoelace-style/shoelace) `code-block` implementation. Unlike other [docsify plugins](https://docsify.js.org/#/plugins) that exist, this plugin supports LitElement, more recently known as [Lit.Dev](https://lit.dev/). Similar to Storybook, this allows for testing common use cases, but in a simpler way.

**Key Features**
- A live preview of your component/s, which can be resized to emulate smaller devices
- Each demo comes with a toggleable code view, which reveals the underlying code
- For all the code previews, this plugin integrates a copy button feature

This is my first plugin - please feel welcome to suggest features or raise bugs by creating an issue.

## Installation

1. Add the jsdelivr script
```html
<script src="//cdn.jsdelivr.net/npm/docsify-demo@1.0.0/dist/index.min.js"></script>
```

2. Add the jsdelivr styles
```html
<link rel="stylesheet" href="//cdn.jsdelivr.net/npm/docsify-demo@1.0.0/dist/index.min.css">
```

3. Use the following markdown to add a component to your documentation
```html
    ```html preview
    <p> Hello, World. </p>
    ```
```

4. This is what it should look like

<img src="screenshot.png" width="500px" alt="Demo Screenshot, showing a toggle bar, reveal button and preview box" />

## Example

To see the small example in this repo, run the following.

```bash
git clone https://github.com/JacobWeinbren/docsify-demo
cd docsify-demo
yarn install
yarn build
yarn serve
```

## License

This plugin uses the MIT License, [summarised here](https://tldrlegal.com/license/mit-license).
