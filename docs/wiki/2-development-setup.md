# Technology installation

## Flutter

The flutter setup can be a bit tricky. Make sure you follow the installation instructions of the official flutter docs very closely (at least till the android emulator setup on windows).

- https://docs.flutter.dev/get-started/install

After the `flutter doctor` command throws no more errors, you can move on with your editor setup.

If you are done, you can open your editor and your virtual device on android to the side. Click `run -> Start Without Debugging` to start the flutter application. Make sure you are viewing a dart file, so the editor knows what to start. You should now see the application on your virtual device.

## Typescript

Typescript itself just builds on top Javascript, so no application for typescript to work must be installed for now. Typescript always compiles into plain javascript, so your computer must be able to run javascript out of your browser environment. For this you need a javascript run-time environment. For now, the most widely used and robust one is [nodejs](https://nodejs.dev/). Make sure you install it. 

The node.js installer also automatically installs [npm](https://www.npmjs.com/) which is needed to install packages for your javascript project (typescript is such a package). However, npm by itself is really really slow. To fix this, you should install [yarn](https://yarnpkg.com/getting-started/install) by running the following command in your terminal of choice, after installing node:

```bash
$ corepack enable
```

The typescript backend uses [Docker](https://www.docker.com/) to dockerize the application, database and cache service. This enables the application to be started as it is on every operating system with database and cache without additional configuration. To run a local instance of the cache and database server, you need to install it. Docker is really easy to install with the [Docker Desktop](https://www.docker.com/get-started/) installation wrapper.

Now everything should be installed. Change the directory of your terminal to the `backend` application folder and install the project dependencies located in the `package.json` file with the following command:

```bash
$ yarn install
```

Run the whole application with the following npm script:

```bash
$ yarn docker-compose
```

The terminal should print out an url of the api endpoint you can now send requests to.

## Typescript

# Editor setup

## Common setup

The goal of this wiki page is to provide you with a professional and intuitive development setup. Nothing written here is mandatory, and you can of course use your own environment. However, if you want a guide how to set up a professional development environment, or don't know what works best with this project, this is the place for you.

### Recommended Code Editor

We recommend using [Visual Studio Code](https://code.visualstudio.com/) as your main Text Editor for a trouble-free development experience. VS Code is a lightweight, open source and multiplatform code editor. However, the real power of VS Code lies in its countless extensions. You can install extensions to add new languages, themes, debuggers, and much more to personalize your experience and your setup, so it works perfectly with the project.

Also, VS Code has a lot of useful and customizable keybindings, to increase your development productivity. You can look up a few important one on [this](https://code.visualstudio.com/shortcuts/keyboard-shortcuts-windows.pdf) cheat sheet.

### Recommended VS Code Extensions

We recommend you to install the following extensions in Visual Studio Code. They work perfectly with this project. The repository also contains a vscode settings file, which links to the extensions, so you can install them easier in vs code without searching everyone individually. The most important extensions are written in bold. These extensions are essential for nearly every developer, so don't hesitate to install them!

<details>
  <summary><bold>Quality of Life</bold></summary><br>

| Extension | Author | Description |
| ------ | ------ | ------ |
| [**Code Spell Checker**](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker)| Street Side Software| Spell checker for source code.|
| [Color Highlight](https://marketplace.visualstudio.com/items?itemName=naumovs.color-highlight) | Sergii Naumov| Highlight web colors in your editor.|
| [Error Lens](https://marketplace.visualstudio.com/items?itemName=usernamehw.errorlens)| Alexander| Improve highlighting of errors, warnings and other language diagnostics. |
| [**GitLens - Git supercharged**]( https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens) | GitKraken | Supercharge the Git capabilities built into Visual Studio Code. |
| [npm](https://marketplace.visualstudio.com/items?itemName=eg2.vscode-npm-script) | Microsoft | NPM support for VS Code. |
| [Reload](https://marketplace.visualstudio.com/items?itemName=natqe.reload) | natqe | Add reload button to status bar right bottom. |
| [Restore Terminals](https://marketplace.visualstudio.com/items?itemName=EthanSK.restore-terminals) | Ethan Sarif-Katten | Spawn integrated terminals and run commands on startup. |
| [Remove Comments](https://marketplace.visualstudio.com/items?itemName=plibither8.remove-comments) | plibither8 | emove all comments from your code at once! |

</details>

<details>
  <summary><bold>Documentation</bold></summary><br>

| Extension | Author | Description |
| ------ | ------ | ------ |
| [**Better Comments**](https://marketplace.visualstudio.com/items?itemName=aaron-bond.better-comments) | Aaron Bond | VImprove your code commenting by annotating with alert, informational, TODOs. |
| [**Draw.io Integration**](https://marketplace.visualstudio.com/items?itemName=hediet.vscode-drawio)  | Henning Dieterichs| Integrates Draw.io into VS Code to view and edit diagrams.|

</details>

<details>
  <summary><bold>Codestyle</bold></summary><br>

| Extension | Author | Description |
| ------ | ------ | ------ |
| [**EditorConfig for Visual Studio Code**](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig) | EditorConfig | Override user/workspace settings with provided ones.|

</details>

<details>
  <summary><bold>Language Support</bold></summary><br>

| Extension | Author | Description |
| ------ | ------ | ------ |
| [npm Intellisense](https://marketplace.visualstudio.com/items?itemName=christian-kohler.npm-intellisense) | Christian Kohler | Visual Studio Code plugin that autocompletes npm modules in import statements. |
| [**path Intellisense**](https://marketplace.visualstudio.com/items?itemName=christian-kohler.path-intellisense) | Christian Kohler | Visual Studio Code plugin that autocompletes filenames|
| [XML](https://marketplace.visualstudio.com/items?itemName=redhat.vscode-xml) | Red Hat | XML Language Support. |
| [YAML](https://marketplace.visualstudio.com/items?itemName=redhat.vscode-yaml) | Red Hat| YAML Language support. |
| [**DotENV**](https://marketplace.visualstudio.com/items?itemName=mikestead.dotenv) | mikestead | Support for dotenv file syntax|
| [Markdown All in One](https://marketplace.visualstudio.com/items?itemName=yzhang.markdown-all-in-one) | Yu Zhang| All you need to write Markdown. |


</details>

### Theming

Personally, we like dark themes, where we choosed Night Owl and the Material Icon Theme. For the font you can literally chose whatever you want. I recommend to use a developeer optimized font like [Fira Code](https://github.com/tonsky/FiraCode) or [Dank Mono](https://philpl.gumroad.com/l/dank-mono) for a paid one. You can chose your installed theme in the configuration dialog on the bottom left in vscode.

If you want an awesome looking terminal too, you can read this [blog post](https://www.hanselman.com/blog/my-ultimate-powershell-prompt-with-oh-my-posh-and-the-windows-terminal).

### Settings

The following code defines the settings for vscode, which work great with the installed extensions. The settings are provided with descriptions, so you can choose which you want to take over. To open the settings file, press `Crtl+Shift+P` to open the vs code action dialog. Then type `settings` and click on `Preferences: Open Settings (JSON)`.

<details>
  <summary><bold>SAVE EVENTS</bold></summary><br>

  ```js
    // Auto format the file after saving (Strg+S)
    "editor.formatOnSave": true,
    // Fix all auto fixable code style errors before saving.
    "editor.codeActionsOnSave": {
      "source.fixAll": true
    }
  ```

</details>

<details>
  <summary><bold>THEME</bold></summary><br>

  ```js
    // Defines the font family (ADD YOUR FONT HERE)
    "editor.fontFamily": "Dank Mono",
    // Wheter font ligatures should be on or not
    "editor.fontLigatures": true,
    // Defines the color theme
    "workbench.colorTheme": "Night Owl",
    // Defines the icon theme
    "workbench.iconTheme": "material-icon-theme",
    // Define the terminal font family
    "terminal.integrated.fontFamily": "CaskaydiaCove NF",

    // Add more folder names to the icon theme
    "material-icon-theme.folders.associations": {
      "entity": "interface",
      "business": "mail",
      "boundary": "connection",
      "repositories": "database",
      "mappers": "mappings",
      "setup": "config",
      "features": "app",
      "exceptions": "error"
    }
  ```

</details>

<details>
  <summary><bold>EDITOR</bold></summary><br>

  ```js
    // Disable the minimap on the right.
    "editor.minimap.enabled": false,
    // Prefer snippets in tab completion
    //"editor.tabCompletion": "onlySnippets",
    // Autocomplete snippet suggestions on the top.
    //"editor.snippetSuggestions": "top",
    // Highlight invisible characters
    "editor.unicodeHighlight.allowedCharacters": {
      "️": true
    },
    // Set the spelling to english and german
    "cSpell.language": "en,de",
    // Enable bracket pair colorization
    "editor.bracketPairColorization.enabled": true,
    "editor.guides.bracketPairs":"active",
  ```

</details>

<details>
  <summary><bold>MISCELLANEOUS</bold></summary><br>

  ```js
    // No editor open on startup.
    "workbench.startupEditor": "none",
    // Disable confirm delete message. (WARNING)
    //"explorer.confirmDelete": false,
    // Folders are not compacted in file explorer.
    "explorer.compactFolders": false,
    // Exclude some nasty and autogenerated files
      "files.exclude": {
      "**/.classpath": true,
      "**/.project": true,
      "**/.settings": true,
      "**/.factorypath": true,

      "**/node_modules": true,
      "**/yarn.lock": true,
      "**/package-lock.json": true,
      "**/.husky/_": true,
      "**/.gitignore": true,

      "**/.dart_tool": true,
      "**/.metadata": true,
      "**/.packages": true,
      "**/.flutter-plugins": true,
      "**/.flutter-plugins-dependencies": true,
      "**/pubspec.lock": true,
      "**/*.g.dart": true,
      "**/*.freezed.dart": true,
  },
  ```

</details>

<details>
  <summary><bold>FORMATTERS</bold></summary><br>

  ```js
    "[json]": {
      "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
    "[yaml]": {
      "editor.defaultFormatter": "esbenp.prettier-vscode"
    }
  ```

</details>

## Technology dependent setup

### Flutter

[Flutter](https://flutter.dev/) is an open source framework by Google for building beautiful, natively compiled, multi-platform applications from a single codebase based on the Dart programming language. For vscode to work really well for flutter development, we recommend adding the following extensions / settings.

#### Recommended Flutter Extensions

We recommend you to install the following extensions in Visual Studio Code if you are want to develop the flutter application.
<details>
  <summary><bold>Quality of Life</bold></summary><br>

| Extension | Author | Description |
| ------ | ------ | ------ |
| [Flutter Tree](https://marketplace.visualstudio.com/items?itemName=marcelovelasquez.flutter-tree) | Blaxou | Extension for Flutter to build basic widget tree. |
| [Flutter Riverpod Snippets](https://marketplace.visualstudio.com/items?itemName=robert-brunhage.flutter-riverpod-snippets) | Robert Brunhage | Quick and easy Flutter Riverpod snippets. |
| [Flutter freezed Helpers](https://marketplace.visualstudio.com/items?itemName=mthuong.vscode-flutter-freezed-helper) | Thường Nguyễn | Helper utilities for flutter projects. |
| [Flutter Coverage](https://marketplace.visualstudio.com/items?itemName=flutterando.flutter-coverage) | Flutterando | VSCode Extension to look up the code coverage per folder/file in the test view. |
| [Build Runner](https://marketplace.visualstudio.com/items?itemName=GaetSchwartz.build-runner) | Gaëtan Schwartz | Easily run build_runner commands! |
| [Awesome Flutter Snippets](https://marketplace.visualstudio.com/items?itemName=Nash.awesome-flutter-snippets) | Neevash Ramdial | Awesome Flutter Snippets is a collection snippets and shortcuts for commonly used Flutter functions and classes |

</details>

<details>
  <summary><bold>Language Support</bold></summary><br>

| Extension | Author | Description |
| ------ | ------ | ------ |
| [**Flutter**](https://marketplace.visualstudio.com/items?itemName=Dart-Code.flutter) | Dart Code | Flutter support and debugger for Visual Studio Code. |
| [**Dart**](https://marketplace.visualstudio.com/items?itemName=Dart-Code.dart-code) | Dart Code | Dart language support and debugger for Visual Studio Code. |

</details>

#### Recommended Flutter Settings

<details>
  <summary><bold>FLUTTER SPECIFIC SETTINGS</bold></summary><br>

  ```js
    "[dart]": {
      // Vertical ruler at 80 characters to show the line limit
      "editor.rulers": [80],
      // Dont highlight similar selections in dart code
      "editor.selectionHighlight": false,
      // Active snippet should not prevent quick suggestions
      "editor.suggest.snippetsPreventQuickSuggestions": false,
      // Alaways choose the first selection
      "editor.suggestSelection": "first",
      // Prefer snippets in tab completion (can be removed if not liked)
      "editor.tabCompletion": "onlySnippets",
      // Completion should not be computed based on the document words
      "editor.wordBasedSuggestions": false,
    },
  ```

</details>

### Typescript

[TypeScript](https://www.typescriptlang.org/) is a strongly typed programming language that builds on JavaScript, giving you better tooling at any scale. For vscode to work really well for javascript/typescript backend development, we recommend adding the following extensions / settings.

#### Recommended Typescript Extensions

<details>
  <summary><bold>Quality of Life</bold></summary><br>

| Extension | Author | Description |
| ------ | ------ | ------ |
| [Template String Converter](https://marketplace.visualstudio.com/items?itemName=meganrogge.template-string-converter) | meganrogge | Converts a string to a template string when ${ is typed |
| [npm Intellisense](https://marketplace.visualstudio.com/items?itemName=christian-kohler.npm-intellisense) | Christian Kohler | Visual Studio Code plugin that autocompletes npm modules in import statements |
| [JavaScript (ES6) code snippets](https://marketplace.visualstudio.com/items?itemName=xabikos.JavaScriptSnippets) | charalampos karypidis | Code snippets for JavaScript in ES6 syntax |

</details>

<details>
  <summary><bold>Codestyle</bold></summary><br>

| Extension | Author | Description |
| ------ | ------ | ------ |
| [**Prettier ESLint**](https://marketplace.visualstudio.com/items?itemName=rvest.vs-code-prettier-eslint) | Rebbeca West | A Visual Studio Extension to format JavaScript and Typescript code using prettier-eslint package |
| [**Prettier - Code formatter**](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) | Prettier | Code formatter using prettier |
| [**ESLint**](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) | Microsoft | Integrates ESLint JavaScript into VS Code. |

</details>

<details>
  <summary><bold>Language Support</bold></summary><br>

| Extension | Author | Description |
| ------ | ------ | ------ |
| [**Prisma**](https://marketplace.visualstudio.com/items?itemName=Prisma.prisma) | Prisma | Adds syntax highlighting, formatting, auto-completion, jump-to-definition and linting for prisma files. |
| [**GraphQL**](https://marketplace.visualstudio.com/items?itemName=GraphQL.vscode-graphql) | GraphQL Foundation | GraphQL extension for VSCode adds syntax highlighting, validation, and language features like go to definition, hover information and autocompletion for graphql projects. |


</details>

#### Recommended Typescript Settings

<details>
  <summary><bold>TYPESCRIPT SPECIFIC SETTINGS</bold></summary><br>

  ```js
    "[javascript][typescript]": {
      // Let eslint validate javascript.
      "eslint.validate": ["javascript"],
      // Always update import paths, if files got moved.
      "javascript.updateImportsOnFileMove.enabled": "always",
      "typescript.updateImportsOnFileMove.enabled": "always",
      // Set default formatter for js languages
      "editor.defaultFormatter": "rvest.vs-code-prettier-eslint"
      // Enable path suggestions
      "typescript.suggest.paths": true,
      "javascript.suggest.paths": true,
      // Vertical ruler at 80 characters to show the line limit
      "editor.rulers": [80],
    },
  ```

</details>

