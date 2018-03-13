var inquirer = require("inquirer");
var fs    = require("fs");
var nconf = require("nconf");
var cli = require("./3scale-cli");
var path = require('path');
var osHomedir = require('os-homedir');
var mkdirp = require('mkdirp');
var services = require("./services");
var _ = require("underscore");

nconf.file({ file: osHomedir()+"/.3scale/credentials.json" });
nconf.load();

cli.debug({name: '3scale-cli:config', msg: 'conf file loaded.'})

exports.configure = function(){
  mkdirp(osHomedir()+"/.3scale/", function (err) {  //check if ~/.3scale exists
      if (err){
        console.error(err)
        cli.debug({name: '3scale-cli:config', msg: '~/.3scale folder does not exist.'})
      }else {
        cli.print({message:"Please answer the following questions to configure 3scale cli."});
        var questions = [
          {
            type: 'input',
            name: 'threescale_access_token',
            message: '3scale access token',
            default: nconf.get("threescale:access_token") || 'ex: 1234567890abc',
          },
          {
            type: 'input',
            name: 'threescale_id',
            message: '3scale id',
            default: nconf.get("threescale:id") ||  'ex: awesome-api'
          },
          {
            type: 'input',
            name: 'threescale_wildcard',
            message: '3scale wildcard domain',
            default: nconf.get("threescale:wildcard") ||  'ex: 3scale.net'
          }
        ];
        inquirer.prompt(questions).then(function(res){
          nconf.set("threescale:id", res.threescale_id);
          nconf.set("threescale:access_token", res.threescale_access_token);
          nconf.set("threescale:wildcard", res.threescale_wildcard || "3scale.net");
          nconf.save(function (err) {
            fs.readFile(osHomedir()+"/.3scale/credentials.json", function (err, data) {
              //update values
              exports.access_token = nconf.get("threescale:access_token");
              exports.id = nconf.get("threescale:id");
              exports.wildcard = nconf.get("threescale:wildcard");
              exports.API = "https://"+nconf.get("threescale:id")+"-admin."+nconf.get("threescale:wildcard")+"/admin/api";

              cli.debug({name: '3scale-cli:config', msg: 'conf file saved.'})
              cli.debug({name: '3scale-cli:config', msg: 'Values are: token:'+nconf.get("threescale:access_token")+' id:'+nconf.get("threescale:id")+ ' wildcard:'+nconf.get("threescale:wildcard")})

              //check if configuration is valid
              testConfig(function(e, valid){
                if(valid){
                  cli.success({message:"3scale cli tool configured"});
                }
              });
            });
          })
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

// Make a test call to services endpoint to check if credentials are valid
var testConfig = function(callback){
  services.listServices().then(function(result){
    cli.debug({name: '3scale-cli:config', msg: 'Test Config result (show services): %o', data: result})
    if(typeof result.errno != "undefined" || !_.isArray(result)){
      cli.error({message:"ERROR encountered: Your credentials are invalid. Check them and try again."});
      callback( new Error('Credentials invalid'));
    }else{
      callback(null, true)
    }
  });
}

exports.access_token = nconf.get("threescale:access_token");
exports.id = nconf.get("threescale:id");
exports.wildcard = nconf.get("threescale:wildcard");
exports.API = "https://"+nconf.get("threescale:id")+"-admin."+nconf.get("threescale:wildcard")+"/admin/api";
