var inquirer = require("inquirer");
var fs    = require("fs");
var nconf = require("nconf");
var cli = require("./3scale-cli");
var path = require('path');
var osHomedir = require('os-homedir');
var mkdirp = require('mkdirp');

nconf.file({ file: osHomedir()+"/.3scale/credentials.json" });
nconf.load();

exports.configure = function(){
  mkdirp(osHomedir()+"/.3scale/", function (err) {  //check if ~/.3scale exists
      if (err){ console.error(err)
      }else {
        cli.print({message:"Please answer the following questions to configure 3scale cli."});
        var questions = [
          {
            type: 'input',
            name: 'threescale_provider_key',
            message: '3scale provider key',
            default: nconf.get("threescale:provider_key") || 'ex: 1234567890abc',
          },
          {
            type: 'input',
            name: 'threescale_id',
            message: '3scale id',
            default: nconf.get("threescale:id") ||  'ex: awesome-api'
          }
        ];
        inquirer.prompt(questions, function(res) {
          nconf.set("threescale:id", res.threescale_id);
          nconf.set("threescale:provider_key", res.threescale_provider_key);
          nconf.save(function (err) {
            fs.readFile(osHomedir()+"/.3scale/credentials.json", function (err, data) {
              // console.dir(JSON.parse(data.toString()))
              cli.success({message:"3scale cli tool configured"});
            });
          });
        });
      }
  });
};

exports.getThreeScaleConfig = function(){
  return nconf.get("threescale");
};

exports.add = function(key,value){
  nconf.set(key, value);
  nconf.save();
};

exports.get = function(key){
  return nconf.get(key);
};


exports.provider_key = nconf.get("threescale:provider_key");
exports.id = nconf.get("threescale:id");
exports.API = "https://"+nconf.get("threescale:id")+"-admin.3scale.net/admin/api";
