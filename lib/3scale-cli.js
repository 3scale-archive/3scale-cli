(function() {
 var colors, pkg, print;
 colors = require("colors");
 var prettyjson = require('prettyjson');
 pkg = require("../package.json");
var _ = require("underscore");
var Table = require('easy-table');


exports.success = success = function(options){
  if (options && options.message && typeof options.message === "string") {
    var prompt = "["+"3scale-cli".white+"]";

    return console.log(prompt, options.message.toString().green);
  }
};

exports.error = error = function(options){
  if (options && options.message && typeof options.message === "string") {
    var prompt = "["+"3scale-cli".white+"]";
    if(options.command)
      return console.log(prompt, options.message.toString().red,options.command.toString().inverse);

    return console.log(prompt, options.message.toString().red);
  }
};

exports.warn = warn = function(options){
  if (options && options.message && typeof options.message === "string") {
    var prompt = "[ "+"3scale-cli".white+" ]";

    return console.log(prompt, options.message.toString().yellow);
  }
};

exports.info = info = function(options){
  if (options && options.message && typeof options.message === "string") {
    var prompt = "["+"3scale-cli".white+"]";

    return console.log(prompt, options.message.toString().cyan);
  }
};

 exports.print = print = function(options) {
     if (options && options.message) {
       var data ="";
       var msg = "";
        if(typeof options.message === "string"){
          msg = options.message.toString();
        }

        if(options.data){
          data = prettyjson.render(options.data)
        }

        if(options.table){
          var items = [];
          if(_.isArray(options.table)){ //array of objects
            _.each(options.table, function(item){ //flatten to an array without links
              var exclude = ["links"]
              if(_.isArray(options.excludes)){
                exclude.push(options.excludes)
              }

              items.push(_.omit(item[options.key],exclude))
            })
          }else{
            var exclude = ["links"]
            if(_.isArray(options.excludes)){
              exclude.push(options.excludes)
            }
            items.push(_.omit(options.table,exclude))
          }
          data = Table.print(items)
        }

        if(options.type == "success"){
          return console.log("[", "3scale-cli".white, "]", msg.green, data);
        }else if(options.type == "error"){
          return console.log("[", "3scale-cli".white, "]", msg.red, data);
        }else if(options.type == "info"){

        }else{
         return console.log("[", "3scale-cli".white, "]", msg.cyan, data);
        }
     } else {
         throw new Error("no message defined to print!");
     }
 }

}).call(this);
