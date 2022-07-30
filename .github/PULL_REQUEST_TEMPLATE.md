> 🦮 **Thank you in advance for helping us to improve this repository!** Please read through the template below and answer all relevant questions. Your additional work here is greatly appreciated and will help us respond as quickly as possible. For general support or usage questions, use the official [Discord Server](https://discord.gg/qWPyFWkff6). Finally, to avoid duplicates, please search existing pull requests before submitting one here.

> 🦮 By submitting a pull request (PR) to this repository, you agree to the terms within the [Code of Conduct](../CODE_OF_CONDUCT.md). Also make sure you visit our [Contributing Guidelines](../CONTRIBUTING.md) so you learn how to create and submit a high-quality pull requests for this repository. Please don't forget to delete the guide texts marked with this guide dog emoji 🦮  before submitting the issue in order to keep everything clean.

## Description

> 🦮 Describe the purpose of this PR along with any background information and the impacts of the proposed change. For the benefit of the community, please do not assume prior context.
>
> Provide details that support your chosen implementation, including: breaking changes, alternatives considered, changes to the API, etc.
>
> If the UI is being changed, please provide screenshots.

## References

> 🦮 Include any links supporting this change such as a:
> - GitHub Issue/PR number addressed or fixed
> - Related pull requests/issues from other repos
> 
> If there are no references, simply delete this section.

## Testing

> 🦮 Describe how this can be tested by reviewers. Be specific about anything not tested and reasons why. Tests should be added for new functionality and existing tests should complete without errors.
> 
> Please include any manual steps for testing end-to-end or functionality not covered by unit/integration tests.
> 
> Also include details of the environment this PR was developed in (language/platform/browser version).
- [ ] **Version of the repository used**:
- [ ] **Other relevant versions (language, server software, OS, browser)**:
- [ ] **Other modules/plugins/libraries that might be involved**:

> 🦮 Check this field if the following statement is true

- [ ] This change adds test coverage for new/changed/fixed functionality

## Checklist

> 🦮 This is the checklist with our common rules and practices regarding code quality and testing. If you don't fulfill all of those, then please add an explanation.
> 
> 🦮 This checklist covers multiple technologies. You can safely delete the section of technologies you didn't developed in but make sure you still include the general section, which applies to all technologies.

### General

- [ ] All active GitHub checks for tests, formatting and security are passing (CI Pipeline)
- [ ] The correct base branch is being used.
- [ ] Documentation for new / changed functionality is added or updated (if documentation is present)
- [ ] Test for reproducing the bug / new business logic (e.g. viewmodels, services and so on) are implemented
- [ ] Errors are handled and/or least logged
- [ ] Log messages and comments are written in english
- [ ] There are no (debug) console logs or _useless_ / _trivial_ comments
- [ ] Disabled linter rules are explained via comment
- [ ] Variables, method, classes and so on should have meaningful names (longer is better that meaningless)
- [ ] No ambiguous code was implemented - code intent is clear upon initial reading (if not possible, it should get properly documented)
- [ ] DRY principle (no duplicate without a good reason) is followed
- [ ] Methods can handle unexpected input properly
- [ ] Each feature has its corresponding feature / subfeature folder with corresponding widgets, viewmodel and so on
- [ ] The folder structure stays consisted as described in the tech stack
- [ ] Hard coded / static values (magic numbers) are avoided (add the static values to forseen files)

### Typescript / Javascript

- [ ] All files are written in typescript
- [ ] There is a blank line between module imports and own file imports
- [ ] Arrow functions are preferred over normal functions
- [ ] User inputs are being validated properly (with error messages if needed)
- [ ] The code sticks to the prettier and eslint code standards
- [ ] Await/async is preferred over chaining then callbacks
- [ ] TypeScript code compiles without any warnings / errors
- [ ] Everything should get type (no any -> use things like unknown instead and map the type)

### Flutter

- [ ] The utils folder does only contain file definitions or extensions (put everything else in the core module)
- [ ] If accessing data from shared preferences or remote api, an own content feature was implemented in the content module
- [ ] Private members should preceded with an underscore
- [ ] Class members are sorted according to [Flutter's styleguide](https://github.com/flutter/flutter/wiki/Style-guide-for-Flutter-repo)
- [ ] All strings except logs are localized
- [ ] No relative imports are being used except if the file is in the same directory
- [ ] There should be no more then one named parameter per line
- [ ] No `buildWidget()` methods are being used do to performance issues (use private widgets instead)
- [ ] Widgets in the `lib/widgets` folder shouldn't contain paddings or margins by default
- [ ] No `IconData` is used as a widget parameter in public widgets
- [ ] Code reusability is guaranteed with helper functions in the core module and reusable designed widgets in separate folders
- [ ] Hard coded / static string in the ui screens are avoided (add the static values to forseen files)
- [ ] ListView builder should be used for long lists in order to improve performance
- [ ] Widgets are split in meaningful helper widgets to improve readability
- [ ] The widget should take care of responsiveness of the application (use widgets which handle screen overflows like expanded)
- [ ] The feature / bug fix was tested on android and (if possible) ios
- [ ] The build method should be pure without any side effects (because it may be triggered my external factors such as route push / pop)
- [ ] Business logic is separated from the ui with viewmodels
- [ ] Provide only at needed level instead of providing everything at the top to reduce widget rerenders
- [ ] Providers are not watched for single function calls (only read)
- [ ] All third party packages were evaluated and testet (especially after upgrading flutter)
