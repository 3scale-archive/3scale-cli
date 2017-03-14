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

program
  .command("config")
  .description("Configure the 3scale cli")
  .action(config.configure);

  program
    .command("services")
    .description("Create a new service")
    .option("-c,--create <name>","Specify service name")
    .action(function(command){
      if(!isConfigured())
        process.exit(1);

      if(!command.create){
        cli.error({message:"Name of the service is required"});
        process.exit(1);
      }

      services.createService(command.create);
    });

  program.parse(process.argv);

// check presence of required env variables

// if(!process.env['THREESCALE_PROVIDER_KEY']){
//   cli.error({error:"Environement variable THREESCALE_PROVIDER_KEY is not set. ie. export THREESCALE_PROVIDER_KEY=<provider_key>"});
//   process.exit(1);
// }
// if(!process.env['THREESCALE_ID']){
//   cli.error({error:"Environement variable THREESCALE_ID is not set. ie. export THREESCALE_ID=<three_scale_id>"});
//   process.exit(1);
// } else {
//   var API ="https://"+process.env['THREESCALE_ID']+"-admin.3scale.net/admin/api";
// }
if(process.argv.length === 2){
  program.help();
}

}).call(this);
