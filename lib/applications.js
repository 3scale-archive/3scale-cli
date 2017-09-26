var nconf = require("nconf");
var config = require("./config");
var cli = require("./3scale-cli");
var Q = require("q");
var request = Q.denodeify(require("request"));
var HttpError = require('http-error-constructor');

exports.listApplications = function (account_id){
  var url = config.API+"/accounts/"+account_id+"/applications.json";
  var options ={
    method:'GET',
    url: url,
    form:{
      "access_token": config.access_token,
      "account_id": account_id
    },
    timeout:20000
  };

  var response = request(options);
  return response.then(function (r) {
    var res  = r[0].req.res;
    var body = JSON.parse(res.body);
    if (res.statusCode >= 300) {
      cli.error({message:"ERROR encountered: " + JSON.stringify(body.error || body.status)});
      throw new Error("Server responded with status code " + r[0].statusCode + " "+JSON.stringify(body.error || body.status));
    } else {
      return body.applications;
    }
  }).catch(function (err) {
      return err
  });
}

exports.showApplication = function (account_id, id){
  var url = config.API+"/accounts/"+account_id+"/applications/"+id+".json";
  var options ={
    method:'GET',
    url: url,
    form:{
      "access_token": config.access_token,
      "account_id": account_id,
      "id": id
    },
    timeout:20000
  };

  var response = request(options);
  return response.then(function (r) {
    var res  = r[0].req.res;
    var body = JSON.parse(res.body);
    if (res.statusCode >= 300) {
      cli.error({message:"ERROR encountered: " + JSON.stringify(body.error || body.status)});
      throw new Error("Server responded with status code " + r[0].statusCode + " "+JSON.stringify(body.error || body.status));
    } else {
      return body.application;
    }
  }).catch(function (err) {
      return err
  });
}

exports.createApplication = function (account_id, plan_id, name, description, user_key){
  var url = config.API+"/accounts/"+account_id+"/applications.json";
  var options ={
    method:'POST',
    url: url,
    form:{
      "access_token": config.access_token,
      "account_id": account_id,
      "plan_id": plan_id,
      "name": name,
      "description": description
    },
    timeout:20000
  };

  if(user_key)
    options.form["user_key"] = user_key

  var response = request(options);
  return response.then(function (r) {
    var res  = r[0].req.res;
    var body = JSON.parse(res.body);
    if (res.statusCode >= 300) {
      cli.error({message:"ERROR encountered: " + JSON.stringify(body.error || body.status)});
      throw new Error("Server responded with status code " + r[0].statusCode + " "+JSON.stringify(body.error || body.status));
    } else {
      return body.application;
    }
  }).catch(function (err) {
      return err
  });
}
