var nconf = require("nconf");
var cli = require("./3scale-cli");
var config = require("./config");
var slugify = require("slugify");
var Q = require("q");
var request = Q.denodeify(require("request"));

exports.listMetrics = function(service_id){
  var url = config.API+"/services/"+service_id+"/metrics.json";
  // console.log(url);
  var options ={
    method:'GET',
    url: url,
    form:{
      "provider_key":config.get("threescale:provider_key"),
      "service_id":service_id,
    }
  };
    var response = request(options);

    return response.then(function (r) {
      var res  = r[0].req.res;
      var body = JSON.parse(res.body);
      if (res.statusCode >= 300) {
        cli.error({message:"ERROR encountered: " + body.error});
        throw new Error("Server responded with status code" + res[0].req.res.statusCode,body.errors);
      } else {
        return body;
      }
    });
};

exports.createMetric = function(service_id,friendly_name,unit){
  console.log("createMetric called")
  var url = config.API+"/services/"+service_id+"/metrics.json";

  var options = {
    url: url,
    method: 'POST',
    form:{
      "provider_key":config.get("threescale:provider_key"),
      "service_id":service_id,
      "friendly_name": friendly_name,
      "unit": unit || "hit"
    }
  };
  var response = request(options);

  return response.then(function (r) {
    var res  = r[0].req.res;
    var body = JSON.parse(res.body);
    // console.log(body);
    if (res.statusCode >= 300) {
      cli.error({message:"ERROR encountered: " + body.error});
      throw new Error("Server responded with status code" + res[0].req.res.statusCode,body.errors);
    } else {
      console.log("Metric with id "+body.metric.id+" created.");
      return body.metric.id;
    }
  });
};
