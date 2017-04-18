var metrics = require("../lib/metrics");

module.exports = function metricsCommand(program) {
  program
    .command("metrics <cmd>")
    .description("\n  create - Create a new metric \n  list - List all metrics of a service \n  show - Show a specific metric of a service \n update - update a specific metric of a service \n  delete - Delete a metric of a service")
    .option("-s, --service <service_id>","Specify service id")
    .option("-m, --metric <metric_name>","Metric name")
    .option("-c, --metricID <metric_id>","Metric ID")
    .option("-u, --unit <name>", "unit name")
    .action(function(command,options){
     program.isConfigured();
     program.require(options.service, "Service ID")

     switch (command) {
         case "create":
           program.require(options.metric,"Metric name is required");

           metrics.createMetric(options.service, options.metric, options.unit).then(function(result){
             var msg = "Metric with name "+options.metric.inverse+" on service "+options.service.inverse+" created."
             program.print({message:msg, type:"success"});
           });
           break;
         case "list":
           metrics.listMetrics(options.service).then(function(result){
             var msg = "There are "+result.length+" metrics for this service.\n"
             program.print({message:msg, type:"success", table: result, key:"metric"});
           });
           break;
         case "show":
           program.require(options.metricID,"Metric ID required");
           metrics.getMetricById(options.service,options.metricID).then(function(result){
             var msg = "Details about metric:\n"
             program.print({message:msg, type:"success", table: result});
           });
           break;
         case "update":
           program.require(options.metricID,"Metric ID required");

           metrics.updateMetric(options.service,options.metricID,options.metric,options.unit).then(function(result){
               var msg = "Metric with id "+options.metricID.inverse+" updated.\n"
               program.print({message:msg, type:"success", table: result});
           });
           break;
         case "delete":
           program.require(options.metricID,"Metric ID required");

           metrics.deleteMetric(options.service,options.metricID).then(function(result){
             if(result){
               var msg = "Metric id "+options.metricID.inverse+" has been deleted."
               program.print({message:msg, type:"success"});
             }
           });
           break;
         default:
           program.error({message:"Unknown command \""+command+"\""});
           process.exit(1)
     } //end switch
   }) //end of .action
}
