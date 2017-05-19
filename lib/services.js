var nconf = require("nconf");
var config = require("./config");
var cli = require("./3scale-cli");
var slug = require("slug");
var Q = require("q");
var request = Q.denodeify(require("request"));

exports.createService = function(name){
    var url = config.API+"/services.json";
    var n = name+Math.floor((Math.random() * 50) + 10)
    var options ={
      method:'POST',
      url: url,
      form:{
        "access_token": config.access_token,
        "name": n, //TODO get rid of random
        "system_name": slug(n,"_")
      }
    };
    var response = request(options);

    return response.then(function (r) {
      var res  = r[0].req.res;
      var body = JSON.parse(res.body);
      if (res.statusCode >= 300) {
        cli.error({message:"ERROR encountered: " + body.error});
        throw new Error("Server responded with status code " + res[0].req.res.statusCode,body.error);
      } else {
        config.add("threescale:service_id",body.service.id);
        return body.service;//assuming tapes are strings and not binary data
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

  console.log(url)
  var response = request(options);
  return response.then(function (r) {
    console.log(r)
    var res  = r[0].req.res;
    var body = JSON.parse(res.body);
    console.log("BODY",body,res.statusCode,res)
    if (res.statusCode >= 300) {
      cli.error({message:"ERROR encountered: " + JSON.stringify(body.error || body.status)});
      throw new Error("Server responded with status code " + r[0].statusCode + " "+JSON.stringify(body.error || body.status));
    } else {
      return body.services;
    }
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
  var response = request(options);
  return response.then(function (r) {
    var res  = r[0].req.res;
    var body = JSON.parse(res.body);
    if (res.statusCode >= 300) {
      cli.error({message:"ERROR encountered: " + JSON.stringify(body.error || body.status)});
      throw new Error("Server responded with status code " + r[0].statusCode + " "+JSON.stringify(body.error || body.status));
    } else {
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

  var response = request(options);
  return response.then(function (r) {
    var res  = r[0].req.res;
    var body = JSON.parse(res.body);
    if (res.statusCode >= 300) {
      cli.error({message:"ERROR encountered: " + JSON.stringify(body.error || body.status)});
      throw new Error("Server responded with status code " + r[0].statusCode + " "+JSON.stringify(body.error || body.status));
    } else {
      return body.service;
    }
  });
}
