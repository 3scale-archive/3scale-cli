(function() {
 var colors, pkg, print;
 colors = require("colors");
 var prettyjson = require('prettyjson');
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
     if (options && options.message) {
       var data ="";
       var msg = "";
        if(typeof options.message === "string"){
          msg = options.message.toString()+"\n"
        }

        if(options.data){
          data = prettyjson.render(options.data)
        }

        if(options.type == "success"){
          return console.log("[", "3scale-cli".white,   "]", msg.green, data);
        }else if(options.type == "info"){

        }else{
         return console.log("[", "3scale-cli".white,   "]", msg.cyan, data);
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
