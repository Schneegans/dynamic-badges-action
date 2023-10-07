//////////////////////////////////////////////////////////////////////////////////////////
//                    This file is part of the Dynamic Badges Action                    //
// It may be used under the terms of the MIT license. See the LICENSE file for details. //
//                         Copyright: (c) 2020 Simon Schneegans                         //
//////////////////////////////////////////////////////////////////////////////////////////

import core from '@actions/core';
import { makeBadge } from 'badge-maker';

const gistUrl = new URL(core.getInput('gistID'), core.getInput('host'));

// This uses the method above to update a gist with the given data. The user agent is
// required as defined in https://developer.github.com/v3/#user-agent-required
async function updateGist(body) {
  const headers = new Headers([
    ['Content-Type', 'application/json'],
    ['Content-Length', body.length],
    ['User-Agent', 'Schneegans'],
    ['Authorization', `token ${core.getInput('auth')}`],
  ]);

  const response = await fetch(gistUrl, {
    method: 'POST',
    headers,
    body,
  });

  if (!response.ok) {
    console.log(await response.text());
    core.setFailed(
      `Failed to create gist, response status code: ${response.status} ${response.statusText}`
    );

    return;
  }

  console.log('Success!');
}

// We wrap the entire action in a try / catch block so we can set it to "failed" if
// something goes wrong.
try {
  // This object will be stringified and uploaded to the gist. The schemaVersion, label
  // and message attributes are always required. All others are optional and added to the
  // content object only if they are given to the action.
  let data = {
    label: core.getInput('label'),
    message: core.getInput('message'),
  };

  const filename = core.getInput('filename');
  const isSvgFile = filename.endsWith('.svg');

  if (!isSvgFile) {
    data.schemaVersion = 1;
  }

  // Compute the message color based on the given inputs.
  const color = core.getInput('color');
  const valColorRange = core.getInput('valColorRange');
  const minColorRange = core.getInput('minColorRange');
  const maxColorRange = core.getInput('maxColorRange');
  const invertColorRange = core.getInput('invertColorRange');
  const colorRangeSaturation = core.getInput('colorRangeSaturation');
  const colorRangeLightness = core.getInput('colorRangeLightness');

  if (minColorRange != '' && maxColorRange != '' && valColorRange != '') {
    const max = parseFloat(maxColorRange);
    const min = parseFloat(minColorRange);
    let val = parseFloat(valColorRange);

    if (val < min) val = min;
    if (val > max) val = max;

    let hue = 0;
    if (invertColorRange == '') {
      hue = Math.floor(((val - min) / (max - min)) * 120);
    } else {
      hue = Math.floor(((max - val) / (max - min)) * 120);
    }

    let sat = 100;
    if (colorRangeSaturation != '') {
      sat = parseFloat(colorRangeSaturation);
    }

    let lig = 40;
    if (colorRangeLightness != '') {
      lig = parseFloat(colorRangeLightness);
    }

    data.color = 'hsl(' + hue + ', ' + sat + '%, ' + lig + '%)';
  } else if (color != '') {
    data.color = color;
  }

  // Get all optional attributes and add them to the content object if given.
  const labelColor = core.getInput('labelColor');
  const isError = core.getInput('isError');
  const namedLogo = core.getInput('namedLogo');
  const logoSvg = core.getInput('logoSvg');
  const logoColor = core.getInput('logoColor');
  const logoWidth = core.getInput('logoWidth');
  const logoPosition = core.getInput('logoPosition');
  const style = core.getInput('style');
  const cacheSeconds = core.getInput('cacheSeconds');

  if (labelColor != '') {
    data.labelColor = labelColor;
  }

  if (!isSvgFile && isError != '') {
    data.isError = isError;
  }

  if (!isSvgFile && namedLogo != '') {
    data.namedLogo = namedLogo;
  }

  if (!isSvgFile && logoSvg != '') {
    data.logoSvg = logoSvg;
  }

  if (!isSvgFile && logoColor != '') {
    data.logoColor = logoColor;
  }

  if (!isSvgFile && logoWidth != '') {
    data.logoWidth = parseInt(logoWidth);
  }

  if (!isSvgFile && logoPosition != '') {
    data.logoPosition = logoPosition;
  }

  if (style != '') {
    data.style = style;
  }

  if (!isSvgFile && cacheSeconds != '') {
    data.cacheSeconds = parseInt(cacheSeconds);
  }

  let content = '';

  if (isSvgFile) {
    content = makeBadge(data);
  } else {
    content = JSON.stringify(data);
  }

  // For the POST request, the above content is set as file contents for the
  // given filename.
  const body = JSON.stringify({ files: { [filename]: { content } } });

  // If "forceUpdate" is set to true, we can simply update the gist. If not, we have to
  // get the gist data and compare it to the new value before.
  if (core.getBooleanInput('forceUpdate')) {
    updateGist(body);
  } else {
    // Get the old gist.
    fetch(gistUrl, {
      method: 'GET',
      headers: new Headers([
        ['Content-Type', 'application/json'],
        ['User-Agent', 'Schneegans'],
        ['Authorization', `token ${core.getInput('auth')}`],
      ]),
    })
      .then((response) => {
        if (!response.ok) {
          // print the error, but don't fail the action.
          console.log(
            `Failed to get gist: ${response.status} ${response.statusText}`
          );
          response.text().then((text) => console.log(text));

          return {};
        }

        return response.json();
      })
      .then((oldGist) => {
        let shouldUpdate = true;

        if (oldGist?.body?.files?.[filename]) {
          const oldContent = oldGist.body.files[filename].content;

          if (oldContent === content) {
            console.log(
              `Content did not change, not updating gist at ${filename}.`
            );
            shouldUpdate = false;
          }
        }

        if (shouldUpdate) {
          if (oldGist?.body?.files?.[filename]) {
            console.log(`Content changed, updating gist at ${filename}.`);
          } else {
            console.log(`Content didn't exist, creating gist at ${filename}.`);
          }

          updateGist(body);
        }
      });
  }
} catch (error) {
  core.setFailed(error);
}
