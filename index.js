const core = require('@actions/core');
const http = require('https');

try {

  function updatingGist(data) {
    // Perform the actual request. The user agent is required as defined in
    // https://developer.github.com/v3/#user-agent-required
    const updateGistOptions = {
      host: 'api.github.com',
      path: '/gists/' + core.getInput('gistID'),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
        'User-Agent': 'Schneegans',
        'Authorization': 'token ' + core.getInput('auth'),
      }
    };
  
    return doRequest(updateGistOptions, data)
  }
  
  function doRequest(options, data) {
    return new Promise((resolve, reject) => {
      const req = http.request(options, (res) => {
        res.setEncoding('utf8');
        let responseBody = '';
  
        res.on('data', (chunk) => {
          responseBody += chunk;
        });
  
        res.on('end', () => {
          const { statusCode, statusMessage } = res;
          resolve({ statusCode, statusMessage, body: JSON.parse(responseBody) });
        });
      });
  
      req.on('error', (err) => {
        reject(err);
      });
  
      req.write(data)
      req.end();
    });
  }

  // This object will be stringified and uploaded to the gist. The
  // schemaVersion, label and message attributes are always required. All others
  // are optional and added to the content object only if they are given to the
  // action.
  let content = {
    schemaVersion: 1,
    label: core.getInput('label'),
    message: core.getInput('message')
  };

  const updateIfChanged     = core.getInput('updateIfChanged');
  
  // Compute the message color based on the given inputs.
  const color                = core.getInput('color');
  const valColorRange        = core.getInput('valColorRange');
  const minColorRange        = core.getInput('minColorRange');
  const maxColorRange        = core.getInput('maxColorRange');
  const invertColorRange     = core.getInput('invertColorRange');
  const colorRangeSaturation = core.getInput('colorRangeSaturation');
  const colorRangeLightness  = core.getInput('colorRangeLightness');

  if (minColorRange != '' && maxColorRange != '' && valColorRange != '') {
    const max = parseFloat(maxColorRange);
    const min = parseFloat(minColorRange);
    let val = parseFloat(valColorRange);

    if (val < min) val = min;
    if (val > max) val = max;

    let hue = 0;
    if (invertColorRange == '') {
      hue = Math.floor((val - min) / (max - min) * 120);
    } else {
      hue = Math.floor((max - val) / (max - min) * 120);
    }

    let sat = 100;
    if (colorRangeSaturation != '') {
      sat = parseFloat(colorRangeSaturation);
    }

    let lig = 40;
    if (colorRangeLightness != '') {
      lig = parseFloat(colorRangeLightness);
    }

    content.color = 'hsl(' + hue + ', ' + sat + '%, ' + lig + '%)';

  } else if (color != '') {

    content.color = color;
  }

  // Get all optional attributes and add them to the content object if given.
  const labelColor   = core.getInput('labelColor');
  const isError      = core.getInput('isError');
  const namedLogo    = core.getInput('namedLogo');
  const logoSvg      = core.getInput('logoSvg');
  const logoColor    = core.getInput('logoColor');
  const logoWidth    = core.getInput('logoWidth');
  const logoPosition = core.getInput('logoPosition');
  const style        = core.getInput('style');
  const cacheSeconds = core.getInput('cacheSeconds');
  const filename     = core.getInput('filename');

  if (labelColor != '') {
    content.labelColor = labelColor;
  }

  if (isError != '') {
    content.isError = isError;
  }

  if (namedLogo != '') {
    content.namedLogo = namedLogo;
  }

  if (logoSvg != '') {
    content.logoSvg = logoSvg;
  }

  if (logoColor != '') {
    content.logoColor = logoColor;
  }

  if (logoWidth != '') {
    content.logoWidth = parseInt(logoWidth);
  }

  if (logoPosition != '') {
    content.logoPosition = logoPosition;
  }

  if (style != '') {
    content.style = style;
  }

  if (cacheSeconds != '') {
    content.cacheSeconds = parseInt(cacheSeconds);
  }

  let shouldUpdate = true;

  // For the POST request, the above content is set as file contents for the
  // given filename.
  const request = JSON.stringify({
    files: {[filename]: {content: JSON.stringify(content)}}
  });
  
  if (updateIfChanged == 'true') {
    const getGistOptions = {
      host: 'api.github.com',
      path: '/gists/' + core.getInput('gistID'),
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Schneegans',
        'Authorization': 'token ' + core.getInput('auth'),
      }
    };
    
    doRequest(getGistOptions, JSON.stringify({})).then(oldGist => {
      if (oldGist.statusCode < 200 || oldGist.statusCode >= 400) {
        // print the error, but don't fail the action
        console.log(
          'Failed to get gist, response status code: ' + oldGist.statusCode +
          ', status message: ' + oldGist.statusMessage);
      } 
      
      if (oldGist && oldGist.body && oldGist.body.files && oldGist.body.files[filename]) {
        const oldContent = oldGist.body.files[filename].content;

        if (oldContent === JSON.stringify(content)) {
          console.log(`Content did not change, not updating gist at ${filename}`);
          shouldUpdate = false;
        }
      }

      if (shouldUpdate) {
        if (oldGist.body.files[filename]) {
          console.log(`Content changed, updating gist at ${filename}`);
        } else {
          console.log(`Content didn't exist, creating gist at ${filename}`);
        }

        updatingGist(request).then(res => {
          if (res.statusCode < 200 || res.statusCode >= 400) {
            core.setFailed(
              'Failed to create gist, response status code: ' + res.statusCode +
              ', status message: ' + res.statusMessage);
          } else {
            console.log('Success!');
          }
        });
      }
    });
  } else {
    updatingGist(request).then(res => {
      if (res.statusCode < 200 || res.statusCode >= 400) {
        core.setFailed(
          'Failed to create gist, response status code: ' + res.statusCode +
          ', status message: ' + res.statusMessage);
      } else {
        console.log('Success!');
      }
    });
  }
} catch (error) {
  core.setFailed(error);
}
