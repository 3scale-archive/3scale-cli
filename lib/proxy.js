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

  var response = request(options);
  return response.then(function (r) {
    var res  = r[0].req.res;
    var body = JSON.parse(r[0].body);
    if (res.statusCode >= 300) {
      cli.error({message:"ERROR encountered on updating Proxy: " + JSON.stringify(body.error)});
      throw new Error("Server responded with status code " + r[0].statusCode + " "+JSON.stringify(body.error));
    } else {
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

  var response = request(options);
  return response.then(function (r) {
    var res  = r[0].req.res;
    var body = JSON.parse(r[0].body);
    if (res.statusCode >= 300) {
      cli.error({message:"ERROR encountered on getting Proxy: " + r[0].statusCode+ " "+ JSON.stringify(body.status)});
      throw new Error("Server responded with status code " + r[0].statusCode + " "+JSON.stringify(body.status));
    } else {
      return body.proxy;
    }
  });
}
