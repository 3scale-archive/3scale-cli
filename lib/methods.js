var nconf = require("nconf");
var cli = require("./3scale-cli");
var config = require("./config");
var slug = require("slug");
var Q = require("q");
var request = Q.denodeify(require("request"));

exports.createMethod = function(service_id,metric_id,friendly_name, unit){
  var url = config.API+"/services/"+service_id+"/metrics/"+metric_id+"/methods.json";

  var options ={
    method: 'POST',
    url: url,
    form:{
      "provider_key": config.get("threescale:provider_key"),
      "service_id": service_id,
      "metric_id": metric_id,
      "friendly_name": friendly_name || "default_method",
      "system_name": slug(friendly_name) || "default_method",
      "unit": 1 || unit
    }
  };

  var response = request(options);
  return response.then(function (r) {
    var res  = r[0].req.res;
    var body = JSON.parse(r[0].body);
    if (res.statusCode >= 300) {
      cli.error({message:"ERROR encountered on creating Method: "+r[0].statusCode+" "+ JSON.stringify(body.error || body.status)});
      throw new Error("Server responded with status code " + r[0].statusCode + " "+JSON.stringify(body.error || body.status));
    } else {
      return body.method;
    }
  });
};

exports.listMethods = function(service_id, metric_id){
  var url = config.API+"/services/"+service_id+"/metrics/"+metric_id+"/methods.json";

  var options ={
    method: 'GET',
    url: url,
    form:{
      "provider_key": config.get("threescale:provider_key")
    }
  };

  var response = request(options);
  return response.then(function (r) {
    var res  = r[0].req.res;
    var body = JSON.parse(r[0].body);
    if (res.statusCode >= 300) {
      cli.error({message:"ERROR encountered on creating Method: " + JSON.stringify(body.error || body.status)});
      throw new Error("Server responded with status code " + r[0].statusCode + " "+JSON.stringify(body.error || body.status));
    } else {
      return body.methods;
    }
  });
}

exports.getMethodById = function(service_id, metric_id, method_id){
  var url = config.API+"/services/"+service_id+"/metrics/"+metric_id+"/methods/"+method_id+".json";

  var options ={
    method: 'GET',
    url: url,
    form:{
      "provider_key": config.get("threescale:provider_key")
    }
  };

  var response = request(options);
  return response.then(function (r) {
    var res  = r[0].req.res;
    var body = JSON.parse(r[0].body);
    if (res.statusCode >= 300) {
      cli.error({message:"ERROR encountered on retrieving Method: " + JSON.stringify(body.error || body.status)});
      throw new Error("Server responded with status code " + r[0].statusCode + " "+JSON.stringify(body.error || body.status));
    } else {
      return body.method;
    }
  });
}

exports.updateMethod = function(service_id, metric_id, method_id, friendly_name, unit){
  var url = config.API+"/services/"+service_id+"/metrics/"+metric_id+"/methods/"+method_id+".json";

  var options ={
    method: 'PUT',
    url: url,
    form:{
      "provider_key": config.get("threescale:provider_key"),
      "service_id": service_id,
      "metric_id": metric_id,
      "id": method_id
    }
  };

  if(friendly_name)
    options.form["friendly_name"]=friendly_name
  if(unit)
    options.form["unit"]=unit

    var response = request(options);
    return response.then(function (r) {
      var res  = r[0].req.res;
      var body = JSON.parse(r[0].body);
      if (res.statusCode >= 300) {
        cli.error({message:"ERROR encountered on updating Mapping rule: " + JSON.stringify(body.error)});
        throw new Error("Server responded with status code " + r[0].statusCode + " "+JSON.stringify(body.error));
      } else {
        return body.method;
      }
    });
}

exports.deleteMethod = function(service_id, metric_id, method_id){
    var url = config.API+"/services/"+service_id+"/metrics/"+metric_id+"/methods/"+method_id+".json";

    var options ={
      method: 'DELETE',
      url: url,
      form:{
        "provider_key": config.get("threescale:provider_key"),
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
