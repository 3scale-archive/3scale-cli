var activedocs = require("../lib/activedocs");

module.exports = function activeDocsCommand(program) {
  program
    .command("activedocs <command>")
    .usage("<command> [options]")
    .description("\n  create - Create a new ActiveDocs \n  list - List all ActiveDocs \n  update - Update a specific ActiveDocs spec \n  delete - Delete an ActiveDocs spec ")
    .option("-i, --docs <docs_id>","Specify activedocs id")
    .option("-f, --file <path>", "Specify path to an API description file")
    .option("-s, --systemName <system_name>","Specify system name")
    .action(function(command,options){
      switch (command) {
        case "create":
          program.require(options.file,"Swagger spec file required");
          activedocs.createActiveDocs(options.file, options.systemName).then(function(result){
            var msg = "Activedocs "+result.name.inverse +" created. \n"
            program.print({message:msg, type:"success", table: result, key:"api_doc","excludes":["body"]});
          })
          break;
        case "list":
          activedocs.listActiveDocs().then(function(result){
            var msg = "There are "+result.length+" activedocs spec on your account.\n"
            program.print({message:msg, type:"success", table: result, key:"api_doc","excludes":["body"]});
          })
          break;
        case "update":
          program.require(options.docs,"ActiveDocs ID required");
          program.require(options.file,"Swagger spec file required");
          activedocs.updateActiveDocs(options.file, options.docs).then(function(result){
            var msg = "ActiveDocs spec updated on your account.\n"
            program.print({message:msg, type:"success", table: result, key:"api_doc","excludes":["body"]});
          })
          break;
            break;
        case "delete":
          program.require(options.docs,"ActiveDocs ID required");

          activedocs.deleteActiveDocs(options.docs).then(function(result){
            if(result){
              var msg = "ActiveDocs id "+options.docs.inverse+" has been deleted."
              program.print({message:msg, type:"success"});
            }
          })
          break;
        default:
        //display help if command not formatted properly
          program.error({message:"Unknown command \""+command+"\""});
          this.outputHelp()
          process.exit(1)
      }
    });
}
