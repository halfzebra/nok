const path = require('path');
const chalk = require('chalk');
const fs = require('fs');
const inquirer = require('inquirer');
const readJson = require('read-package-json');
const findRoot = require('find-root');
const execa = require('execa');
const fromatScriptsAsChoices = require('./formatScriptsAsChoices');
const shellHistory = require('shell-history');

module.exports = function() {
  let rootPath;

  try {
    rootPath = findRoot(process.cwd());
  } catch (err) {
    console.log();
    console.log(chalk.bold.red("Coudn't locate the package.json"));
    console.log();
    console.log('  Please make sure you are running "nok" in a Node project');
    console.log();
    process.exit(0);
  }

  readJson(path.join(rootPath, 'package.json'), (err, data) => {
    if (err) {
      console.log();
      console.log(chalk.bold.red('Failed to read package.json'));
      console.log();
      console.log(err);
      console.log();
      process.exit(1);
    }

    if (!data.scripts || Object.keys(data.scripts).length === 0) {
      console.log();
      console.log('There are no scripts in yor package.json');
      console.log();
      console.log('  Try adding a few scripts first');
      console.log();
      process.exit(0);
    }
    const [,,...args] = process.argv;
    const filterHookNames = args.some(arg => arg.includes('--filterHooks'));
    const choices = fromatScriptsAsChoices(data, filterHookNames);
    const history = shellHistory();
    const npmScriptHistory = findNpmScriptsInHistory(history);
    const defaultScriptName = defaultScriptNameFromNpmScriptHistory(
      npmScriptHistory,
      data.scripts
    );

    console.log();
    inquirer
      .prompt([
        {
          name: 'script',
          type: 'list',
          message: chalk.green('What would you like to run?'),
          choices,
          default: defaultScriptName ? defaultScriptName : null,
          prefix: '👟 '
        }
      ])
      .then(({ script }) => {
        if (!fs.existsSync(path.join(rootPath, 'node_modules'))) {
          console.log();
          console.log(
            chalk.green(
              'NPM modules are not installed, we will install them first...'
            )
          );
          console.log();

          execa.shellSync('npm install', {
            cwd: rootPath,
            stdio: 'inherit'
          });
        }

        execa.shellSync('npm run ' + script, {
          cwd: rootPath,
          stdio: 'inherit'
        });
      });
  });
};

function findNpmScriptsInHistory(history) {
  return history
    .filter(command => command.match(/^ ?npm +run +.+/))
    .map(command => command.replace(/^ ?npm +run +(.+)/, '$1'))
    .reduce(
      (acc, curr) => (acc.indexOf(curr) === -1 ? [...acc, curr] : acc),
      []
    );
}

function defaultScriptNameFromNpmScriptHistory(npmScriptHistory, scripts) {
  return npmScriptHistory.reverse().find(script => scripts[script]);
}
