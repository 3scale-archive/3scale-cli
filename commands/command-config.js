var services = require("../lib/services");

module.exports = function configCommand(program) {
  program
    .command("config")
    .description("Configure the 3scale cli")
    .action(config.configure);
}
