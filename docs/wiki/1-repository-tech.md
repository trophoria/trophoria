# Flutter Application Architecture

## Project Structure

The structure of the flutter application is defined as follows:

```
application
    └─ assets
    │   └─ fonts
    │   └─ images
    │   └─ translations
    └─ modules
    └─ test
    └─ test_modules
    └─ lib
        └─ theme
        └─ utils
        └─ widgets 
        └─ features
            └─ example_feature
                └─ viewmodel
                    └─ viewmodel.dart
                    └─ viewmodel_state.dart
                └─ views
                └─ widgets
                └─ (subfeature)
```

Each *feature* lays inside its own folder and contains the following sub folders:
- viewmodel: the viewmodel and state classes
- views: the views representing the feature
- widgets: reusable components only used by this feature
- subfeature: if a feature exists of several sub features, which are only used by this feature, it is located inside its own feature folder as subfeature

The *theme* folder contains all const and theme related declarations.

The *utils* folder contains only type definitions and extensions. This folder should not contain functions. If the function is so commonly used, that it could get placed inside here, put it in the core module. Keep every other functions in the corresponding feature folders.

The *widgets* folder contains common widgets which could get used by any feature. Keep in mind, that these widgets should not handle states what so ever (provide as parameters instead).

The *test* folder contains all the actual unit tests of widgets, viewmodels and so on.

The *test_modules* folder contains mock implementation of services or data objects used by unit tests.

The *modules* folder contains custom dart modules used by the application.
- *content*: Repositories, database, services to access data from a backend or a local database.
- *core*: Shared code between all modules including utility functions.

## Content Module Structure

## State Management

## Used packages
