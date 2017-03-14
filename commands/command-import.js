var swagger = require("../lib/swagger");
var raml = require("../lib/raml");

module.exports = function importCommand(program) {
  program
     .command("import <cmd>")
     .description("Import a swagger spec into 3scale")
     .option("-f, --file <path>", "Specify path to an API description file")
     .option("-p, --pattern <pattern_type>","Pattern for method names")
     .option("-s, --service <service_id>","Specify service id")
     .option("-a, --appplan <applan_name>","Specify Application Plan name")
     .action(function(command,options){
       program.isConfigured()
       program.require(options.file, "File path is required")

       switch (command) {
          case "swagger":
            swagger.import(options.file, options.service, options.appplan, options.pattern)
            break;
          case "raml":
            raml.import(options.file, options.service, options.appplan, options.pattern)
            break;
          default:
            program.error({message:"Unknown command \""+command+"\""});
            process.exit(1)
        }
      //  if(command.type && command.type.toLowerCase() === "raml"){
      //    raml.import(command.file, command.service || null, command.appplan || null, command.pattern || null);
      //  }else{
      //    swagger.import(command.file, command.service || null, command.appplan || null, command.pattern || null);
      //  }
     });
}
