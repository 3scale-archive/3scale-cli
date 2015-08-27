var nconf = require("nconf");
var cli = require("./3scale-cli");
var config = require("./config");
var slugify = require("slugify");
var Q = require("q");
var request = Q.denodeify(require("request"));

exports.createAppPlan = function(service_id,name){
  if(!name)
    name = "default";

  var url = config.API+"/services/"+service_id+"/application_plans.json";
  var options ={
    method:'POST',
    url: url,
    form:{
      "provider_key":config.get("threescale:provider_key"),
      "name": name || "default",
      "system_name": slugify(name,"_") || "default",
      "state":"published"
    }
  };
  var response = request(options);
  return response.then(function (r) {
    var res  = r[0].req.res;
    var body = JSON.parse(res.body);
    if (res.statusCode >= 300) {
      throw new Error("Server responded with status code " + res[0].req.res.statusCode,body.errors);
    } else {
      return body;
      // APPLICATION_PLAN_ID = data.application_plan.id;
      // cli.print({message: "Application plan with id "+ APPLICATION_PLAN_ID+" created on 3scale"});
    }
  });
};
