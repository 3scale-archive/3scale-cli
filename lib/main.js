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
  if(!config.get('threescale:id') || !config.get('threescale:access_token')){
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

//if command is not part of available command display general help
if(process.argv.length > 2 && typeof program._events[process.argv[2]] === "undefined"){
  program.error({message:"Unknown command \""+process.argv[2]+"\""});
  program.outputHelp()
  process.exit(1)
}

}).call(this);
