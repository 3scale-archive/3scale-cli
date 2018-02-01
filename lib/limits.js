var nconf = require("nconf");
var cli = require("./3scale-cli");
var config = require("./config");
var _ = require("underscore")
var Q = require("q");
var request = Q.denodeify(require("request"));

exports.createLimit = function(plan_id, metric_id, period, value){
  var url = config.API+"/application_plans/"+plan_id+"/metrics/"+metric_id+"/limits.json";

  var options ={
    method: 'POST',
    url: url,
    form:{
      "access_token": config.access_token,
      "period": period,
      "value": value
    }
  };

  var response = request(options);
  return response.then(function (r) {
    var res  = r[0].req.res;
    var body = JSON.parse(r[0].body);
    if (res.statusCode >= 300) {
      cli.error({message:"ERROR encountered on creating Limit: "+r[0].statusCode+" "+ JSON.stringify(body.errors || body.status)});
      throw new Error("Server responded with status code " + r[0].statusCode + " "+JSON.stringify(body.errors || body.status));
    } else {
      return body.limit;
    }
  });
}


exports.updateLimit = function(plan_id, metric_id, limit_id, period, value){
  var url = config.API+"/application_plans/"+plan_id+"/metrics/"+metric_id+"/limits/"+limit_id+".json";

  var options ={
    method: 'PUT',
    url: url,
    form:{
      "access_token": config.access_token,
      "period": period,
      "value": value
    }
  };
  var response = request(options);
  return response.then(function (r) {
    var res  = r[0].req.res;
    var body = JSON.parse(r[0].body);
    if (res.statusCode >= 300) {
      cli.error({message:"ERROR encountered on updating Limit: "+r[0].statusCode+" "+ JSON.stringify(body.errors || body.status)});
      throw new Error("Server responded with status code " + r[0].statusCode + " "+JSON.stringify(body.errors || body.status));
    } else {
      return body.limit;
    }
  });
}

exports.getLimitsByApplicationPlanId = function(plan_id){
  var url = config.API+"/application_plans/"+plan_id+"/limits.json";

  var options ={
    method: 'GET',
    url: url,
    form:{
      "access_token": config.access_token
    }
  };

  var response = request(options);
  return response.then(function (r) {
    var res  = r[0].req.res;
    var body = JSON.parse(r[0].body);
    if (res.statusCode >= 300) {
      cli.error({message:"ERROR encountered on creating Method: "+r[0].statusCode+" "+ JSON.stringify(body.errors || body.status)});
      throw new Error("Server responded with status code " + r[0].statusCode + " "+JSON.stringify(body.errors || body.status));
    } else {
      return body.limits;
    }
  });
}

exports.deleteLimit = function(application_plan_id,metric_id,limit_id){
  var url = config.API+"/application_plans/"+application_plan_id+"/metrics/"+metric_id+"/limits/"+limit_id+".json";

  var options ={
    method: 'DELETE',
    url: url,
    form:{
      "access_token": config.access_token,
    }
  };

  var response = request(options);
  return response.then(function (r) {
    var res  = r[0].req.res;
    if(r[0].body == ''){ //DELETE has no payload unless error encountered
      return true
    }else{
      var body = JSON.parse(r[0].body);
      cli.error({message:"ERROR encountered: " + JSON.stringify(body.error || body.status)});
      throw new Error("Server responded with status code " + r[0].statusCode + " "+JSON.stringify(body.error || body.status));
    }
  })
}


// A sample promise which takes an argument
exports.createLimitPromise = function (plan_id, metric_id, period, value) {
    return this.createLimit(plan_id, metric_id, period, value).then(function(result){
      cli.print({message:"Limit of " + result.value.toString().inverse+" per "+result.period.inverse+" created under "+plan_id.toString().inverse+" Application Plan."});
      return result
    });
};
