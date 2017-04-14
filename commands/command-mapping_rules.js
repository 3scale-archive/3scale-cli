var maprules = require("../lib/mappingrules");

module.exports = function mappingRulesCommand(program) {
  program
    .command("maprules <cmd>")
    .description("\n  create - Create a new mapping rule \n  list - List all mapping rules of a service \n  show - Show a specific mapping rules of a service \n update - update a specific mapping rules of a service \n  delete - Delete a mapping rule of a service")
    .option("-s, --service <service_id>","Service id")
    .option("-p, --pattern <pattern_type>","Pattern for method names")
    .option("--http <http_method>","Specify HTTP method (GET, POST, PUT,...)")
    .option("-d, --delta <delta>","Increase the metric by this delta.")
    .option("-m, --metric <metric_id>","Metric ID")
    .option("-r, --maprule <maprule_id>","Mapping rule ID")
    .action(function(command,options){
      program.isConfigured()

      switch (command) {
          case "create":
            program.require(options.service,"Service ID");
            program.require(options.pattern,"Pattern of mapping rule");
            program.require(options.http,"Pattern of mapping rule");
            program.require(options.delta,"Delta unit of mapping rule");
            program.require(options.metric,"Metric ID of mapping rule");

            maprules.createMappingRule(options.service, options.http, options.pattern, options.delta, options.metric).then(function(result){
              var msg = "Mapping rule for method "+options.http.toString().inverse+" on path "+options.pattern.toString().inverse+" created.\n"
              program.print({message:msg, type:"success", data:result});
            });
            break;
          case "list":
            program.require(options.service,"Service ID");

            maprules.listMappingRules(options.service).then(function(result){
              var msg = "There are "+result.length+" mapping rules for this service.\n"
              program.print({message:msg, type:"success", table: result, key:"mapping_rule"});
            });
            break;
          case "show":
            program.require(options.service,"Service ID");
            program.require(options.maprule,"Mapping rule ID");

            maprules.getMappingRule(options.service,options.maprule).then(function(result){
              var msg = "Details about mapping rule.\n"
              program.print({message:msg, type:"success", table: result});
            });
            break;
          case "update":
            program.require(options.service,"Service ID");
            program.require(options.maprule,"Mapping rule ID");

            maprules.updateMappingRule(options.service,options.maprule,options.http, options.pattern, options.delta, options.metric).then(function(result){
                var msg = "Mapping rule id "+option.maprule.inverse+" updated.\n"
                program.print({message:msg, type:"success", data:result});
            });
            break;
          case "delete":
            program.require(options.service,"Service ID");
            program.require(options.maprule,"Mapping rule ID");
            maprules.deleteMappingRule(options.service,options.maprule).then(function(result){
              if(result){
                var msg = "Mapping rule id "+options.maprule.inverse+" has been deleted."
                program.print({message:msg, type:"success"});
              }
            });
            break;
          default:
            program.error({message:"Unknown command \""+command+"\""});
            process.exit(1)
      } //end switch
    });
}
