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
 generator = require("3scale-lambda");
var config = require("./config");
var services = require("./services");
var appplan = require("./application_plans");
var metrics = require("./metrics");
var methods = require("./methods");

 program
    .version(pkg.version)
    .description(pkg.description);

 program
    .command("import")
    .description("Import a swagger spec into 3scale")
    .option("-f, --file <path>", "Specify path to a Swagger file")
    .option("-s, --service <service_id>","Specify service id")
    .action(function(command){
      run(command.file);
    });

 program
    .command("lambda")
    .description("generate the Lambda function to integrate with 3scale")
    .action(generateLambdaFunction);

program
  .command("config")
  .description("Configure the 3scale cli")
  .action(config.configure);

  program
    .command("appplan")
    .option("-s, --service <service_id>","Specify service id")
    .option("-c,--create <name>","Specify service name")
    .action(function(command){
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
      services.createService(command.create);
    });

  program.parse(process.argv);

// check presence of required env variables

if(!process.env['THREESCALE_PROVIDER_KEY']){
  cli.error({error:"Environement variable THREESCALE_PROVIDER_KEY is not set. ie. export THREESCALE_PROVIDER_KEY=<provider_key>"});
  process.exit(1);
}
if(!process.env['THREESCALE_ID']){
  cli.error({error:"Environement variable THREESCALE_ID is not set. ie. export THREESCALE_ID=<three_scale_id>"});
  process.exit(1);
} else {
  var API ="https://"+process.env['THREESCALE_ID']+"-admin.3scale.net/admin/api";
}
if(process.argv.length === 2){
  program.help();
}

/**
 * action used for the '3scale-cli lambda' command
 */

function generateLambdaFunction () {
  var outputDir = process.cwd();
  console.info(colors.blue("writing your Lambda bundle to " + outputDir));
  var options = {
    providerKey: process.env.THREESCALE_PROVIDER_KEY,
    serviceID: process.env.THREESCALE_SERVICE_ID
  }
  generator(options, outputDir);
}

/**
 * action used when calling '3scale-cli' with no command
 */

function run(path) {
  try {
    parser.parse(path, function(err, api, metadata) {
      if(err)
        cli.error({error:err});

      if(api){ //swagger valid file
        var title = api.info.title;
        cli.print({message: "Loading "+title+ " swagger definition."});
        //get provider_key from env
        var PROVIDER_KEY = process.env['THREESCALE_PROVIDER_KEY'];

        async.waterfall([
          function(callback){
            callback(null,title+Math.floor((Math.random() * 50) + 10));
          },
          function (name,createServiceCb){
            console.log(PROVIDER_KEY,slugify(name,"_"));
            var url = API+"/services.json";
            var options ={
              url: url,
              form:{
                "provider_key":PROVIDER_KEY,
                "name":name,
                "system_name":slugify(name,"_")
              }
            };
            request.post(options, function(error, response, body){
              console.log("createService",body);
              if(error){
                createServiceCb(error);
              }else {
                var data =  JSON.parse(body);
                if(data.errors)
                  createServiceCb(data.errors);

                // cli.print({message:data});
                SERVICE_ID = data.service.id;
                cli.print({message: "Service with id "+ SERVICE_ID+" created on 3scale"});
                createServiceCb(null, data.service.id);
              }
            });
          },
          function(service_id,createApplicationPlanCb){
            var url = API+"/services/"+service_id+"/application_plans.json";
            // console.log(url);
            var options ={
              url: url,
              form:{
                "provider_key":PROVIDER_KEY,
                "name":"default",
                "system_name":"default",
                "state":"published"
              }
            };
            request.post(options, function(error, response, body){
              // console.log("application_plan",body);
              if(error){
                createApplicationPlanCb(error);
              }else{
                var data =  JSON.parse(body);
                if(data.errors)
                  createApplicationPlanCb(error);

                APPLICATION_PLAN_ID = data.application_plan.id;
                cli.print({message: "Application plan with id "+ APPLICATION_PLAN_ID+" created on 3scale"});
                createApplicationPlanCb(null, data.application_plan.id);
              }
            });
          },
          function(arg1,listMetricCb){
            var url = API+"/services/"+SERVICE_ID+"/metrics.json";
            // console.log(url);
            var options ={
              url: url,
              form:{
                "provider_key":PROVIDER_KEY,
                "service_id":SERVICE_ID,
              }
            };
            request.get(options, function(error, response, body){
              // console.log(body);
              if(error){
                listMetricCb(error);
              }else{
                var data =  JSON.parse(body);
                console.log("list metric",data);
                if(data.errors)
                  listMetricCb(error);

                // console.log("METRICS_",data);
                METRIC_ID = data.metrics[0].metric.id;
                cli.print({message: "Hits metric with id "+ METRIC_ID+" found on 3scale"});
                listMetricCb(null,data.metrics[0].metric.id); //by default first it's hits
              }
            });
          },
          function(metric_id,createMethodCb){
            var methods = [];
            for (var e in api.paths){
              // console.log(e,api.paths[e]);
              for(var m in api.paths[e]){ //methods
                var method = api.paths[e][m];
                method.path = api.basePath+e;
                method.method = m;
                methods.push(method);
                // createMethod(SERVICE_ID,METRIC_ID,method.operationId,1);
              }
           }
           if(methods.length === 0){
             cli.error({error:"No endpoints defined in Swagger spec. Could not push methods to 3scale."});
             createMethod(null);
           }else{
             createMethodCb(null,methods);
           }
          },function(methods,createMethodCb){
            var L = methods.length;
            methods.forEach(function(m,i){
              var url = API+"/services/"+SERVICE_ID+"/metrics/"+METRIC_ID+"/methods.json";

              var method_name = slugify(m.path.replace(/[/]/g,"_").substring(1)+"_"+m.method.toUpperCase(),"_");

              var options ={
                url: url,
                form:{
                  "provider_key":PROVIDER_KEY,
                  "service_id":SERVICE_ID,
                  "metric_id": METRIC_ID,
                  "friendly_name":method_name,
                  "system_name":method_name,
                  "unit":1
                }
              };
              request.post(options, function(error, response, body){
                if(error)
                  cli.error({error: error});

                var data = JSON.parse(body).method;
                cli.print({message:"Method "+data.name+" with system_name "+data.system_name+" created on 3scale."});
                L=L-1;
                if(L==0){ // check when done iterating;
                  createMethodCb(null);
                }
              });
            });
          },
          function(){
            cli.print({type:"success",message:"Import on 3scale succeed. Now add a new env. variable",command:"export THREESCALE_SERVICE_ID="+SERVICE_ID});
          }
        ], function (err, result) {
            // result now equals 'done'
            if(err){
             console.log(JSON.parse(err).system_name);
             cli.error({error: err});
            }

            console.log("done",err,result);
        });

        //start waterfall
      }
    });

   } catch (_error) {
    err = _error;
    console.log("[", "3scale-cli".white, "]", err.toString().red);
  }
}

}).call(this);
