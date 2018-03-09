var nconf = require("nconf");
var config = require("./config");
var cli = require("./3scale-cli");
var slug = require("slug");
var Q = require("q");
var request = Q.denodeify(require("request"));
var HttpError = require('http-error-constructor');

exports.createService = function(name){
    var url = config.API+"/services.json";
    var options ={
      method:'POST',
      url: url,
      form:{
        "access_token": config.access_token,
        "name": name,
        "system_name": slug(name,"_")
      }
    };

    cli.debug({name: '3scale-cli:services:create', msg: 'API call URL: %o', data: url});
    cli.debug({name: '3scale-cli:services:create', msg: 'data sent %o: ', data: options.form});

    var response = request(options);
    return response.then(function (r) {
     var res  = r[0].req.res;
     try {
       var body = JSON.parse(res.body);
     } catch(e) {
     }
      if (res.statusCode >= 300) {
        cli.error({message:"ERROR encountered: " + JSON.stringify(body.errors || body.error || body.status)});
        cli.debug({name: '3scale-cli:services:create', msg: 'ERROR:' +r[0].statusCode+" %o", data: (body.errors || body.error || body.status)});
        throw new Error("Server responded with status code " + r[0].statusCode + " "+JSON.stringify(body.errors || body.error || body.status));
      } else {
        config.add("threescale:service_id",body.service.id);
        cli.debug({name: '3scale-cli:services:create', msg: 'result: %o', data: body.service});
        return body.service;
      }
    });

};

exports.listServices = function (){
  var url = config.API+"/services.json";
  var options ={
    method:'GET',
    url: url,
    form:{
      "access_token": config.access_token
    },
    timeout:20000
  };

  cli.debug({name: '3scale-cli:services:list', msg: 'API call URL: %o', data: url});
  cli.debug({name: '3scale-cli:services:list', msg: 'data sent %o: ', data: options.form});

  var response = request(options);
  return response.then(function (r) {
    var res  = r[0].req.res;
    var body = JSON.parse(res.body);
    if (res.statusCode >= 300) {
      cli.error({message:"ERROR encountered: " + JSON.stringify(body.errors || body.error || body.status)});
      cli.debug({name: '3scale-cli:services:list', msg: 'ERROR:' +r[0].statusCode+" %o", data: (body.errors || body.error || body.status)});
      throw new Error("Server responded with status code " + r[0].statusCode + " "+JSON.stringify(body.errors || body.error || body.status));
    } else {
      cli.debug({name: '3scale-cli:services:list', msg: 'result: %o', data: body.services});
      return body.services;
    }
  }).catch(function (err) {
      return err
  });
}

exports.getServiceByID = function(service_id){
  var url = config.API+"/services/"+service_id+".json";
  var options ={
    method:'GET',
    url: url,
    form:{
      "access_token": config.access_token,
      "id": service_id
    }
  };

  cli.debug({name: '3scale-cli:services:getServiceByID', msg: 'API call URL: %o', data: url});
  cli.debug({name: '3scale-cli:services:getServiceByID', msg: 'data sent %o: ', data: options.form});

  var response = request(options);
  return response.then(function (r) {
    var res  = r[0].req.res;
    var body = JSON.parse(res.body);
    if (res.statusCode >= 300) {
      cli.error({message:"ERROR encountered: " + JSON.stringify(body.errors || body.error || body.status)});
      cli.debug({name: '3scale-cli:services:getServiceByID', msg: 'ERROR:' +r[0].statusCode+" %o", data: (body.errors || body.error || body.status)});
      throw new Error("Server responded with status code " + r[0].statusCode + " "+JSON.stringify(body.errors || body.error || body.status));
    } else {
      cli.debug({name: '3scale-cli:services:getServiceByID', msg: 'result: %o', data: body.service});
      return body.service;
    }
  });
}

exports.updateService = function(service_id, name){
  var url = config.API+"/services/"+service_id+".json";
  var options ={
    method:'PUT',
    url: url,
    form:{
      "access_token": config.access_token,
      "id": service_id,
    }
  };

  if(name)
    options.form["name"]=name

  cli.debug({name: '3scale-cli:services:update', msg: 'API call URL: %o', data: url});
  cli.debug({name: '3scale-cli:services:update', msg: 'data sent %o: ', data: options.form});

  var response = request(options);
  return response.then(function (r) {
    var res  = r[0].req.res;
    var body = JSON.parse(res.body);
    if (res.statusCode >= 300) {
      cli.error({message:"ERROR encountered: " + JSON.stringify(body.errors || body.error || body.status)});
      cli.debug({name: '3scale-cli:services:update', msg: 'ERROR:' +r[0].statusCode+" %o", data: (body.errors || body.error || body.status)});
      throw new Error("Server responded with status code " + r[0].statusCode + " "+JSON.stringify(body.errors || body.error || body.status));
    } else {
      cli.debug({name: '3scale-cli:services:update', msg: 'result: %o', data: body.service});
      return body.service;
    }
  });
}

exports.deleteService = function(service_id) {
  var url = config.API+"/services/"+service_id+".json";
  var options ={
    method:'DELETE',
    url: url,
    form:{
      "access_token": config.access_token,
      "id": service_id,
    }
  };

  cli.debug({name: '3scale-cli:services:delete', msg: 'API call URL: %o', data: url});
  cli.debug({name: '3scale-cli:services:delete', msg: 'data sent %o: ', data: options.form});

  var response = request(options);
  return response.then(function (r) {
    var res  = r[0].req.res;
    var body = JSON.parse(res.body);
    if (res.statusCode >= 300) {
      cli.error({message:"ERROR encountered: " + JSON.stringify(body.errors || body.error || body.status)});
      cli.debug({name: '3scale-cli:services:delete', msg: 'ERROR:' +r[0].statusCode+" %o", data: (body.errors || body.error || body.status)});
      throw new Error("Server responded with status code " + r[0].statusCode + " "+JSON.stringify(body.errors || body.error || body.status));
    } else {
      cli.debug({name: '3scale-cli:services:delete', msg: 'result: %o', data: body});
      return body;
    }
  });
}
