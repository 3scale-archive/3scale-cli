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
var appplan = require("./application_plans");
var metrics = require("./metrics");
var methods = require("./methods");
var lambda = require("./lambda");
var swagger = require("./swagger");
var raml = require("./raml");
var maprules = require("./mappingrules");

var isConfigured = function(){
  if(!config.get('threescale:id') || !config.get('threescale:provider_key')){
    cli.error({message:"You need to configure the 3scale cli tool before using it. Configure it with the command: ", command:"3scale-cli config"});
    process.exit(1);
  }
  return true;
};

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
    .command("lambda")
    .option("-s, --service <service_id>","Specify service id")
    .description("Generate the Lambda function to integrate with 3scale")
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
    .description("Adds an application plan to a service")
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
    .description("Add a new metric to a service.")
    .option("-s, --service <service_id>","Specify service id")
    .option("-l, --list","List all metrics")
    .option("-c, --create <name>","Create a new metric")
    .option("-u, --unit <name>", "unit name")
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
    .description("Add a new method to a specific metric on a service")
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

    program
      .command("maprules <cmd>")
      .description("\n  create - Create a new mapping rule \n  list - List all mapping rules of a service \n  show - Show a specific mapping rules of a service \n  delete - Delete a mapping rule of a service")
      .option("-s, --service <service_id>","Service id")
      .option("-p, --pattern <pattern_type>","Pattern for method names")
      .option("-h, --http <http_method>","Specify HTTP method (GET, POST, PUT,...)")
      .option("-d, --delta <delta>","Increase the metric by this delta.")
      .option("-m, --metric <metric_id>","Metric ID")
      .option("-r, --maprule <maprule_id>","Mapping rule ID")
      .action(function(command,options){
        if(!isConfigured())
          process.exit(1);

        if(command === "create"){ //create a new mapping rule
          if(!options.service){
            cli.error({message:"Service ID is required"});
            process.exit(1);
          }
          if(!options.pattern){
            cli.error({message:"Pattern of mapping rule is required"});
            process.exit(1);
          }
          if(!options.http){
            cli.error({message:"HTTP method of mapping rule is required"});
            process.exit(1);
          }
          if(!options.delta){
            cli.error({message:"Delta unit of mapping rule is required"});
            process.exit(1);
          }
          if(!options.metric){
            cli.error({message:"Metric id is required"});
            process.exit(1);
          }

          maprules.createMappingRule(options.service, options.http, options.pattern, options.delta, options.metric).then(function(result){
            var msg = "Mapping rule for method "+options.http.toString().inverse+" on path "+options.pattern.toString().inverse+" created.\n"
            cli.print({message:msg, type:"success", data:result});
          });
        }else if (command === "list") { //list all the mapping rules of a service
          if(!options.service){
            cli.error({message:"Service ID is required"});
            process.exit(1);
          }
          maprules.listMappingRules(options.service).then(function(result){
            var msg = "There are "+result.length+" mapping rules for this service.\n"
            cli.print({message:msg, type:"success", table: result, key:"mapping_rule"});
          });
        }else if (command === "show") { //show a specific mapping rule of specific service
          if(!options.service){
            cli.error({message:"Service ID is required"});
            process.exit(1);
          }
          if(!options.maprule){
            cli.error({message:"Mapping rule ID is required"});
            process.exit(1);
          }
          maprules.getMappingRule(options.service,options.maprule).then(function(result){
            var msg = "Details about mapping rule.\n"
            cli.print({message:msg, type:"success", table: result});
          });
        }else if (command === "update") {
          if(!options.service){
            cli.error({message:"Service ID is required"});
            process.exit(1);
          }
          if(!options.maprule){
            cli.error({message:"Mapping rule ID is required"});
            process.exit(1);
          }
          maprules.updateMappingRule(options.service,options.maprule,options.http, options.pattern, options.delta, options.metric).then(function(result){
              var msg = "Mapping rule id "+option.maprule.inverse+" updated.\n"
              cli.print({message:msg, type:"success", data:result});
          });
        }else if (command === "delete") {
          if(!options.service){
            cli.error({message:"Service ID is required"});
            process.exit(1);
          }
          if(!options.maprule){
            cli.error({message:"Mapping rule ID is required"});
            process.exit(1);
          }
          maprules.deleteMappingRule(options.service,options.maprule).then(function(result){
            var msg = "Mapping rule id "+option.maprule.inverse+" has been deleted."
            cli.print({message:msg, type:"success"});
          });
        }
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
