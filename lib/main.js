(function() {
 var cli, pkg, program;
 program = require("commander");
 pkg = require("../package.json");
 cli = require("./3scale-cli");
var config = require("./config");

//Make cli commands available in program object
program.error = cli.error
program.print = cli.print
program.prompt = require('prompt');

//include other Commands
var commands = require('../commands')(program);

// Check if the tool is configured
program.isConfigured = function(){
  if(!config.get('threescale:id') || !config.get('threescale:provider_key')){
    cli.error({message:"You need to configure the 3scale cli tool before using it. Configure it with the command: ", command:"3scale-cli config"});
    process.exit(1);
  }
  return true;
};

// Check that variable is passed in command
program.require = function(val,name){
  if(!val){
    program.error({message: name+" is required"});
    process.exit(1);
  }
  return true
}

 program
    .version(pkg.version)
    .description(pkg.description)
    .usage('[command] [options]');

  program.parse(process.argv);

if(process.argv.length === 2){
  program.help();
}

}).call(this);
