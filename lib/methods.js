var nconf = require("nconf");
var cli = require("./3scale-cli");
var config = require("./config");
var slugify = require("slugify");
var Q = require("q");
var request = Q.denodeify(require("request"));

exports.createMethod = function(service_id,metric_id,system_name,friendly_name, unit){
  var url = config.API+"/services/"+service_id+"/metrics/"+metric_id+"/methods.json";

  // var method_name = slugify(m.path.replace(/[/]/g,"_").substring(1)+"_"+m.method.toUpperCase(),"_");

  var options ={
    method: 'POST',
    url: url,
    form:{
      "provider_key": config.get("threescale:provider_key"),
      "service_id": service_id,
      "metric_id": metric_id,
      "friendly_name":friendly_name,
      "system_name":system_name,
      "unit":1 || unit
    }
  };
  var response = request(options);
  return response.then(function (r) {
    var res  = r[0].req.res;
    var body = JSON.parse(r[0].body);
    if (res.statusCode >= 300) {
      cli.error({message:"ERROR encountered on creating Method: " + JSON.stringify(body.errors)});
      throw new Error("Server responded with status code " + r[0].statusCode + " "+JSON.stringify(body.errors));
    } else {
      return body.method;
    }
  });
};
