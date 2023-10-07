# 🏷️ Dynamic Badges Action

[![badges](https://github.com/Schneegans/dynamic-badges-action/workflows/Build%20Badges/badge.svg)](https://github.com/Schneegans/dynamic-badges-action/actions)
[![license](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)
[![market](https://img.shields.io/badge/Get_it-on_the_Marketplace-informational.svg)](https://github.com/marketplace/actions/dynamic-badges)

This action allows you to create badges for your README.md with [shields.io](https://shields.io) which may change with every commit. To do this, this action does not need to push anything to your repository!

This action supports all [configuration options of shields.io/endpoint](https://shields.io/endpoint) and can be used in various ways:

- Show custom CI statistics from GitHub actions, such as code coverage or detailed test results.
- Show metadata of your repository such as [lines of code, comment line percentage](https://schneegans.github.io/tutorials/2022/04/18/badges), ...
- Basically anything which may change from commit to commit!

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

This JSON object is then uploaded to a _gist_ ([click here for an example](https://gist.github.com/Schneegans/2ab8f1d386f13aaebccbd87dac94068d)) and automatically transformed to [![badge](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/schneegans/2ab8f1d386f13aaebccbd87dac94068d/raw/hello-world.json)](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/schneegans/2ab8f1d386f13aaebccbd87dac94068d/raw/hello-world.json) with the **shields.io/endpoint**.

<details><summary>Show Markdown of this Badge!</summary>

```md
![badge](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/schneegans/2ab8f1d386f13aaebccbd87dac94068d/raw/hello-world.json)
```

</details>

### SVG Mode

The action also supports an _SVG mode_ in which the badge is created directly by the action and uploaded as image to the gist.
This mode does not support all features of shields.io but is useful if you cannot use shields.io for some reason.
[![badge](https://gist.githubusercontent.com/Schneegans/2ab8f1d386f13aaebccbd87dac94068d/raw/badge.svg)](https://gist.githubusercontent.com/Schneegans/2ab8f1d386f13aaebccbd87dac94068d/raw/badge.svg) which is directly stored in a gist.

<details><summary>Show Markdown of this Badge!</summary>

```md
![badge](https://gist.githubusercontent.com/Schneegans/2ab8f1d386f13aaebccbd87dac94068d/raw/badge.svg)
```

</details>

## 🛠️ Configuration

1. Head over to [gist.github.com](https://gist.github.com/) and create a new gist. You can name the file `test.json`, but this can be changed later as well. You will need the ID of the gist (this is the long alphanumerical part of its URL) later.
2. Navigate to [github.com/settings/tokens](https://github.com/settings/tokens) and create a new token with the _gist_ scope.
3. Go to the _Secrets_ page of the settings of your repository (Settings > Secrets > Actions) and add this token as a new secret. You can give it any name, for example `GIST_SECRET`. **If you use Dependabot to automatically update dependencies of your repository, you also have to add this secret to Dependabot's secrets (Settings > Secrets > Dependabot).**
4. Add something like the following to your workflow:

```yml
- name: Create Awesome Badge
  uses: schneegans/dynamic-badges-action@v1.6.0
  with:
    auth: ${{ secrets.GIST_SECRET }}
    gistID: <gist-ID>
    filename: test.json # Use test.svg if you want to use the SVG mode.
    label: Hello
    message: World
    color: orange
```

Once the action is executed, go to your gist.
There should be a new file called `test.json` (or `test.svg` if you used SVG mode).
Embed the badge with:

```markdown
![badge](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/<user>/<gist-ID>/raw/test.json)
```

### Required Input Parameters

| Parameter  | Description                                                                                                                                                                                                            |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `auth`     | A secret token with the _gist_ scope.                                                                                                                                                                                  |
| `gistID`   | The ID of the target gist. Something like `8f6459c2417de7534f64d98360dde866`.                                                                                                                                          |
| `filename` | The target filename - each gist may contain several files. This should have a `.json` extension if you want to use **shields.io/endpoint** or an `.svg` extension if you want to use the **SVG mode** described above. |

### Optional Input Parameters

| Parameter     | Description                                                                                        | Supported in SVG Mode |
| ------------- | -------------------------------------------------------------------------------------------------- | --------------------- |
| `forceUpdate` | Default is `false`. If set to `true`, the gist will be updated even if the content did not change. | ✅                    |

### Shields.io Parameters (optional)

All these parameters are optional.
They are directly passed to [shields.io](https://shields.io). See the [official documentation](https://shields.io/endpoint) for more detailed explanations.

| Parameter      | Description                                                                                                                                                                              | Supported in SVG Mode |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| `label`        | Required. The left text of the badge.                                                                                                                                                    | ✅                    |
| `message`      | Required. The right text of the badge.                                                                                                                                                   | ✅                    |
| `labelColor`   | The left color of the badge.                                                                                                                                                             | ✅                    |
| `color`        | The right color of the badge. For custom colors wrap color string in quotes `"#bf155b"`. This parameter is ignored if the `valColorRange`, `maxColorRange`, and `minColorRange` are set. | ✅                    |
| `isError`      | The color will be red and cannot be overridden.                                                                                                                                          |                       |
| `namedLogo`    | A logo name from [simpleicons.org](http://simpleicons.org/).                                                                                                                             |                       |
| `logoSvg`      | An svg-string to be used as logo.                                                                                                                                                        |                       |
| `logoColor`    | The color for the logo.                                                                                                                                                                  |                       |
| `logoWidth`    | The space allocated for the logo.                                                                                                                                                        |                       |
| `logoPosition` | The position of the logo.                                                                                                                                                                |                       |
| `style`        | The style like "flat" or "social".                                                                                                                                                       | ✅                    |
| `cacheSeconds` | The cache lifetime in seconds (must be greater than 300).                                                                                                                                |                       |

### Color Range Parameters (optional)

Starting with version 1.3.0 of this action, the color of the right side of the badge can be computed automatically on a green-to-red color-scale. For example, these badges have been colored with `minColorRange: 50` and `maxColorRange: 90`:

[![badge](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/schneegans/2ab8f1d386f13aaebccbd87dac94068d/raw/color_badge_0.json)](https://gist.githubusercontent.com/schneegans/2ab8f1d386f13aaebccbd87dac94068d)
[![badge](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/schneegans/2ab8f1d386f13aaebccbd87dac94068d/raw/color_badge_10.json)](https://gist.githubusercontent.com/schneegans/2ab8f1d386f13aaebccbd87dac94068d)
[![badge](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/schneegans/2ab8f1d386f13aaebccbd87dac94068d/raw/color_badge_20.json)](https://gist.githubusercontent.com/schneegans/2ab8f1d386f13aaebccbd87dac94068d)
[![badge](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/schneegans/2ab8f1d386f13aaebccbd87dac94068d/raw/color_badge_30.json)](https://gist.githubusercontent.com/schneegans/2ab8f1d386f13aaebccbd87dac94068d)
[![badge](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/schneegans/2ab8f1d386f13aaebccbd87dac94068d/raw/color_badge_40.json)](https://gist.githubusercontent.com/schneegans/2ab8f1d386f13aaebccbd87dac94068d)
[![badge](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/schneegans/2ab8f1d386f13aaebccbd87dac94068d/raw/color_badge_50.json)](https://gist.githubusercontent.com/schneegans/2ab8f1d386f13aaebccbd87dac94068d)<br>
[![badge](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/schneegans/2ab8f1d386f13aaebccbd87dac94068d/raw/color_badge_60.json)](https://gist.githubusercontent.com/schneegans/2ab8f1d386f13aaebccbd87dac94068d)
[![badge](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/schneegans/2ab8f1d386f13aaebccbd87dac94068d/raw/color_badge_70.json)](https://gist.githubusercontent.com/schneegans/2ab8f1d386f13aaebccbd87dac94068d)
[![badge](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/schneegans/2ab8f1d386f13aaebccbd87dac94068d/raw/color_badge_80.json)](https://gist.githubusercontent.com/schneegans/2ab8f1d386f13aaebccbd87dac94068d)
[![badge](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/schneegans/2ab8f1d386f13aaebccbd87dac94068d/raw/color_badge_90.json)](https://gist.githubusercontent.com/schneegans/2ab8f1d386f13aaebccbd87dac94068d)
[![badge](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/schneegans/2ab8f1d386f13aaebccbd87dac94068d/raw/color_badge_100.json)](https://gist.githubusercontent.com/schneegans/2ab8f1d386f13aaebccbd87dac94068d)

For this, the following parameters can be used.

| Parameter              | Description                                                                                                                                                                          | Supported in SVG Mode |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------- |
| `valColorRange`        | A numerical value used to define the message color. Usually this should be between `maxColorRange` and `minColorRange`. This is required if you want to use the color range feature. | ✅                    |
| `maxColorRange`        | If `valColorRange` assumes this value, the badge will be green. This is required if you want to use the color range feature.                                                         | ✅                    |
| `minColorRange`        | If `valColorRange` assumes this value, the badge will be red. This is required if you want to use the color range feature.                                                           | ✅                    |
| `invertColorRange`     | If the range should be inverted, causing a smaller value to have green color. Defaults to `false`.                                                                                   | ✅                    |
| `colorRangeSaturation` | Saturation used by the color range feature. Defaults to 100.                                                                                                                         | ✅                    |
| `colorRangeLightness`  | Lightness used by the color range feature. Defaults to 40.                                                                                                                           | ✅                    |

### Using Environment Variables as Parameters [![badge](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/schneegans/2ab8f1d386f13aaebccbd87dac94068d/raw/answer.json)](https://gist.githubusercontent.com/schneegans/2ab8f1d386f13aaebccbd87dac94068d)

A common usage pattern of this action is to create environment variables in previous steps of a job and later use them as message in your badge.
How this can be done, is shown in the following example.

This example also shows how to use the automatic color range feature: If the answer is <= 0, the badge will be red, if it's >= 100 it will be green.
For all values in between, the color will be interpolated.

```yml
- name: Get the Numbers
  run: echo "ANSWER=42" >> $GITHUB_ENV
- name: Create the Badge
  uses: schneegans/dynamic-badges-action@v1.6.0
  with:
    auth: ${{ secrets.GIST_SECRET }}
    gistID: <gist-ID>
    filename: answer.json
    label: The Answer
    message: is ${{ env.ANSWER }}
    valColorRange: ${{ env.ANSWER }}
    maxColorRange: 100
    minColorRange: 0
```

## Contributing to Dynamic Badges Action

Whenever you encounter a :beetle: **bug** or have :tada: **feature request**,
report this via [Github issues](https://github.com/schneegans/dynamic-badges-action/issues).

We are happy to receive contributions in the form of **pull requests** via Github.
Feel free to fork the repository, implement your changes and create a merge request to the `master` branch.

### Git Commit Messages

Commits should start with a Capital letter and should be written in present tense (e.g. **:tada: Add cool new feature** instead of **:tada: Added cool new feature**).
You should also start your commit message with **one** applicable emoji. This does not only look great but also makes you rethink what to add to a commit. Make many but small commits!

| Emoji                                                     | Description                                             |
| --------------------------------------------------------- | ------------------------------------------------------- |
| :tada: `:tada:`                                           | When you added a cool new feature.                      |
| :wrench: `:wrench:`                                       | When you refactored / improved a small piece of code.   |
| :hammer: `:hammer:`                                       | When you refactored / improved large parts of the code. |
| :sparkles: `:sparkles:`                                   | When you applied clang-format.                          |
| :art: `:art:`                                             | When you improved / added assets like themes.           |
| :rocket: `:rocket:`                                       | When you improved performance.                          |
| :memo: `:memo:`                                           | When you wrote documentation.                           |
| :beetle: `:beetle:`                                       | When you fixed a bug.                                   |
| :twisted_rightwards_arrows: `:twisted_rightwards_arrows:` | When you merged a branch.                               |
| :fire: `:fire:`                                           | When you removed something.                             |
| :truck: `:truck:`                                         | When you moved / renamed something.                     |

### Version Numbers

Version numbers will be assigned according to the [Semantic Versioning](https://semver.org/) scheme.
This means, given a version number MAJOR.MINOR.PATCH, we will increment the:

1. MAJOR version when we make incompatible API changes,
2. MINOR version when we add functionality in a backwards compatible manner, and
3. PATCH version when we make backwards compatible bug fixes.
