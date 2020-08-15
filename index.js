const core = require('@actions/core');
const http = require('http');

try {
  const auth = core.getInput('auth');
  const gistId = core.getInput('gist-id');
  const badgeName = core.getInput('badge-name');

  const label = core.getInput('label');
  const message = core.getInput('message');
  const labelColor = core.getInput('label-color');
  const color = core.getInput('color');

  let description = {schemaVersion: 1, label: label, message: message};

  if (labelColor != undefined) {
    description.labelColor = labelColor;
  }

  if (color != undefined) {
    description.labelColor = color;
  }

  let data = {files: {}};
  data.files[badgeName] = {content: JSON.stringify(description)};

  console.log(JSON.stringify(data));
  console.log(gistId);

  const options = {
    host: 'api.github.com',
    path: '/gists/' + gistId,
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'token ' + auth,
    }
  };

  const callback = (response) => {
    let str = '';

    response.on('data', (chunk) => {
      str += chunk;
    });

    response.on('end', () => {
      console.log(str);
    });
  };

  const req = http.request(options, callback);
  req.write(JSON.stringify(data));
  req.end();

} catch (error) {
  core.setFailed(error.message);
}