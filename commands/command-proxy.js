var proxy = require("../lib/proxy");

if (exports.allowinsecure == 'Y' || exports.allowinsecure == 'y'){
  	process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}


module.exports = function proxyCommand(program) {
  program
    .command("proxy <cmd>")
    .description("\n  update - Update the proxy \n  show - Show proxy details")
    .option("-s, --service <service_id>","Specify service id")
    .option("-e, --endpoint <endpoint>","Specify endpoint")
    .option("-S, --sandbox <sandbox_endpoint>","Specify sandbox endpoint")
    .option("-b, --backend <api_backend>","Specify API backend")
    .action(function(command, options){
     program.isConfigured();

      switch (command) {
          case "update":
            program.require(options.service,"Service ID");
            program.require(options.endpoint,"Endpoint");
            program.require(options.sandbox,"Sandbox endpoint");
            program.require(options.backend,"API backend");
            program.print({message: "message", data: options.sandbox});
            proxy.updateProxy(options.service, options.backend, options.endpoint, options.sandbox, "headers").then(function(result){
              var msg = "Proxy for service ID "+options.service+" updated.\n"
              program.print({message:msg, type:"success", data: result});
            });
            break;
          case "show":
            program.require(options.service,"Service ID");
            proxy.showProxy(options.service).then(function(result){
              var msg = "Details about proxy:\n"
              program.print({message:msg, type:"success", data: result});
            });
            break;
          default:
            program.error({message:"Unknown command \""+command+"\""});
            process.exit(1)
      } //end switch
    });
}
