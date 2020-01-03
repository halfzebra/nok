const chalk = require('chalk');
const leftPad = require('left-pad');

function filterScriptNames(scriptNames, filterHookNames) {
  if (filterHookNames === false) return scriptNames;
  return scriptNames.filter(scriptName => !(/^pre|post/).test(scriptName))
}

function fromatScriptsAsChoices(data, filterHookNames) {
  const { scripts } = data;
  const scriptNames = Object.keys(scripts);
  const filteredScriptNames = filterScriptNames(scriptNames, filterHookNames);
  const longestScriptNameLength = filteredScriptNames 
    .map(scriptName => scriptName.length)
    .reduce((acc, curr) => (acc < curr ? curr : acc), 0);

  return filteredScriptNames.map(scriptName => ({
    name: `${leftPad(scriptName, longestScriptNameLength, ' ')} ${chalk.grey(
      scripts[scriptName]
    )}`,
    value: scriptName
  }));
}

module.exports = fromatScriptsAsChoices;
