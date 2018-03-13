var proxy = require("../lib/proxy");

module.exports = function proxyCommand(program) {
  program
    .command("proxy <cmd>")
    .description("\n  update - Update the proxy \n  show - Show proxy details")
    .option("-s, --service <service_id>","Specify service id")
    .option("-e, --endpoint <endpoint>","Specify endpoint")
    .option("-S, --sandbox <sandbox_endpoint>","Specify sandbox endpoint")
    .option("-b, --backend <api_backend>","Specify API backend")
    .option("-l, --credential <location>","Specify credential location (headers or query)", /^(headers|query)$/, "headers")
    .option("--auth-app-key <app_key>","Parameter/Header where App Key is expected")
    .option("--auth-app-id <app_id>","Parameter/Header where App ID is expected")
    .option("--auth-user-key <user_key>","Parameter/Header where User Key is expected")
    .option("--oidc-issuer-endpoint <oidc_issuer>","Location of your OpenID Provider")
    .action(function(command, options){
     program.isConfigured();

      switch (command) {
          case "update":
            program.require(options.service,"Service ID");
            /*program.require(options.endpoint,"Endpoint");
            program.require(options.sandbox,"Sandbox endpoint");
            program.require(options.backend,"API backend");*/

            proxy.updateProxy(options.service,
                              options.backend,
                              options.endpoint,
                              options.sandbox,
                              options.credential,
                              options.authAppKey,
                              options.authAppId,
                              options.authUserKey,
                              options.oidcIssuerEndpoint).then(function(result){
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
