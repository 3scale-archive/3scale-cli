var applications = require("../lib/applications");

if (exports.allowinsecure == 'Y' || exports.allowinsecure == 'y'){
  	process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}


module.exports = function applicationsCommand(program) {
  program
    .command("applications <cmd>")
    .description("\n  create - Create an application\n  list - List all applications \n  show - Show a specific application\n  update - Update a specific application\n  delete - Delete a specific application\n" +
    "  suspend - Suspend an application (change the state to suspended)\n  resume - Resume a suspended application")
    .option("-a, --account <account_id>","Specify account id")
    .option("-i, --id <application_id>","Specify application id")
    .option("-p, --plan <plan_id>", "Specify application plain id")
    .option("-n, --name <name>", "Specify application name")
    .option("-d, --description <description>", "Specify application description")
    .option("-k, --key <user_key>", "Specify the user-key")
    .action(function(command, options){
     program.isConfigured();

      switch (command) {
          case "list":
            program.require(options.account,"Account ID");
            applications.listApplications(options.account).then(function(result){
              var msg = "There are "+result.length+" applications.\n"
              program.print({message:msg, type:"success", table: result, key: "application"});
            });
            break;
          case "show":
            program.require(options.account,"Account ID");
            program.require(options.id,"Application ID");
            applications.showApplication(options.account, options.id).then(function(result){
              var msg = "Details about application:\n"
              program.print({message:msg, type:"success", data: result});
            });
            break;
          case "create":
            program.require(options.account, "Account ID");
            program.require(options.plan, "Plan ID");
            program.require(options.name, "Name");
            program.require(options.description, "Description");
            
            applications.createApplication(options.account, options.plan, options.name, options.description, options.key).then(function(result){
              var msg = "Application "+options.name+" created.\n"
              program.print({message:msg, type:"success", data: result});
            });
            break;
          case "update":
            program.require(options.account,"Account ID");
            program.require(options.id,"Application ID");
            
            applications.updateApplication(options.account, options.id, options.name, options.description).then(function(result){
              var msg = "Application updated:\n"
              program.print({message:msg, type:"success", data: result});
            });
            break;
          case "delete":
            program.require(options.account,"Account ID");
            program.require(options.id,"Application ID");
            
            applications.deleteApplication(options.account, options.id).then(function(result){
              var msg = "Application deleted:\n"
              program.print({message:msg, type:"success", data: result});
            });
            break;
          case "suspend":
            program.require(options.account,"Account ID");
            program.require(options.id,"Application ID");

            applications.suspendApplication(options.account, options.id).then(function(result){
              var msg = "Application deleted:\n"
              program.print({message:msg, type:"success", data: result});
            });
            break;
          case "resume":
            program.require(options.account,"Account ID");
            program.require(options.id,"Application ID");

            applications.resumeApplication(options.account, options.id).then(function(result){
              var msg = "Application deleted:\n"
              program.print({message:msg, type:"success", data: result});
            });
            break;
          default:
            program.error({message:"Unknown command \""+command+"\""});
            process.exit(1)
      } //end switch
    });
}
