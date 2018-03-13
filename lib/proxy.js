var nconf = require("nconf");
var cli = require("./3scale-cli");
var config = require("./config");
var Q = require("q");
var request = Q.denodeify(require("request"));

exports.updateProxy= function(service_id,
                              api_backend,
                              endpoint,
                              sandbox_endpoint,
                              credentials_location,
                              auth_app_key,
                              auth_app_id,
                              auth_user_key,
                              oidc_issuer_endpoint){
  var url = config.API+"/services/"+service_id+"/proxy.json";

  var options ={
    method: 'PATCH',
    url: url,
    form:{
      "access_token": config.access_token,
      "service_id": service_id
    }
  };

  if (api_backend)
    options.form["api_backend"] = api_backend

  if (endpoint)
    options.form["endpoint"] = endpoint

  if (sandbox_endpoint)
    options.form["sandbox_endpoint"] = sandbox_endpoint

  if (credentials_location)
    options.form["credentials_location"] = credentials_location

  if (auth_app_key)
    options.form["auth_app_key"] = auth_app_key

  if (auth_app_id)
    options.form["auth_app_id"] = auth_app_id

  if (auth_user_key)
    options.form["auth_user_key"] = auth_user_key

  if (oidc_issuer_endpoint)
    options.form["oidc_issuer_endpoint"] = oidc_issuer_endpoint
  
  cli.debug({name: '3scale-cli:proxy:update', msg: 'API call URL: %o', data: url});
  cli.debug({name: '3scale-cli:proxy:update', msg: 'data sent %o: ', data: options.form});

  var response = request(options);
  return response.then(function (r) {
    var res  = r[0].req.res;
    var body = JSON.parse(r[0].body);
    if (res.statusCode >= 300) {
      cli.error({message:"ERROR encountered on updating Proxy: " + JSON.stringify(body.errors || body.error || body.status)});
      cli.debug({name: '3scale-cli:proxy:update', msg: 'ERROR:' +r[0].statusCode+" %o", data: (body.errors || body.error || body.status)});
      throw new Error("Server responded with status code " + r[0].statusCode + " "+JSON.stringify(body.errors || body.error || body.status));
    } else {
      cli.debug({name: '3scale-cli:proxy:update', msg: 'result: %o', data: body.proxy});
      return body.proxy;
    }
  });
}

exports.showProxy= function(service_id){
  var url = config.API+"/services/"+service_id+"/proxy.json";
  var options ={
    method: 'GET',
    url: url,
    form:{
      "access_token": config.access_token,
      "service_id": service_id
    }
  };

  cli.debug({name: '3scale-cli:proxy:show', msg: 'API call URL: %o', data: url});
  cli.debug({name: '3scale-cli:proxy:show', msg: 'data sent %o: ', data: options.form});

  var response = request(options);
  return response.then(function (r) {
    var res  = r[0].req.res;
    var body = JSON.parse(r[0].body);
    if (res.statusCode >= 300) {
      cli.error({message:"ERROR encountered on getting Proxy: " + r[0].statusCode+ " "+ JSON.stringify(body.status)});
      cli.debug({name: '3scale-cli:proxy:show', msg: 'ERROR:' +r[0].statusCode+" %o", data: (body.errors || body.error || body.status)});
      throw new Error("Server responded with status code " + r[0].statusCode + " "+JSON.stringify(body.status));
    } else {
      cli.debug({name: '3scale-cli:proxy:show', msg: 'result: %o', data: body.proxy});
      return body.proxy;
    }
  });
}
