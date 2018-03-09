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

  cli.debug({name: '3scale-cli:proxy-configs:list', msg: 'API call URL: %o', data: url});
  cli.debug({name: '3scale-cli:proxy-configs:list', msg: 'data sent %o: ', data: options.form});

  var response = request(options);
  return response.then(function (r) {
    var res  = r[0].req.res;
    var body = JSON.parse(r[0].body);
    if (res.statusCode >= 300) {
      cli.error({message:"ERROR encountered on listing Proxy Configs: " + JSON.stringify(body.errors || body.error || body.status)});
      cli.debug({name: '3scale-cli:proxy-configs:list', msg: 'ERROR:' +r[0].statusCode+" %o", data: (body.errors || body.error || body.status)});
      throw new Error("Server responded with status code " + r[0].statusCode + " "+JSON.stringify(body.errors || body.error || body.status));
    } else {
      cli.debug({name: '3scale-cli:proxy-configs:list', msg: 'result: %o', data: body.proxy_configs});
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

  cli.debug({name: '3scale-cli:proxy-configs:show', msg: 'API call URL: %o', data: url});
  cli.debug({name: '3scale-cli:proxy-configs:show', msg: 'data sent %o: ', data: options.form});

  var response = request(options);
  return response.then(function (r) {
    var res  = r[0].req.res;
    var body = JSON.parse(r[0].body);
    if (res.statusCode >= 300) {
      cli.error({message:"ERROR encountered on showing Proxy Config version: " + JSON.stringify(body.errors || body.error || body.status)});
      cli.debug({name: '3scale-cli:proxy-configs:show', msg: 'ERROR:' +r[0].statusCode+" %o", data: (body.errors || body.error || body.status)});
      throw new Error("Server responded with status code " + r[0].statusCode + " "+JSON.stringify(body.errors || body.error || body.status));
    } else {
      cli.debug({name: '3scale-cli:proxy-configs:show', msg: 'result: %o', data: body.proxy_configs.content});
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

  cli.debug({name: '3scale-cli:proxy-configs:promote', msg: 'API call URL: %o', data: url});
  cli.debug({name: '3scale-cli:proxy-configs:promote', msg: 'data sent %o: ', data: options.form});

  var response = request(options);
  return response.then(function (r) {
    var res  = r[0].req.res;
    var body = JSON.parse(r[0].body);
    if (res.statusCode >= 300) {
      cli.error({message:"ERROR encountered on promoting Proxy Config version: " + JSON.stringify(body.errors || body.error || body.status)});
      cli.debug({name: '3scale-cli:proxy-configs:promote', msg: 'ERROR:' +r[0].statusCode+" %o", data: (body.errors || body.error || body.status)});
      throw new Error("Server responded with status code " + r[0].statusCode + " "+JSON.stringify(body.errors || body.error || body.status));
    } else {
      cli.debug({name: '3scale-cli:proxy-configs:promote', msg: 'result: %o', data: body});
      return body;
    }
  });
}
