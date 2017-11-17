var nconf = require("nconf");
var cli = require("./3scale-cli");
var config = require("./config");
var Q = require("q");
var request = Q.denodeify(require("request"));

exports.listProxyConfigs= function(service_id, environment){
  var url = config.API+"/services/"+service_id+"/proxy/configs/"+environment+".json";

  var options ={
    method: 'GET',
    url: url,
    form:{
      "access_token": config.access_token,
      "service_id": service_id,
      "environment": environment
    }
  };

  var response = request(options);
  return response.then(function (r) {
    var res  = r[0].req.res;
    var body = JSON.parse(r[0].body);
    if (res.statusCode >= 300) {
      cli.error({message:"ERROR encountered on listing Proxy Configs: " + JSON.stringify(body.error)});
      throw new Error("Server responded with status code " + r[0].statusCode + " "+JSON.stringify(body.error));
    } else {
      return body.proxy_configs;
    }
  });
}

exports.showProxyConfig= function(service_id, environment, version){
  var url = config.API+"/services/"+service_id+"/proxy/configs/"+environment+"/"+version+".json";
  var options ={
    method: 'GET',
    url: url,
    form:{
      "access_token": config.access_token,
      "service_id": service_id,
      "environment": environment,
      "version": version
    }
  };

  var response = request(options);
  return response.then(function (r) {
    var res  = r[0].req.res;
    var body = JSON.parse(r[0].body);
    if (res.statusCode >= 300) {
      cli.error({message:"ERROR encountered on showing Proxy Config version: " + JSON.stringify(body.error)});
      throw new Error("Server responded with status code " + r[0].statusCode + " "+JSON.stringify(body.error));
    } else {
      return body.proxy_config.content;
    }
  });
}

exports.promoteProxyConfig= function(service_id, environment, version, destination){
  var url = config.API+"/services/"+service_id+"/proxy/configs/"+environment+"/"+version+"/promote.json";
  var options ={
    method: 'POST',
    url: url,
    form:{
      "access_token": config.access_token,
      "service_id": service_id,
      "environment": environment,
      "version": version,
      "to": destination
    }
  };

  var response = request(options);
  return response.then(function (r) {
    var res  = r[0].req.res;
    var body = JSON.parse(r[0].body);
    if (res.statusCode >= 300) {
      cli.error({message:"ERROR encountered on promoting Proxy Config version: " + JSON.stringify(body.error)});
      throw new Error("Server responded with status code " + r[0].statusCode + " "+JSON.stringify(body.error));
    } else {
      return body;
    }
  });
}
