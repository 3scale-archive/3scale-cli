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
      "access_token": config.access_token
    }
  };

  cli.debug({name: '3scale-cli:activedocs:list', msg: 'API call URL: '+url})

  var response = request(options);
  return response.then(function (r) {
    var res  = r[0].req.res;
    var body = JSON.parse(r[0].body);
    if (res.statusCode >= 300) {
      cli.error({message:"ERROR encountered: " + JSON.stringify(body.errors || body.error || body.status)});
      cli.debug({name: '3scale-cli:activedocs:list', msg: 'ERROR:' +r[0].statusCode+" %o", data: (body.errors || body.error || body.status)})
      throw new Error("Server responded with status code " + r[0].statusCode + " "+JSON.stringify(body.errors || body.error || body.status));
    } else {
      cli.debug({name: '3scale-cli:activedocs:list', msg: 'result: %o', data: body.api_docs})
      return body.api_docs
    }
  });
}

exports.createActiveDocs = function(file, system_name){
  var url = config.API+"/active_docs.json";

  //Parse swagger file and extract info from it
  return SwaggerParser.parse(file)
  .then(function(api){
    var n = Math.floor((Math.random() * 50) + 10)
    var options ={
      method: 'POST',
      url: url,
      form:{
        "access_token": config.access_token,
        "name": system_name || api.info.title+n,
        "system_name": slug(system_name || api.info.title+n),
        "body": JSON.stringify(api),
        "description": api.info.description || "Activedocs file description",
        "published": true,
        "skip_swagger_validations": false
      }
    };

    cli.debug({name: '3scale-cli:activedocs:create', msg: 'API call URL: '+url+'\n data %o', data: options.form})

    var response = request(options);
    return response.then(function (r) {
      var res  = r[0].req.res;
      var body = JSON.parse(r[0].body);
      if (res.statusCode >= 300) {
        cli.error({message:"ERROR encountered: " + JSON.stringify(body.errors || body.error || body.status)});
        cli.debug({name: '3scale-cli:activedocs:create', msg: 'ERROR:' +r[0].statusCode+" %o", data: (body.errors || body.error || body.status)})
        throw new Error("Server responded with status code " + r[0].statusCode + " "+JSON.stringify(body.errors || body.error || body.status));
      } else {
        cli.debug({name: '3scale-cli:activedocs:create', msg: 'result: %o' , data: body.api_doc})
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
        "access_token": config.access_token,
        "id": id,
        "body": JSON.stringify(api),
        "description": api.info.description || "Activedocs file description",
      }
    };

    cli.debug({name: '3scale-cli:activedocs:update', msg: 'API call URL: '+url})

    var response = request(options);
    return response.then(function (r) {
      var res  = r[0].req.res;
      var body = JSON.parse(r[0].body);
      if (res.statusCode >= 300) {
        cli.error({message:"ERROR encountered: " + JSON.stringify(body.errors || body.error || body.status)});
        cli.debug({name: '3scale-cli:activedocs:update', msg: 'ERROR:' +r[0].statusCode+" %o", data: (body.errors || body.error || body.status)})
        throw new Error("Server responded with status code " + r[0].statusCode + " "+JSON.stringify(body.errors || body.error || body.status));
      } else {
        cli.debug({name: '3scale-cli:activedocs:update', msg: 'result: %o', data: body.api_doc})
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
      "access_token": config.access_token
    }
  };

  cli.debug({name: '3scale-cli:activedocs:delete', msg: 'API call URL: '+url})

  var response = request(options);
  return response.then(function (r) {
    var res  = r[0].req.res;
    if(r[0].body == ''){ //DELETE has no payload unless error encountered
      cli.debug({name: '3scale-cli:activedocs:delete', msg: 'DELETED'})
      return true
    }else{
      var body = JSON.parse(r[0].body);
      cli.error({message:"ERROR encountered: " + JSON.stringify(body.errors || body.error || body.status)});
      cli.debug({name: '3scale-cli:activedocs:delete', msg: 'ERROR:' +r[0].statusCode+" %o", data: (body.errors || body.error || body.status)})
      throw new Error("Server responded with status code " + r[0].statusCode + " "+JSON.stringify(body.errors || body.error || body.status));
    }
  })
}
