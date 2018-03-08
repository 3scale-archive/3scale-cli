var appplan = require("../lib/application_plans");

module.exports = function applicationPlanCommand(program) {
  program
    .command("app-plan <cmd>")
    .description("\n  create - Create a new Application Plan \n  list - List all Application Plans \n  show - Show a specific Application Plan of a service \n  delete - Delete an Application Plan of a service")
    .option("-s, --service <service_id>","Specify service id")
    .option("-p, --plan <appplan_name>","Specify application plan name")
    .option("-a, --appplan <appplan_id>", "Specify application plan id")
    .action(function(command,options){
      program.isConfigured()
      program.require(options.service,"Service ID");

      switch (command) {
        case "create":
            if(!options.plan){
              program.error({message:"Plan name is required, use -p, --plan <appplan_name>"});
              process.exit(1);
            }
            appplan.createApplicationPlan(options.service,options.plan).then(function(result){
              var msg = "Application plan named "+result.name.inverse+" with id "+ result.id.toString().inverse+" created on 3scale"
              program.print({message:msg, type:"success"});
            });
            break;
        case "list":
            appplan.listApplicationPlans(options.service).then(function(result){
              var msg = "There are "+result.length.inverse+" application plans for this service.\n"
              program.print({message:msg, type:"success", table: result, key:"application_plan"});
            })
            break;
        case "show":
            if(options.appplan){ //by id
              appplan.getApplicationPlanById(options.service,options.appplan).then(function(result){
                var msg = "1 Application plan found:\n"
                program.print({message:msg, type:"success",table: result});
              });
            }else if(options.plan){ //by name
              appplan.getApplicationPlanByName(options.service,options.plan).then(function(err,result){
                if(result){
                  var msg = "1 Application plan found:\n"
                  program.print({message:msg, type:"success",table: result});
               }else{
                 var msg = "No Application plan with name "+options.plan.inverse+" found 😫"
                 program.print({message:msg, type:"error"});
               }
              });
            }
            break;
        case "delete":
          if(options.appplan){ //delete by id
            appplan.deleteApplicationPlanById(options.service,options.appplan).then(function(err, result){
              if(result){
                var msg = "Application plan id "+options.appplan.inverse+" has been deleted."
                program.print({message:msg, type:"success"});
              }
            });
          }else if(options.plan){ //delete by name
            appplan.deleteApplicationPlanByName(options.service,options.plan).then(function(result){
              if(result){
                var msg = "Application plan with name "+options.plan.inverse+" has been deleted."
                program.print({message:msg, type:"success"});
              }else{
                var msg = "No Application plan with name "+options.plan.inverse+" found 😫"
                program.print({message:msg, type:"error"});
              }
            });
          }
          break;
        case "copy":
            appplan.copyApplicationPlan(options.service,options.appplan)
            .then(function(result){
              var msg = "Application plan "+options.appplan.inverse+" copied successfully."
              program.print({message:msg, type:"success"});
            })
            break;
        default:
          program.error({message:"Unknown command \""+command+"\""});
          process.exit(1)
      }
    });
}
