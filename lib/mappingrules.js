var nconf = require("nconf");
var cli = require("./3scale-cli");
var config = require("./config");
var Q = require("q");
var request = Q.denodeify(require("request"));

exports.createMappingRule= function(service_id, http_method, pattern, delta, metric_id){
  var url = config.API+"/services/"+service_id+"/proxy/mapping_rules.json";

  var options ={
    method: 'POST',
    url: url,
    form:{
      "access_token": config.access_token,
      "service_id": service_id,
      "http_method": http_method,
      "pattern": pattern,
      "delta": delta,
      "metric_id": metric_id
    }
  };

  var response = request(options);
  return response.then(function (r) {
    var res  = r[0].req.res;
    var body = JSON.parse(r[0].body);
    if (res.statusCode >= 300) {
      cli.error({message:"ERROR encountered on creating Mapping rule: " + JSON.stringify(body.error)});
      throw new Error("Server responded with status code " + r[0].statusCode + " "+JSON.stringify(body.error));
    } else {
      return body.mapping_rule;
    }
  });
}

exports.updateMappingRule= function(service_id, mapping_rule_id, http_method, pattern, delta, metric_id){
  var url = config.API+"/services/"+service_id+"/proxy/mapping_rules/"+mapping_rule_id+".json";

  var options ={
    method: 'PATCH',
    url: url,
    form:{
      "access_token": config.access_token,
      "service_id": service_id,
      "id":mapping_rule_id
    }
  };

  if(http_method)
    options.form["http_method"]=http_method
  if(pattern)
    options.form["pattern"]=pattern
  if(delta)
    options.form["delta"]=delta
  if(metric_id)
    options.form["metric_id"]=metric_id

  var response = request(options);
  return response.then(function (r) {
    var res  = r[0].req.res;
    var body = JSON.parse(r[0].body);
    if (res.statusCode >= 300) {
      cli.error({message:"ERROR encountered on updating Mapping rule: " + JSON.stringify(body.error)});
      throw new Error("Server responded with status code " + r[0].statusCode + " "+JSON.stringify(body.error));
    } else {
      return body.mapping_rule;
    }
  });
}

exports.getMappingRule= function(service_id, mapping_rule_id){
  var url = config.API+"/services/"+service_id+"/proxy/mapping_rules/"+mapping_rule_id+".json";
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
      cli.error({message:"ERROR encountered on getting Mapping rule: " + r[0].statusCode+ " "+ JSON.stringify(body.status)});
      throw new Error("Server responded with status code " + r[0].statusCode + " "+JSON.stringify(body.status));
    } else {
      return body.mapping_rule;
    }
  });
}

exports.listMappingRules= function(service_id){
  var url = config.API+"/services/"+service_id+"/proxy/mapping_rules.json";

  var options ={
    method: 'GET',
    url: url,
    form:{
      "access_token": config.access_token,
      "service_id": service_id,
    }
  };

  var response = request(options);
  return response.then(function (r) {
    var res  = r[0].req.res;
    var body = JSON.parse(r[0].body);
    if (res.statusCode >= 300) {
      cli.error({message:"ERROR encountered on creating listing Mapping rules: " + JSON.stringify(body.error)});
      throw new Error("Server responded with status code " + r[0].statusCode + " "+JSON.stringify(body.error));
    } else {
      return body.mapping_rules;
    }
  });
}

exports.deleteMappingRule= function(service_id, mapping_rule_id){
  var url = config.API+"/services/"+service_id+"/proxy/mapping_rules/"+mapping_rule_id+".json";
  var options ={
    method: 'DELETE',
    url: url,
    form:{
      "access_token": config.access_token
    }
  };

  // var response = request(options);
  // return response.then(function (r) {
  //   var res  = r[0].req.res;
  //   console.log(r[0].body == '')
  //   if(r[0].body == ''){ //DELETE has no payload unless error encountered
  //     return true
  //   }else{
  //     var body = JSON.parse(r[0].body);
  //     cli.error({message:"ERROR encountered on deleting Mapping rule: "+ r[0].statusCode+ " "+ JSON.stringify(body.status)});
  //     throw new Error("Server responded with status code " + r[0].statusCode+ " "+ JSON.stringify(body.status));
  //   }
  // });
  var response = request(options);
  return response.then(function (r) {
    var res  = r[0].req.res;
    if(r[0].body == ''){ //DELETE has no payload unless error encountered
      return true
    }else{
      var body = JSON.parse(r[0].body);
      cli.error({message:"ERROR encountered: " + JSON.stringify(body.errors || body.error || body.status)});
      throw new Error("Server responded with status code " + r[0].statusCode + " "+JSON.stringify(body.errors || body.error || body.status));
    }
  })
}
