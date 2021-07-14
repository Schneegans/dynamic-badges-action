const core = require('@actions/core');
const http = require('https');
const fs = require('fs').promises;
const simpleGit = require('simple-git');

try {

  // This object will be stringified and uploaded. The
  // schemaVersion, label and message attributes are always required. All others
  // are optional and added to the content object only if they are given to the
  // action.
  let content = {
    schemaVersion: 1,
    label: core.getInput('label'),
    message: core.getInput('message')
  };

  // Get all optional attributes and add them to the content object if given.
  const labelColor   = core.getInput('labelColor');
  const color        = core.getInput('color');
  const isError      = core.getInput('isError');
  const namedLogo    = core.getInput('namedLogo');
  const logoSvg      = core.getInput('logoSvg');
  const logoColor    = core.getInput('logoColor');
  const logoWidth    = core.getInput('logoWidth');
  const logoPosition = core.getInput('logoPosition');
  const style        = core.getInput('style');
  const cacheSeconds = core.getInput('cacheSeconds');

  if (labelColor != '') {
    content.labelColor = labelColor;
  }

  if (color != '') {
    content.color = color;
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

  const gistID = core.getInput('gistID');
  const auth = core.getInput('auth');
  const filename = core.getInput('filename');
  const jsonBadge = JSON.stringify(content);
  if (gistID) {
    // If a gistID is given, the JSON will be stored in a gist.
    // The token will need the gist scope.

    // For the POST request, the above content is set as file contents for the
    // given filename.
    const request = JSON.stringify({
      files: {[filename]: {content: jsonBadge}}
    });

    // Perform the actual request. The user agent is required as defined in
    // https://developer.github.com/v3/#user-agent-required
    const req = http.request(
        {
          host: 'api.github.com',
          path: '/gists/' + gistID,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': request.length,
            'User-Agent': 'Schneegans',
            'Authorization': 'token ' + auth,
          }
        },
        res => {
          if (res.statusCode < 200 || res.statusCode >= 400) {
              core.setFailed('Failed to create gist, response status code: ' +  res.statusCode + ', status message: ' +  res.statusMessage);
          }
          let body = '';
          res.on('data', data => body += data);
          res.on('end', () => console.log('result:' + body));
        });

    req.write(request);
    req.end();
  } else {
    // If no gistID is given, the json will be stored in the repository's wiki.
    // The token will need the repo scope.
    const repoUrl = `https://${auth}@github.com/${process.env.GITHUB_REPOSITORY}.wiki.git`;
    WriteToWiki(jsonBadge, filename, repoUrl);
  }

} catch (error) {
  core.setFailed(error);
}

async function WriteToWiki(content, filename, repoUrl) {
  const repoPath = '/tmp/wiki';
  const filePath = `${repoPath}/${filename}`;

  await simpleGit().clone(repoUrl, repoPath);
  await fs.writeFile(filePath, content);
  await simpleGit(repoPath).add(filePath).commit("Update badge").push();
}
