Every project has a main development branch where the developers push commits on a day-to-day basis. The project would get really messy really fast, if every developer could directly change files in the repository on the main branch without others knowing (especially beginners who are new to the project). The following tutorial will give you a brief introduction on how professional open source projects handle code contributions.

While contributing to open source projects, knowing how to properly fork and create pull requests is essential. Unfortunatly, it's quite easy to make mistakes or not know what you should do when you're initially learning the process (in other words: getting lost). This wiki will guide you through a standard procedure for creating a fork, doing your work, issuing a pull request, and merging that pull request back into the original project.

## Creating a Fork

Head over to the GitHub page of the repository you want to develop on and click the `Fork` button. This copies the repository to your own account. Once finished, you need to download the fork in order to devlop features. You can use your favorite git client to clone the forked repo or just head straight to the command line:

```bash
# Clones your fork to your local machine
git clone git@github.com:USERNAME/FORKED_PROJECT_NAME.git
```

Now you have a fully functional copy of the repository on your machine, where you can devlop the desired feature.


## Keeping your Fork Up to Date

If you plan on doing anything more than just a tiny quick fix, you'll want to make sure you keep your fork up to date by tracking the original (`upstream`) repo that you forked. To do this, you'll simly need to add a remote (repository to track branches in):

```bash
# Add 'upstream' repo to list of remotes
git remote add upstream https://github.com/UPSTREAM_USER/ORIGINAL_PROJECT.git
```

Whenever you want to update your fork with the latest changes, you'll have to fetch the repo's branches and latest commits to import them into your own fork:

```bash
# Fetch from upstream remote
git fetch upstream
```

Now you can checkout (switch to) your own main branch and merge the upstream repo's main branch into your one:

```bash
# Checkout your main branch and merge upstream
git checkout main
git merge upstream/main
```

Keep in mind, that you may have to deal with conflicts if you develop directly on the main branch (which in the vast majority of cases you probably shouldn't do). When doing so, be careful to respect the changes of the original repository, because it already went through the production lane.

Now your local main branch is up to date with every change of the original repository.


## Doing Your Work

### Creating a fresh development branch

Whenever you begin work on a new feature or bugfix, it's important that you create a new branch. Not only is it proper git workflow, but it also keeps your changes organized and separated from the master branch so that you can easily submit and manage multiple pull requests for every task you complete.

There are two types of branches you should create. You name of the branch should always start with one of the following prefixes:
- `feature`: If you want to implement a function which adds content to the repository.
- `bugfix`: If you want to fix an existing feature which has some bugs in it.

The name of the branch is already defined in the issue or project task, so add this behind your type prefix. If you want to implement something entierely new, please create an issue before creating a pull request. You can read more about this in another article.

Always check, that your branch names follow this structure:
- `{type}/{name}` while type is either `feature` or `bugfix` and the name as defined in the issue or task

To create a new beanch and start working on it:

```bash
# Checkout the main branch - you want your new branch to come from production main 
git checkout main

# Create a new branch named feature/AC-187
git branch feature/AC-187

# Switch to your newly created branch
git checkout feature/AC-187
```

### Make changes to the codebase

Now that you created a fresh development branch, you can now make whatever changes you want to make to contribute to the project. While developing you want to track your changes with `commits`. Please make sure you follow the commit guidelines if defined in the pull request template or the original repository. Here are some general advices for this project:
- Keep commits as small as possible so you can describe them with one small sentence (not always possible, please add description if needed)
- Follow the projects naming convention like: `{name}: {summary}`. Most of the times, name represents the name of the feature / bug (branch name).


## Submitting a Pull Request

Before you submit a pull request, make sure you followed the all the contributing guidelines to make it as simple as possible for the original repo's maintainer to test, accept, and merge your work.

Once you've committed and pushed all of your changes to GitHub, go to the page for your fork on GitHub, select your development branch, and click the pull request button. If you need to make any adjustments to your pull request, just push the updates to GitHub. Your pull request will automatically track the changes on your development branch and update.

A maintainer of the original repo will review your pull request as quickly as possible (please keep in mind that no one gets paid, which is why this process can take some time). Keep an eye on it, because the reviewer may added some comments for you to fix before it gets merged. The comments of your pull request are the perfect place to discuss changes and your decisions as developer.
