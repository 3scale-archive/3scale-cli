var services = require("../lib/services");

module.exports = function servicesCommand(program) {
  program
    .command("services <cmd>")
    .description("\n  create - Create a new service \n  list - List all services \n  show - Show a specific service \n  update - update a specific a service")
    .option("-s, --service <service_id>","Specify service id")
    .option("-c, --serviceName <service_name>","Specify service name")
    .action(function(command, options){
     program.isConfigured();

      switch (command) {
          case "create":
            program.require(options.serviceName,"Service name");
            services.createService(options.serviceName).then(function(result){
              var msg = "Service with name "+options.serviceName.inverse+" created."
              program.print({message:msg, type:"success"});
            });
            break;
          case "list":
            services.listServices().then(function(result){
              var msg = "There are "+result.length+" services on your account.\n"
              program.print({message:msg, type:"success", table: result, key:"service"});
            });
            break;
          case "show":
            program.require(options.service,"Service ID required");
            services.getServiceByID(options.service).then(function(result){
              var msg = "Details about service:\n"
              program.print({message:msg, type:"success", table: result});
            });
            break;
          case "update":
            program.require(options.service,"Service ID required");

            services.updateService(options.service,options.serviceName).then(function(result){
                var msg = "Service with id "+options.service.inverse+" updated.\n"
                program.print({message:msg, type:"success", table: result});
            });
            break;
          default:
            program.error({message:"Unknown command \""+command+"\""});
            process.exit(1)
      } //end switch

      // services.createService(command.create);
    });
}
