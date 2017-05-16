var nconf = require("nconf");
var cli = require("./3scale-cli");
var config = require("./config");
var Q = require("q");
var request = Q.denodeify(require("request"));
var _ = require("underscore")

exports.listMetrics = function(service_id){
  var url = config.API+"/services/"+service_id+"/metrics.json";
  // console.log(url);
  var options ={
    method:'GET',
    url: url,
    form:{
      "access_token": config.access_token,
      "service_id":service_id,
    }
  };
    var response = request(options);

    return response.then(function (r) {
      var res  = r[0].req.res;
      var body = JSON.parse(res.body);
      if (res.statusCode >= 300) {
        cli.error({message:"ERROR encountered: " + JSON.stringify(body.error || body.status)});
        throw new Error("Server responded with status code " + r[0].statusCode + " "+JSON.stringify(body.error || body.status));
      } else {
        return body.metrics;
      }
    });
};

exports.createMetric = function(service_id,friendly_name,unit){
  var url = config.API+"/services/"+service_id+"/metrics.json";

  var options = {
    url: url,
    method: 'POST',
    form:{
      "access_token": config.access_token,
      "service_id":service_id,
      "friendly_name": friendly_name,
      "unit": unit || "hit"
    }
  };
  var response = request(options);

  return response.then(function (r) {
    var res  = r[0].req.res;
    var body = JSON.parse(res.body);
    if (res.statusCode >= 300) {
      cli.error({message:"ERROR encountered: " + JSON.stringify(body.error || body.status)});
      throw new Error("Server responded with status code " + r[0].statusCode + " "+JSON.stringify(body.error || body.status));
    } else {
      return body.metric;
    }
  });
};

exports.getMetricById = function (service_id, metric_id){
  var url = config.API+"/services/"+service_id+"/metrics/"+metric_id+".json";

  var options = {
    url: url,
    method: 'GET',
    form:{
      "access_token": config.access_token
    }
  };
  var response = request(options);

  return response.then(function (r) {
    var res  = r[0].req.res;
    var body = JSON.parse(res.body);
    if (res.statusCode >= 300) {
      cli.error({message:"ERROR encountered: " + JSON.stringify(body.error || body.status)});
      throw new Error("Server responded with status code " + r[0].statusCode + " "+JSON.stringify(body.error || body.status));
    } else {
      return body.metric;
    }
  });
}

exports.updateMetric = function(service_id, metric_id, friendly_name, unit){
  var url = config.API+"/services/"+service_id+"/metrics/"+metric_id+".json";

  var options = {
    url: url,
    method: 'PUT',
    form:{
      "access_token": config.access_token,
      "service_id":service_id,
      "id": metric_id,
    }
  };

  if(friendly_name)
    options.form["friendly_name"]=friendly_name
  if(unit)
    options.form["unit"]=unit

  var response = request(options);
  return response.then(function (r) {
    var res  = r[0].req.res;
    var body = JSON.parse(res.body);
    if (res.statusCode >= 300) {
      cli.error({message:"ERROR encountered: " + JSON.stringify(body.error || body.status)});
      throw new Error("Server responded with status code " + r[0].statusCode + " "+JSON.stringify(body.error || body.status));
    } else {
      return body.metric;
    }
  });
}

exports.deleteMetric = function(service_id, metric_id){
  var url = config.API+"/services/"+service_id+"/metrics/"+metric_id+".json";

  var options = {
    url: url,
    method: 'DELETE',
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

exports.getHitsMetric = function(service_id){
  return this.listMetrics(service_id).then(function(metrics){
    return _.first(_.filter(metrics,function(num){return num.metric.system_name==="hits"})).metric
  })
}
