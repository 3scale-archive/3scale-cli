var nconf = require("nconf");
var cli = require("./3scale-cli");
var config = require("./config");
var slug = require("slug");
var Q = require("q");
var request = Q.denodeify(require("request"));

var SwaggerParser = require('swagger-parser');

exports.listActiveDocs = function(){
  var url = config.API+"/active_docs.json";

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
      cli.error({message:"ERROR encountered: " + JSON.stringify(body.error || body.status)});
      throw new Error("Server responded with status code " + r[0].statusCode + " "+JSON.stringify(body.error || body.status));
    } else {
      return body.api_docs
    }
  });
}

exports.createActiveDocs = function(file){
  var url = config.API+"/active_docs.json";

  //Parse swagger file and extract info from it
  return SwaggerParser.parse(file)
  .then(function(api){
    var n = Math.floor((Math.random() * 50) + 10)
    var options ={
      method: 'POST',
      url: url,
      form:{
        "provider_key": config.get("threescale:provider_key"),
        "name": api.info.title+n,
        "system_name": slug(api.info.title+n),
        "body": JSON.stringify(api),
        "description": api.info.description || "Activedocs file description",
        "published": true,
        "skip_swagger_validations": false
      }
    };

    var response = request(options);
    return response.then(function (r) {
      var res  = r[0].req.res;
      var body = JSON.parse(r[0].body);
      if (res.statusCode >= 300) {
        cli.error({message:"ERROR encountered: " + JSON.stringify(body.error || body.status)});
        throw new Error("Server responded with status code " + r[0].statusCode + " "+JSON.stringify(body.error || body.status));
      } else {
        return body.api_doc
      }
    });
  })

}

exports.updateActiveDocs = function(file, id){
  var url = config.API+"/active_docs/"+id+".json";

  //Parse swagger file and extract info from it
  return SwaggerParser.parse(file)
  .then(function(api){
    var options ={
      method: 'PUT',
      url: url,
      form:{
        "provider_key": config.get("threescale:provider_key"),
        "id": id,
        "body": JSON.stringify(api),
        "description": api.info.description || "Activedocs file description",
      }
    };

    var response = request(options);
    return response.then(function (r) {
      var res  = r[0].req.res;
      var body = JSON.parse(r[0].body);
      if (res.statusCode >= 300) {
        cli.error({message:"ERROR encountered: " + JSON.stringify(body.error || body.status)});
        throw new Error("Server responded with status code " + r[0].statusCode + " "+JSON.stringify(body.error || body.status));
      } else {
        return body.api_doc
      }
    });
  });
}

exports.deleteActiveDocs = function(activedocs_id){
  var url = config.API+"/active_docs/"+activedocs_id+".json";

  var options ={
    method: 'DELETE',
    url: url,
    form:{
      "provider_key": config.get("threescale:provider_key")
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
