var nconf = require("nconf");
var cli = require("./3scale-cli");
var config = require("./config");
var slugify = require("slugify");
var Q = require("q");
var request = Q.denodeify(require("request"));

exports.createMethod = function(service_id,metric_id,method_name, unit){
  console.log("createMethod called");
  var url = config.API+"/services/"+service_id+"/metrics/"+metric_id+"/methods.json";

  // var method_name = slugify(m.path.replace(/[/]/g,"_").substring(1)+"_"+m.method.toUpperCase(),"_");

  var options ={
    method: 'POST',
    url: url,
    form:{
      "provider_key":config.get("threescale:provider_key"),
      "service_id":service_id,
      "metric_id": metric_id,
      "friendly_name":method_name,
      "system_name":method_name,
      "unit":1 || unit
    }
  };
  var response = request(options);

  return response.then(function (r) {
    var res  = r[0].req.res;
    var body = JSON.parse(res.body);
    console.log(body);
    if (res.statusCode >= 300) {
      throw new Error("Server responded with status code" + res[0].req.res.statusCode,body.errors);
    } else {
      console.log(res.body);
    }
  });
};
