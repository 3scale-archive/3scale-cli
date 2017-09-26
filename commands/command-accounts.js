var accounts = require("../lib/accounts");

module.exports = function accountsCommand(program) {
  program
    .command("accounts <cmd>")
    .description("\n  list - List all accounts \n  show - Show a specific account")
    .option("-i, --id <account_id>","Specify account id")
    .action(function(command, options){
     program.isConfigured();

      switch (command) {
          case "list":
            accounts.listAccounts().then(function(result){
              var msg = "There are "+result.length+" accounts.\n"
              program.print({message:msg, type:"success", table: result, key: "account"});
            });
            break;
          case "show":
            program.require(options.id,"Account ID");
            accounts.showAccount(options.id).then(function(result){
              var msg = "Details about account:\n"
              program.print({message:msg, type:"success", table: result});
            });
            break;
          default:
            program.error({message:"Unknown command \""+command+"\""});
            process.exit(1)
      } //end switch
    });
}
