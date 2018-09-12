const chalk = require('chalk');
const leftPad = require('left-pad');

function fromatScriptsAsChoices(data) {
  const { scripts } = data;
  const scriptNames = Object.keys(scripts);
  const longestScriptNameLength = scriptNames
    .map(scriptName => scriptName.length)
    .reduce((acc, curr) => (acc < curr ? curr : acc), 0);

  return scriptNames.map(scriptName => ({
    name: `${leftPad(scriptName, longestScriptNameLength, ' ')} ${chalk.grey(
      scripts[scriptName]
    )}`,
    value: scriptName
  }));
}

module.exports = fromatScriptsAsChoices;
