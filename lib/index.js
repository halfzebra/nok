const path = require('path');
const chalk = require('chalk');
const inquirer = require('inquirer');
const readJson = require('read-package-json');
const findRoot = require('find-root');
const execa = require('execa');
const fromatScriptsAsChoices = require('./formatScriptsAsChoices');

module.exports = function() {
  let rootPath;

  try {
    rootPath = findRoot(process.cwd());
  } catch (err) {
    console.log(chalk.red("Coudn't locate the package.json"));
    process.exit(0);
  }

  readJson(path.join(rootPath, 'package.json'), (err, data) => {
    const choices = fromatScriptsAsChoices(data);

    inquirer
      .prompt([
        {
          name: 'script',
          type: 'list',
          message: chalk.green('What do you want to do?'),
          choices
        }
      ])
      .then(({ script }) => {
        execa.shellSync('npm run ' + script, {
          cwd: rootPath,
          stdio: 'inherit'
        });
      });
  });
};
