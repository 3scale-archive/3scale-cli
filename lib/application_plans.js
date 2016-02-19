var nconf = require("nconf");
var cli = require("./3scale-cli");
var config = require("./config");
var slugify = require("slugify");
var _ = require("underscore")
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
    var body = JSON.parse(r[0].body);
    if (res.statusCode >= 300) {
      cli.error({message:"ERROR encountered: " + JSON.stringify(body.errors)});
      throw new Error("Server responded with status code " + r[0].statusCode + " "+JSON.stringify(body.errors));
    } else {
      return body;
      // APPLICATION_PLAN_ID = data.application_plan.id;
      // cli.print({message: "Application plan with id "+ APPLICATION_PLAN_ID+" created on 3scale"});
    }
  });
};

exports.getPlan = function(service_id, plan_name){
  var url = config.API+"/services/"+service_id+"/application_plans.json";
  url += "?provider_key="+config.get("threescale:provider_key")
  var options ={
    method:'GET',
    url: url,
  };
  console.log(url);
  var response = request(options);
  return response.then(function (r) {
    var res  = r[0].req.res;
    var body = JSON.parse(r[0].body);
    if (res.statusCode >= 300) {
      cli.error({message:"ERROR encountered: " + JSON.stringify(body.errors)});
      throw new Error("Server responded with status code " + r[0].statusCode + " "+JSON.stringify(body.errors));
    } else {
      return _.first(_.filter(body.plans,function(num){ return num.application_plan.name == plan_name;})) || null;
      // APPLICATION_PLAN_ID = data.application_plan.id;
      // cli.print({message: "Application plan with id "+ APPLICATION_PLAN_ID+" created on 3scale"});
    }
  });
}
