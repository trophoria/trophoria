# Contributing to TrophyApp Community Projects

A big welcome and thank you for considering contributing to our open source projects! Your help is essential for keeping it great.

Before contributing to this repository please make sure you read the [Contribution Guidelines](https://github.com/DevTobias/achiever/blob/main/.github/CONTRIBUTING.md). 

## Contribution Checklist

The following checklist contains our common rules and practices regarding code quality and testing. This checklist must be checked for every merge request and every element of the list must be manually checked for your technologies in order to get reviewed. This significantly reduces the review time because this list contains of recurring errors which easily can be avoided.

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
