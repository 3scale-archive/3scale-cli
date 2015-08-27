var nconf = require("nconf");
var cli = require("./3scale-cli");
var config = require("./config");
var slugify = require("slugify");
var Q = require("q");
var request = Q.denodeify(require("request"));

exports.createService = function(name){
    var url = config.API+"/services.json";
    var options ={
      method:'POST',
      url: url,
      form:{
        "provider_key":config.provider_key,
        "name":name+Math.floor((Math.random() * 50) + 10), //TODO get rid of random
        "system_name":slugify(name,"_")
      }
    };
    var response = request(options);

    return response.then(function (r) {
      var res  = r[0].req.res;
      var body = JSON.parse(res.body);
      if (res.statusCode >= 300) {
        throw new Error("Server responded with status code " + res[0].req.res.statusCode,body.errors);
      } else {
        config.add("threescale:service_id",body.service.id);
        // console.log("service created",body);
        return body;//assuming tapes are strings and not binary data
      }
    });

};
