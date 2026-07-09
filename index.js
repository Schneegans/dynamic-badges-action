//////////////////////////////////////////////////////////////////////////////////////////
//                    This file is part of the Dynamic Badges Action                    //
// It may be used under the terms of the MIT license. See the LICENSE file for details. //
//////////////////////////////////////////////////////////////////////////////////////////

// SPDX-FileCopyrightText: Simon Schneegans <code@simonschneegans.de>
// SPDX-License-Identifier: MIT

import core from "@actions/core";
import { makeBadge } from "badge-maker";

const gistUrl = new URL(core.getInput("gistID"), core.getInput("host"));

// Combined headers logic to keep authentication uniform
function getHeaders() {
  return new Headers([
    ["Content-Type", "application/json"],
    ["User-Agent", "Schneegans"],
    ["Accept", "application/vnd.github+json"],
    ["X-GitHub-Api-Version", "2026-03-10"],
    ["Authorization", `Bearer ${core.getInput("auth")}`],
  ]);
}

async function updateGist(body) {
  const headers = getHeaders();
  headers.append("Content-Length", String(new TextEncoder().encode(body).length));

  // https://docs.github.com/en/rest/gists/gists?apiVersion=2026-03-10&versionId=free-pro-team%40latest&productId=rest#update-a-gi
  const response = await fetch(gistUrl, {
    method: "PATCH", 
    headers,
    body,
  });

  if (!response.ok) {
    throw new Error(`Failed to update gist, response status code: ${response.status} ${response.statusText}`);
  }

  console.log("Success!");
}

// Top-level async runner block to prevent the Node process from dying early
async function run() {
  try {
    const auth = core.getInput("auth");

    if (typeof auth !== 'string' || auth.trim() === '') {
      throw new Error("Missing auth secret");
    }
    
    let data = {
      label: core.getInput("label"),
      message: core.getInput("message"),
    };

    const filename = core.getInput("filename");
    const isSvgFile = filename.endsWith(".svg");

    if (!isSvgFile) {
      data.schemaVersion = 1;
    }

    // Compute the message color based on the given inputs.
    const color = core.getInput("color");
    const valColorRange = core.getInput("valColorRange");
    const minColorRange = core.getInput("minColorRange");
    const maxColorRange = core.getInput("maxColorRange");
    const invertColorRange = core.getInput("invertColorRange");
    const colorRangeSaturation = core.getInput("colorRangeSaturation");
    const colorRangeLightness = core.getInput("colorRangeLightness");

    if (minColorRange != "" && maxColorRange != "" && valColorRange != "") {
      const max = parseFloat(maxColorRange);
      const min = parseFloat(minColorRange);
      let val = parseFloat(valColorRange);

      if (val < min) val = min;
      if (val > max) val = max;

      let hue = 0;
      if (invertColorRange == "") {
        hue = Math.floor(((val - min) / (max - min)) * 120);
      } else {
        hue = Math.floor(((max - val) / (max - min)) * 120);
      }

      let sat = 100;
      if (colorRangeSaturation != "") {
        sat = parseFloat(colorRangeSaturation);
      }

      let lig = 40;
      if (colorRangeLightness != "") {
        lig = parseFloat(colorRangeLightness);
      }

      data.color = "hsl(" + hue + ", " + sat + "%, " + lig + "%)";
    } else if (color != "") {
      data.color = color;
    }

    // Get all optional attributes and add them to the content object if given.
    const labelColor = core.getInput("labelColor");
    const isError = core.getInput("isError");
    const namedLogo = core.getInput("namedLogo");
    const logoSvg = core.getInput("logoSvg");
    const logoColor = core.getInput("logoColor");
    const logoWidth = core.getInput("logoWidth");
    const logoPosition = core.getInput("logoPosition");
    const style = core.getInput("style");
    const cacheSeconds = core.getInput("cacheSeconds");

    if (labelColor != "") {
      data.labelColor = labelColor;
    }

    if (!isSvgFile && isError != "") {
      data.isError = isError;
    }

    if (!isSvgFile && namedLogo != "") {
      data.namedLogo = namedLogo;
    }

    if (!isSvgFile && logoSvg != "") {
      data.logoSvg = logoSvg;
    }

    if (!isSvgFile && logoColor != "") {
      data.logoColor = logoColor;
    }

    if (!isSvgFile && logoWidth != "") {
      data.logoWidth = parseInt(logoWidth);
    }

    if (!isSvgFile && logoPosition != "") {
      data.logoPosition = logoPosition;
    }

    if (style != "") {
      data.style = style;
    }

    if (!isSvgFile && cacheSeconds != "") {
      data.cacheSeconds = parseInt(cacheSeconds);
    }

    let content = "";

    if (isSvgFile) {
      content = makeBadge(data);
    } else {
      content = JSON.stringify(data);
    }

    const body = JSON.stringify({ files: { [filename]: { content } } });

    if (core.getBooleanInput("forceUpdate")) {
      await updateGist(body); 
    } else {
      // Get the old gist.
      const response = await fetch(gistUrl, {
        method: "GET",
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to get gist: ${response.status} ${response.statusText}`);
      }

      const oldGist = await response.json();
      let shouldUpdate = true;

      if (oldGist?.files?.[filename]) {
        const oldContent = oldGist.files[filename].content;

        if (oldContent === content) {
          console.log(`Content did not change, not updating gist at ${filename}.`);
          shouldUpdate = false;
        }
      }

      if (shouldUpdate) {
        if (oldGist?.files?.[filename]) {
          console.log(`Content changed, updating gist at ${filename}.`);
        } else {
          console.log(`Content didn't exist, creating gist at ${filename}.`);
        }

        await updateGist(body); 
      }
    }
  } catch (error) {
    core.setFailed(error.message || error);
  }
}

// Fire the runner execution
run();
