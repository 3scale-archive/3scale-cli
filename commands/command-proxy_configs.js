var proxy = require("../lib/proxy_configs");

module.exports = function proxyConfigsCommand(program) {
  program
    .command("proxy-configs <cmd>")
    .description("\n  list - List all proxy configs \n  show - Show a specific proxy config\n  promote - Promote a proxy config from 'sandbox' to 'production' environment")
    .option("-s, --service <service_id>","Specify service id")
    .option("-e, --environment <environment>","Specify environment <sandbox,production>")
    .option("-c, --config_version <version>","Specify config version")
    .action(function(command, options){
     program.isConfigured();

      switch (command) {
          case "list":
            program.require(options.service,"Service ID");
            program.require(options.environment,"Environment");

            proxy.listProxyConfigs(options.service, options.environment).then(function(result){
              var msg = "List of Proxy Configs.\n"
              program.print({message:msg, type:"success", table: result, key: "proxy_config", excludes: ["content"]});
            });
            break;
          case "show":
            program.require(options.service,"Service ID");
            program.require(options.environment,"Environment");
            program.require(options.config_version,"Config version");

            proxy.showProxyConfig(options.service, options.environment, options.config_version).then(function(result){
              var msg = "Show Proxy Config details.\n"
              program.print({message:msg, type:"success", data: result});
            });
            break;
          case "promote":
            program.require(options.service,"Service ID");
            program.require(options.config_version,"Config version");

            proxy.promoteProxyConfig(options.service, "sandbox", options.config_version, "production").then(function(result){
              var msg = "Promote Proxy Config details.\n"
              program.print({message:msg, type:"success", data: result});
            });
            break;
          default:
            program.error({message:"Unknown command \""+command+"\""});
            process.exit(1)
      } //end switch
    });
}
