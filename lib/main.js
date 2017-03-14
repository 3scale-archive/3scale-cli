(function() {
 var cli, err, pkg, program, parser, async, slug, request, generator;
 program = require("commander");
 pkg = require("../package.json");
 cli = require("./3scale-cli");
 parser = require("swagger-parser");
 async = require("async");
 slug = require("slug");
 request = require("request");
var config = require("./config");
var services = require("./services");
var metrics = require("./metrics");
var swagger = require("./swagger");
var raml = require("./raml");

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

 program
    .command("import")
    .description("Import a swagger spec into 3scale")
    .option("-f, --file <path>", "Specify path to an API description file")
    .option("-t, --type <spec_type>", "Specify path to an API description file")
    .option("-p, --pattern <pattern_type>","Pattern for method names")
    .option("-s, --service <service_id>","Specify service id")
    .option("-a, --appplan <applan_name>","Specify Application Plan name")
    .action(function(command){
      if(!isConfigured())
        process.exit(1);

      if(!command.file){
        cli.error({message:"File parameter is required"});
        process.exit(1);
      }

      if(command.type && command.type.toLowerCase() === "raml"){
        raml.import(command.file, command.service || null, command.appplan || null, command.pattern || null);
      }else{
        swagger.import(command.file, command.service || null, command.appplan || null, command.pattern || null);
      }
    });

  program.parse(process.argv);

if(process.argv.length === 2){
  program.help();
}

}).call(this);
