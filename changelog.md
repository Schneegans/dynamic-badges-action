# Changelog of the Dynamic Badges Action

## [Dynamic Badges Action 1.7.0](https://github.com/Schneegans/dynamic-badges-action/tree/v1.7.0)

**Release Date:** TBD

#### Changes

- **SVG Mode:** If your gist filename ends with `.svg` instead of `.json`, the action will now generate an SVG badge instead of a JSON file. This is useful if you cannot use shields.io for some reason. However, this SVG mode does not support all features of shields.io. Thanks to [@runarberg](https://github.com/runarberg) for this contribution!
- **New `host` Parameter:** You can now specify the host for the gist API. This is useful if you want to use the action on a GitHub enterprise instance. Thanks to [@LucBerge](https://github.com/LucBerge) for this idea!
- Fixed a bug which caused the gist not to be updated if the label or message of the badge contained characters which have a different encoding length in UTF8 and UTF16,
- The code has received some major refactoring. If you encounter any problems, please open an issue!
- The action now runs on Node 20 instead of Node 16.

## [Dynamic Badges Action 1.6.0](https://github.com/Schneegans/dynamic-badges-action/tree/v1.6.0)

**Release Date:** 2022-10-13

#### Changes

- The action now runs on Node 16 instead of the deprecated Node 12.

## [Dynamic Badges Action 1.5.0](https://github.com/Schneegans/dynamic-badges-action/tree/v1.5.0)

**Release Date:** 2022-10-09

#### Changes

- The gist is now not updated anymore if the content did not change. This prevents many gist revisions without actual changes. You can restore the original behavior by setting the optional `forceUpdate` parameter to `true`. A BIG thanks to [@MishaKav](https://github.com/MishaKav) for this contribution!
- Example color range badges have been added to the README.
- All node dependencies have been updated.

## [Dynamic Badges Action 1.4.0](https://github.com/Schneegans/dynamic-badges-action/tree/v1.4.0)

**Release Date:** 2022-05-15

#### Changes

- Fixed a bug which caused the action to fail if the value for the automatic color range was out of bounds. Thanks to [@LucasWolfgang](https://github.com/LucasWolfgang) for this fix!

## [Dynamic Badges Action 1.3.0](https://github.com/Schneegans/dynamic-badges-action/tree/v1.3.0)

**Release Date:** 2022-04-18

#### Changes

- Added the possibility to generate the badge color automatically between red and green based on a numerical value and its bounds. Thanks to [@LucasWolfgang](https://github.com/LucasWolfgang) for this contribution!

## [Dynamic Badges Action 1.2.0](https://github.com/Schneegans/dynamic-badges-action/tree/v1.2.0)

**Release Date:** 2022-03-26

#### Changes

- The action does not log the response of writing the Gist anymore.
- Added this changelog.

## [Dynamic Badges Action 1.1.0](https://github.com/Schneegans/dynamic-badges-action/tree/v1.1.0)

**Release Date:** 2021-06-16

#### Changes

- The action now logs an error message when writing the Gist failed.
- Used new API for setting environment variables in the README.md examples.

## [Dynamic Badges Action 1.0.0](https://github.com/Schneegans/dynamic-badges-action/tree/v1.0.0)

**Release Date:** 2020-08-16

#### Changes

- Initial publication on GitHub.
