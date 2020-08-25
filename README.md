# Dynamic Badges Action

[![badges](https://github.com/Schneegans/dynamic-badges-action/workflows/Build%20Badges/badge.svg)](https://github.com/Schneegans/dynamic-badges-action/actions)
[![license](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)
[![market](https://img.shields.io/badge/Get_it-on_the_Marketplace-informational.svg)](https://github.com/marketplace/actions/dynamic-badges)

This action allows you to create badges for your README.md with [shields.io](https://shields.io) which may change with every commit. To do this, this action does not need to push anything to your repository!

This action supports all [configuration options of shields.io/endpoint](https://shields.io/endpoint) and can be used in various ways:
* Show custom CI statistics from GitHub actions, such as code coverage or detailed test results.
* Show metadata of your repository such as [lines of code, comment line percentage](https://schneegans.github.io/tutorials/2020/08/16/badges), ...
* Basically anything which may change from commit to commit!

## How Does It Work?

Whenever this action is executed, it creates a JSON object based on the input parameters.
This JSON object may look like this:

```json
{
  "schemaVersion": 1,
  "label": "Hello",
  "message": "World",
  "color": "orange"
}
```

This JSON object is then uploaded as a file to a *gist* ([click here for an example](https://gist.github.com/Schneegans/2ab8f1d386f13aaebccbd87dac94068d)) and can be transformed to a badge like [![badge](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/schneegans/2ab8f1d386f13aaebccbd87dac94068d/raw/hello-world.json)](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/schneegans/2ab8f1d386f13aaebccbd87dac94068d/raw/hello-world.json) with the **shields.io/endpoint**. Here is the URL of this example badge:

```
https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/schneegans/2ab8f1d386f13aaebccbd87dac94068d/raw/hello-world.json
```

## Configuration

1. Head over to [gist.github.com](https://gist.github.com/) and create a new gist. You will need the ID of the gist (this is the long alphanumerical part of its URL) later.
2. Navigate to [github.com/settings/tokens](https://github.com/settings/tokens) and create a new token with the *gist* scope.
3. Go to the *Secrets* page of the settings of your repository and add this token as a new secret. You can give it any name, for example `GIST_SECRET`.
4. Add something like the following to your workflow:
```yml
- name: Create Awesome Badge
  uses: schneegans/dynamic-badges-action@v1.0.0
  with:
    auth: ${{ secrets.GIST_SECRET }}
    gistID: <gist-ID>
    filename: test.json
    label: Hello
    message: World
    color: orange
```

Once the action is executed, got to your gist.
There should be a new file called `test.json`.
You can view the raw content of this file at `https://gist.githubusercontent.com/<user>/<gist-ID>/raw/test.json`.
Embed the badge with:

```markdown
![badge](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/<user>/<gist-ID>/raw/test.json)
```

### Input Parameters

The **Badge Parameters** are directly passed to [shields.io](https://shields.io). See the [official documentation](https://shields.io/endpoint) for more detailed explanations.

Gist Parameter | Description
----------|------------
`auth` | Required. A secret token with the *gist* scope.
`gistID` | Required. The ID of the target gist. Something like `8f6459c2417de7534f64d98360dde866`.
`filename` | Required. The target filename - each gist may contain several files. This should have the `.json` extension.
**Badge Parameter** | **Description**
`label` | Required. The left text of the badge.
`message` | Required. The right text of the badge.
`labelColor` | The left color of the badge.
`color` | The right color of the badge.
`isError` | The color will be red and cannot be overridden.
`namedLogo` | A logo name from [simpleicons.org](http://simpleicons.org/).
`logoSvg` | An svg-string to be used as logo.
`logoColor` | The color for the logo.
`logoWidth` | The space allocated for the logo.
`logoPosition` | The position of the logo.
`style` | The style like "flat" or "social".
`cacheSeconds` | The cache lifetime in seconds (must be greater than 300).

### Using Environment Variables as Parameters [![badge](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/schneegans/2ab8f1d386f13aaebccbd87dac94068d/raw/answer.json)](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/schneegans/2ab8f1d386f13aaebccbd87dac94068d/raw/answer.json)

A common usage pattern of this action is to create environment variables in previous steps of a job and later use them as message in your badge. This can be achieved like this:

```yml
- name: Get the Numbers
  run: echo "::set-env name=ANSWER::42"
- name: Create the Badge
  uses: schneegans/dynamic-badges-action@v1.0.0
  with:
    auth: ${{ secrets.GIST_SECRET }}
    gistID: <gist-ID>
    filename: answer.json
    label: The Answer is
    message: ${{ env.ANSWER }}
    color: green
```

# Contributing to Dynamic Badges Action

Whenever you encounter a :beetle: **bug** or have :tada: **feature request**, 
report this via [Github issues](https://github.com/schneegans/dynamic-badges-action/issues).

We are happy to receive contributions in the form of **pull requests** via Github.
Feel free to fork the repository, implement your changes and create a merge request to the `master` branch.

## Git Commit Messages

Commits should start with a Capital letter and should be written in present tense (e.g. __:tada: Add cool new feature__ instead of __:tada: Added cool new feature__).
You should also start your commit message with **one** applicable emoji. This does not only look great but also makes you rethink what to add to a commit. Make many but small commits!

Emoji | Description
------|------------
:tada: `:tada:` | When you added a cool new feature.
:wrench: `:wrench:` | When you refactored / improved a small piece of code.
:hammer: `:hammer:` | When you refactored / improved large parts of the code.
:sparkles: `:sparkles:` | When you applied clang-format.
:art: `:art:` | When you improved / added assets like themes.
:rocket: `:rocket:` | When you improved performance.
:memo: `:memo:` | When you wrote documentation.
:beetle: `:beetle:` | When you fixed a bug.
:twisted_rightwards_arrows: `:twisted_rightwards_arrows:` | When you merged a branch.
:fire: `:fire:` | When you removed something.
:truck: `:truck:` | When you moved / renamed something.

## Version Numbers

Version numbers will be assigned according to the [Semantic Versioning](https://semver.org/) scheme.
This means, given a version number MAJOR.MINOR.PATCH, we will increment the:

1. MAJOR version when we make incompatible API changes,
2. MINOR version when we add functionality in a backwards compatible manner, and
3. PATCH version when we make backwards compatible bug fixes.