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

  cli.debug({name: '3scale-cli:applications:list', msg: 'API call URL: %o', data: url});
  cli.debug({name: '3scale-cli:applications:list', msg: 'data sent %o: ', data: options.form});

  var response = request(options);
  return response.then(function (r) {
    var res  = r[0].req.res;
    var body = JSON.parse(res.body);
    if (res.statusCode >= 300) {
      cli.error({message:"ERROR encountered: " + JSON.stringify(body.errors || body.error || body.status)});
      cli.debug({name: '3scale-cli:applications:list', msg: 'ERROR:' +r[0].statusCode+" %o", data: (body.errors || body.error || body.status)});
      throw new Error("Server responded with status code " + r[0].statusCode + " "+JSON.stringify(body.errors || body.error || body.status));
    } else {
      cli.debug({name: '3scale-cli:applications:list', msg: 'result: %o' , data: body.applications});
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

  cli.debug({name: '3scale-cli:applications:show', msg: 'API call URL: %o', data: url});
  cli.debug({name: '3scale-cli:applications:show', msg: 'data sent %o: ', data: options.form});

  var response = request(options);
  return response.then(function (r) {
    var res  = r[0].req.res;
    var body = JSON.parse(res.body);
    if (res.statusCode >= 300) {
      cli.error({message:"ERROR encountered: " + JSON.stringify(body.errors || body.error || body.status)});
      cli.debug({name: '3scale-cli:applications:show', msg: 'ERROR:' +r[0].statusCode+" %o", data: (body.errors || body.error || body.status)});
      throw new Error("Server responded with status code " + r[0].statusCode + " "+JSON.stringify(body.errors || body.error || body.status));
    } else {
      cli.debug({name: '3scale-cli:applications:show', msg: 'result: %o' , data: body.application});
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

  cli.debug({name: '3scale-cli:applications:create', msg: 'API call URL: %o', data: url});
  cli.debug({name: '3scale-cli:applications:create', msg: 'data sent %o: ', data: options});

  var response = request(options);
  return response.then(function (r) {
    var res  = r[0].req.res;
    var body = JSON.parse(res.body);
    if (res.statusCode >= 300) {
      cli.error({message:"ERROR encountered: " + JSON.stringify(body.errors || body.error || body.status)});
      cli.debug({name: '3scale-cli:applications:create', msg: 'ERROR:' +r[0].statusCode+" %o", data: (body.errors || body.error || body.status)});
      throw new Error("Server responded with status code " + r[0].statusCode + " "+JSON.stringify(body.errors || body.error || body.status));
    } else {
        cli.debug({name: '3scale-cli:applications:create', msg: 'result: %o' , data: body.application});
      return body.application;
    }
  }).catch(function (err) {
      return err
  });
}

exports.updateApplication = function (account_id, id, name, description){
  var url = config.API+"/accounts/"+account_id+"/applications/"+id+".json";
  var options ={
    method:'PUT',
    url: url,
    form:{
      "access_token": config.access_token,
      "account_id": account_id,
      "id": id,
    },
    timeout:20000
  };

  if (name)
    options.form["name"] = name

  if (description)
    options.form["description"] = description

  cli.debug({name: '3scale-cli:applications:update', msg: 'API call URL: %o', data: url});
  cli.debug({name: '3scale-cli:applications:update', msg: 'data sent %o: ', data: options});

  var response = request(options);
  return response.then(function (r) {
    var res  = r[0].req.res;
    var body = JSON.parse(res.body);
    if (res.statusCode >= 300) {
      cli.error({message:"ERROR encountered: " + JSON.stringify(body.errors || body.error || body.status)});
      cli.debug({name: '3scale-cli:applications:update', msg: 'ERROR:' +r[0].statusCode+" %o", data: (body.errors || body.error || body.status)});
      throw new Error("Server responded with status code " + r[0].statusCode + " "+JSON.stringify(body.errors || body.error || body.status));
    } else {
      cli.debug({name: '3scale-cli:applications:update', msg: 'result: %o' , data: body.application});
      return body.application;
    }
  }).catch(function (err) {
      return err
  });
}

exports.deleteApplication = function (account_id, id){
  var url = config.API+"/accounts/"+account_id+"/applications/"+id+".json";
  var options ={
    method:'DELETE',
    url: url,
    form:{
      "access_token": config.access_token,
      "account_id": account_id,
      "id": id,
    },
    timeout:20000
  };

  cli.debug({name: '3scale-cli:applications:delete', msg: 'API call URL: %o', data: url});
  cli.debug({name: '3scale-cli:applications:delete', msg: 'data sent %o: ', data: options});

  var response = request(options);
  return response.then(function (r) {
    var res  = r[0].req.res;
    var body = JSON.parse(res.body);
    if (res.statusCode >= 300) {
      cli.error({message:"ERROR encountered: " + JSON.stringify(body.errors || body.error || body.status)});
      cli.debug({name: '3scale-cli:applications:delete', msg: 'ERROR:' +r[0].statusCode+" %o", data: (body.errors || body.error || body.status)});
      throw new Error("Server responded with status code " + r[0].statusCode + " "+JSON.stringify(body.errors || body.error || body.status));
    } else {
      cli.debug({name: '3scale-cli:applications:delete', msg: 'result: %o' , data: body});
      return body;
    }
  });
}

exports.suspendApplication = function (account_id, id){
  var url = config.API+"/accounts/"+account_id+"/applications/"+id+"/suspend.json";
  var options ={
    method:'PUT',
    url: url,
    form:{
      "access_token": config.access_token,
      "account_id": account_id,
      "id": id,
    },
    timeout:20000
  };

  cli.debug({name: '3scale-cli:applications:suspend', msg: 'API call URL: %o', data: url});
  cli.debug({name: '3scale-cli:applications:suspend', msg: 'data sent %o: ', data: options});

  var response = request(options);
  return response.then(function (r) {
    var res  = r[0].req.res;
    var body = JSON.parse(res.body);
    if (res.statusCode >= 300) {
      cli.error({message:"ERROR encountered: " + JSON.stringify(body.errors || body.error || body.status)});
      cli.debug({name: '3scale-cli:applications:suspend', msg: 'ERROR:' +r[0].statusCode+" %o", data: (body.errors || body.error || body.status)});
      throw new Error("Server responded with status code " + r[0].statusCode + " "+JSON.stringify(body.errors || body.error || body.status));
    } else {
      cli.debug({name: '3scale-cli:applications:suspend', msg: 'result: %o' , data: body});
      return body;
    }
  });
}

exports.resumeApplication = function (account_id, id){
  var url = config.API+"/accounts/"+account_id+"/applications/"+id+"/resume.json";
  var options ={
    method:'PUT',
    url: url,
    form:{
      "access_token": config.access_token,
      "account_id": account_id,
      "id": id,
    },
    timeout:20000
  };

  cli.debug({name: '3scale-cli:applications:resume', msg: 'API call URL: %o', data: url});
  cli.debug({name: '3scale-cli:applications:resume', msg: 'data sent %o: ', data: options});

  var response = request(options);
  return response.then(function (r) {
    var res  = r[0].req.res;
    var body = JSON.parse(res.body);
    if (res.statusCode >= 300) {
      cli.error({message:"ERROR encountered: " + JSON.stringify(body.errors || body.error || body.status)});
      cli.debug({name: '3scale-cli:applications:resume', msg: 'ERROR:' +r[0].statusCode+" %o", data: (body.errors || body.error || body.status)});
      throw new Error("Server responded with status code " + r[0].statusCode + " "+JSON.stringify(body.errors || body.error || body.status));
    } else {
      cli.debug({name: '3scale-cli:applications:resume', msg: 'result: %o' , data: body});
      return body;
    }
  });
}
