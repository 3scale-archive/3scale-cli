(function() {
 var colors, pkg, print;
 colors = require("colors");
 pkg = require("../package.json");

exports.success = success = function(options){
  if (options && options.message && typeof options.message                  === "string") {
    var prompt = "["+"3scale-cli".white+"]";

    return console.log(prompt, options.message.toString().green);
  }
};

exports.error = error = function(options){
  if (options && options.message && typeof options.message                  === "string") {
    var prompt = "["+"3scale-cli".white+"]";
    if(options.command)
      return console.log(prompt, options.message.toString().red,options.command.toString().inverse);

    return console.log(prompt, options.message.toString().red);
  }
};

exports.warn = warn = function(options){
  if (options && options.message && typeof options.message                  === "string") {
    var prompt = "[ "+"3scale-cli".white+" ]";

    return console.log(prompt, options.message.toString().yellow);
  }
};

exports.info = info = function(options){
  if (options && options.message && typeof options.message                  === "string") {
    var prompt = "["+"3scale-cli".white+"]";

    return console.log(prompt, options.message.toString().cyan);
  }
};

 exports.print = print = function(options) {
     if (options && options.message && typeof options.message                  === "string") {

        if(options.type == "success"){
          return console.log("[", "3scale-cli".white,   "]", options.message.toString().green,options.command.toString().inverse);
        }else if(options.type == "info"){

        }else{
         return console.log("[", "3scale-cli".white,   "]", options.message.toString().cyan);
        }
     } else {
         throw new Error("no message defined to print!");
     }
 }
 // exports.error = function(options){
 //   if (options && options.error) {
 //       return console.log("[", "3scale-cli".white,   "]", options.error.toString().red);
 //   } else {
 //       throw new Error("no message defined to print!");
 //   }
 // };
}).call(this);
