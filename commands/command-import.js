var swagger = require("../lib/swagger");
var raml = require("../lib/raml");

module.exports = function importCommand(program) {
  program
     .command("import <cmd>")
     .description("Import a swagger spec into 3scale")
     .option("-f, --file <path>", "Specify path to an API description file")
     .option("-p, --pattern <pattern_type>","Pattern for method names")
     .option("-s, --service <service_id>","Specify service id")
     .option("-m, --allmethods <methods>", "If true imports all the methods")
     .option("-a, --appplan <applan_name>","Specify Application Plan name")
     .action(function(command,options){
       program.isConfigured()
       program.require(options.file, "File path is required")

       //error when pattern not passed in double quotes
       //check if '{' is in the string, if not display error
       if(options.pattern && options.pattern.indexOf('{')===-1){
         program.error({message:"The pattern parameter should be passed using double quotes. Example: -p \"{method}_{path}\""});
         process.exit(1)
       }
       
       switch (command) {
          case "swagger":
            swagger.import(options.file, options.service, options.appplan, options.pattern, (options.allmethods === "true"))
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
