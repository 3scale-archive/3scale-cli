var activedocs = require("../lib/activedocs");

module.exports = function activeDocsCommand(program) {
  program
    .command("docs <cmd>")
    .description("\n  create - Create a new method \n  list - List all methods of a service \n  show - Show a specific method of a service \n update - update a specific method of a service \n delete - Delete a method of a service")
    .option("-a, --docs <docs_id>","Specify activedocs id")
    .action(function(command,options){
      switch (command) {
        case "create":
            break;
        case "list":
            activedocs.listActiveDocs().then(function(result){
              var msg = "There are "+result.length+" activedocs spec on your account.\n"
              program.print({message:msg, type:"success", table: result, key:"api_doc","excludes":["body"]});
            })
            break;
        case "show":
            break;
        case "delete":
            break;
        default:
          program.error({message:"Unknown command \""+command+"\""});
          process.exit(1)
      }
    });
}
