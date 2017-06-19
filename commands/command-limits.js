var limits = require("../lib/limits");

module.exports = function limitsCommand(program) {
  program
    .command("limits <cmd>")
    .description("\n  create - Create a new limit \n  list - List all limit of a service \n  delete - Delete a limit of a service")
    .option("-s, --service <service_id>","Specify service id")
    .option("-m, --metric <metric_id>","Metric id")
    .option("-a, --appplan <appplan_id>", "Specify application plan id")
    .option("-u, --unit <name>", "unit name")
    .option("-p, --period <name>", "Period of the limit")
    .option("-l, --limit <limit_id>","Limit id")
    .action(function(command,options){
      program.isConfigured()
      program.require(options.appplan,"Application Plan ID");

      switch (command) {
          case "create":
            program.require(options.metric,"Metric ID required");
            program.require(options.period,"Period required. possible values: eternity, year, month, day, hour, minute");
            program.require(options.unit,"Value required");

            limits.createLimit(options.appplan, options.metric, options.period, options.value).then(function(result){
              var msg = "Limit of" +result.value+" per "+result.period+" created under "+options.appplan.inverse+" Application Plan."
              program.print({message:msg, type:"success"});
            });
            break;
          case "list":
            limits.getLimitsByApplicationPlanId(options.appplan).then(function(result){
              var msg = "There are "+result.length+" limits for this service.\n"
              program.print({message:msg, type:"success", table: result, key:"limit"});
            });
            break;
          // case "update":
          //   program.require(options.metric,"Metric ID required");
          //   program.require(options.methodID,"Method ID required");
          //
          //   methods.updateMethod(options.service,options.metric,options.methodID,options.method,options.unit).then(function(result){
          //       var msg = "Method with id "+options.methodID.inverse+" updated.\n"
          //       program.print({message:msg, type:"success", table: result});
          //   });
          //   break;
          case "delete":
            program.require(options.metric,"Metric ID required");
            program.require(options.limit,"Limit ID required");

            limits.deleteLimit(options.appplan,options.metric,options.limit).then(function(result){
              if(result){
                var msg = "Limit id "+options.limit.inverse+" has been deleted."
                program.print({message:msg, type:"success"});
              }
            });
            break;
          default:
            program.error({message:"Unknown command \""+command+"\""});
            process.exit(1)
      } //end switch
    }); //end action
}
