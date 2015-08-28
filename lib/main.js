(function() {
 var cli, colors, err, pkg, program, parser, async, slugify, request, generator;
 program = require("commander");
 colors = require("colors");
 pkg = require("../package.json");
 cli = require("./3scale-cli");
 parser = require("swagger-parser");
 async = require("async");
 slugify = require("slugify");
 request = require("request");
var config = require("./config");
var services = require("./services");
var appplan = require("./application_plans");
var metrics = require("./metrics");
var methods = require("./methods");
var lambda = require("./lambda");
var swagger = require("./swagger");

var isConfigured = function(){
  if(!config.get('threescale:id') || !config.get('threescale:provider_key')){
    cli.error({message:"You need to configure the 3scale cli tool before using it. Configure it with the command: ", command:"3scale-cli config"});
    process.exit(1);
  }
  return true;
};

 program
    .version(pkg.version)
    .description(pkg.description);

 program
    .command("import")
    .description("Import a swagger spec into 3scale")
    .option("-f, --file <path>", "Specify path to a Swagger file")
    .option("-s, --service <service_id>","Specify service id")
    .action(function(command){
      if(!isConfigured())
        process.exit(1);

      if(!command.file){
        cli.error({message:"File parameter is required"});
        process.exit(1);
      }
      if(command.service_id){
        swagger.import(command.file, command.service_id);
      }else {
        swagger.import(command.file);
      }
    });

 program
    .command("lambda")
    .option("-s, --service <service_id>","Specify service id")
    .description("generate the Lambda function to integrate with 3scale")
    .action(function(command){
      if(!isConfigured())
        process.exit(1);

      if(!command.service){
        cli.error({message:"Service id parameter is required"});
        process.exit(1);
      }
      lambda.generateLambdaFunction(command.service);
    });

program
  .command("config")
  .description("Configure the 3scale cli")
  .action(config.configure);

  program
    .command("appplan")
    .option("-s, --service <service_id>","Specify service id")
    .option("-c,--create <name>","Specify service name")
    .action(function(command){
      if(!isConfigured())
        process.exit(1);

      if(!command.service){
        cli.error({message:"Service id parameter is mandatory"});
        process.exit(1);
      }
      appplan.createAppPlan(command.service,command.create);
    });


  program
    .command("metrics")
    .option("-s, --service <service_id>","Specify service id")
    .option("-l, --list","List all metrics")
    .option("-c, --create <name>","Create a new metric")
    .option("--unit <name>", "unit name")
    .action(function(command){
      if(!isConfigured())
        process.exit(1);

      if(!command.service){
        cli.error({message:"Service id parameter is mandatory"});
        process.exit(1);
      }
      if(command.list){
        metrics.listMetrics(command.service);
      }
      if(command.create){
          if(command.unit){
            metrics.createMetric(command.service,command.create,command.unit);
          }else {
            metrics.createMetric(command.service,command.create);
          }
      }
    });

  program
    .command("methods")
    .option("-s, --service <service_id>","Specify service id")
    .option("-m, --metric <metric_id>","Metric id")
    .option("-l, --list","List all methods")
    .option("-c, --create <name>","Create a new method")
    .option("--unit <name>", "unit name")
    .action(function(command){
      if(!isConfigured())
        process.exit(1);

      if(!command.service){
        cli.error({message:"Service id parameter is mandatory"});
        process.exit(1);
      }
      if(!command.metric){
        cli.error({message:"Metric id parameter is mandatory"});
        process.exit(1);
      }
      if(command.list && command.metric){
        methods.listMethods(command.service);
      }
      if(command.create){
          if(command.unit){
            methods.createMethod(command.service,command.metric,command.create,command.unit);
          }else {
            methods.createMethod(command.service,command.metric,command.create);
          }
      }
    });

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
