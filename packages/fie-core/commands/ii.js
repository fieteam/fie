/**
 */
const fieNpm = require('fie-npm');
const argv = require('yargs').argv;

module.exports = function* () {
  const modules = argv._.slice(1);
  delete argv._;
  delete argv.$0;


  if (modules.length) {
    yield fieNpm.install(modules, argv);
  } else {
    yield fieNpm.installDependencies(argv);
  }
};
