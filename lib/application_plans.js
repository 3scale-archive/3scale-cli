var nconf = require("nconf");
var cli = require("./3scale-cli");
var config = require("./config");
var slug = require("slug");
var _ = require("underscore")
var Q = require("q");
var request = Q.denodeify(require("request"));

var limits = require("./limits.js")

exports.createApplicationPlan = function(service_id,name){
  if(!name)
    name = "default";

  var url = config.API+"/services/"+service_id+"/application_plans.json";
  var options ={
    method:'POST',
    url: url,
    form:{
      "access_token": config.access_token,
      "name": name || "default",
      "system_name": slug(name,"_") || "default",
      "state":"published"
    }
  };
  var response = request(options);
  return response.then(function (r) {
    var res  = r[0].req.res;
    var body = JSON.parse(r[0].body);
    if (res.statusCode >= 300) {
      cli.error({message:"ERROR encountered creating Application Plan:  " + JSON.stringify(body.errors || body.status)});
      throw new Error("Server responded with status code " + r[0].statusCode + " "+JSON.stringify(body.errors || body.status));
    } else {
      return body.application_plan;
    }
  });
};

exports.getApplicationPlanById = function(service_id, plan_id){
  var url = config.API+"/services/"+service_id+"/application_plans/"+plan_id+".json";
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
      cli.error({message:"ERROR encountered: " + JSON.stringify(body.errors || body.status)});
      throw new Error("Server responded with status code " + r[0].statusCode + " "+JSON.stringify(body.errors || body.status));
    } else {
      return body.application_plan
    }
  });
}

exports.getApplicationPlanByName = function(service_id, plan_name){
  var url = config.API+"/services/"+service_id+"/application_plans.json";

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
      cli.error({message:"ERROR encountered: " + JSON.stringify(body.error || body.status)});
      throw new Error("Server responded with status code " + r[0].statusCode + " "+JSON.stringify(body.error || body.status));
    } else {
      var plan = _.first(_.filter(body.plans,function(num){ return num.application_plan.name == plan_name;}))
      if(_.isUndefined(plan)){
        return null
      }else{
        return plan.application_plan
      }
    }
  });
}

exports.listApplicationPlans = function(service_id){
  var url = config.API+"/services/"+service_id+"/application_plans.json";

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
      cli.error({message:"ERROR encountered: " + JSON.stringify(body.error || body.status)});
      throw new Error("Server responded with status code " + r[0].statusCode + " "+JSON.stringify(body.error || body.status));
    } else {
      return body.plans
    }
  });
}


exports.deleteApplicationPlanById = function(service_id, plan_id){
  var url = config.API+"/services/"+service_id+"/application_plans/"+plan_id+".json";

  var options ={
    method: 'DELETE',
    url: url,
    form:{
      "access_token": config.access_token
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

exports.deleteApplicationPlanByName = function(service_id, plan_name){
  var url = config.API+"/services/"+service_id+"/application_plans.json";

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
      cli.error({message:"ERROR encountered: " + JSON.stringify(body.error || body.status)});
      throw new Error("Server responded with status code " + r[0].statusCode + " "+JSON.stringify(body.error || body.status));
    } else {
      var plan = _.first(_.filter(body.plans,function(num){ return num.application_plan.name == plan_name;}))
      if(_.isUndefined(plan)){
        return null
      }else{
        return plan.application_plan
      }
    }
  });
}


exports.copyApplicationPlan = function(service_id,plan_id){
  var new_plan={}
  var that = this

  //Find Application Plan
  return this.getApplicationPlanById(service_id,plan_id).then(function(plan_details){
    //Create a new plan
    return that.createApplicationPlan(service_id, plan_details.name+" copy"+Math.floor((Math.random() * 50) + 10))
  }).then(function(plan){
    new_plan = plan
    var msg = "Application plan named "+plan.name.inverse+" with id "+ plan.id.toString().inverse+" created on 3scale"
    cli.print({message:msg, type:"success"});
    return true
  }).then(function(){
    //Get all the limits of original plan
    return limits.getLimitsByApplicationPlanId(plan_id)
  }).then(function(limitsArr){
    //Add limits to new plan
    var promisesArr = [];
    limitsArr.forEach(function(limit){
      var l = limit.limit
      promisesArr.push(limits.createLimitPromise(new_plan.id,l.metric_id, l.period, l.value))
    })
    return promisesArr
  })
  .then(function(limitsPromiseArr){
    return Q.all(limitsPromiseArr)
  }).then(function(results){
    return results
  })
}
