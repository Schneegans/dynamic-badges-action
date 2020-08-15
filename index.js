const core = require('@actions/core');
const github = require('@actions/github');

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
  data.files[badgeName].content = JSON.stringify(description);

  console.log(JSON.stringify(data));

} catch (error) {
  core.setFailed(error.message);
}