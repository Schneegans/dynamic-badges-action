const core = require('@actions/core');
const http = require('https');

try {
  let description = {
    schemaVersion: 1,
    label: core.getInput('label'),
    message: core.getInput('message')
  };

  const labelColor = core.getInput('label-color');
  const color = core.getInput('color');
  const isError = core.getInput('is-error');
  const namedLogo = core.getInput('named-logo');
  const logoSvg = core.getInput('logo-svg');
  const logoColor = core.getInput('logo-color');
  const logoWidth = core.getInput('logo-width');
  const logoPosition = core.getInput('logo-position');
  const style = core.getInput('style');
  const cacheSeconds = core.getInput('cache-seconds');


  if (labelColor != '') {
    description.labelColor = labelColor;
  }

  if (color != '') {
    description.color = color;
  }

  if (isError != '') {
    description.isError = isError;
  }

  if (namedLogo != '') {
    description.namedLogo = namedLogo;
  }

  if (logoSvg != '') {
    description.logoSvg = logoSvg;
  }

  if (logoColor != '') {
    description.logoColor = logoColor;
  }

  if (logoWidth != '') {
    description.logoWidth = parseInt(logoWidth);
  }

  if (logoPosition != '') {
    description.logoPosition = logoPosition;
  }

  if (style != '') {
    description.style = style;
  }

  if (cacheSeconds != '') {
    description.cacheSeconds = parseInt(cacheSeconds);
  }

  let data = {files: {}};
  data.files[core.getInput('badge-name')] = {
    content: JSON.stringify(description)
  };
  data = JSON.stringify(data);

  const req = http.request(
      {
        host: 'api.github.com',
        path: '/gists/' + core.getInput('gist-id'),
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': data.length,
          'User-Agent': 'Schneegans',
          'Authorization': 'token ' + core.getInput('auth'),
        }
      },
      res => {
        let body = '';

        res.on('data', data => {
          body += data;
        });

        res.on('end', () => {
          console.log('result:' + body);
        });
      });

  req.write(data);
  req.end();

} catch (error) {
  core.setFailed(error);
}