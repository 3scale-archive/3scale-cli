(function() {
 var cli, pkg, program;
 program = require("commander");
 pkg = require("../package.json");
 cli = require("./3scale-cli");
var config = require("./config");
var Q = require("q");
var request = Q.denodeify(require("request"));

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

// check on NPM what is the latest version of the tool
program.isLatest = function() {
  var options = {
    url: "https://registry.npmjs.org/node-3scale-cli/latest",
  }
  var response = request(options);
  response.then(function(r){
    var res  = r[0].req.res;
    var body = JSON.parse(res.body);
    if(body.version !== pkg.version && body.version > pkg.version){
      var msg = "\n\t" + "⚠️ ⚠️ ⚠️ ⚠️ ⚠️ ⚠️ ⚠️ ⚠️ ⚠️"
      msg += "\n\t"+ "Your version of "+"3scale-cli".inverse +" tool is outdated."
      msg += "\n\t" + "Local version installed: "+pkg.version.bold
      msg += "\n\t" + "Latest version available on NPM: "+body.version.green.bold
      msg += "\n\t" + "Update 3scale-cli with the following command:"
      msg += "\n\t" + "npm update -g node-3scale-cli".green.italic
      msg += "\n\t" + "⚠️ ⚠️ ⚠️ ⚠️ ⚠️ ⚠️ ⚠️ ⚠️ ⚠️"
      cli.error({message:msg});
    }
  })
}

// Check that variable is passed in command
program.require = function(val,name){
  if(!val){
    program.error({message: name+" is required"});
    process.exit(1);
  }
  return true
}

// Check that variable value is in accepted list
program.isValidValue = function(val, possibleValues, name){
  if(possibleValues.indexOf(val)===-1){
    program.error({message: name.inverse +" with value " + val.inverse +" is not valid. Possible values are: " + possibleValues+"."});
    process.exit(1);
  }
  return true
}

 program
    .version(pkg.version)
    .description(pkg.description)
    .usage('[command] [options]');

  program.isLatest();

  program.parse(process.argv);

if(process.argv.length === 2){
  program.help();
}

//if command is not part of available command display general help
if(process.argv.length > 2 && typeof program._events['command:'+process.argv[2]] === "undefined"){
  program.error({message:"Unknown command \""+process.argv[2]+"\""});
  program.outputHelp()
  process.exit(1)
}

}).call(this);
