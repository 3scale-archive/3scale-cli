var nconf = require("nconf");
var cli = require("./3scale-cli");
var config = require("./config");
var slug = require("slug");
var Q = require("q");
var request = Q.denodeify(require("request"));

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
      cli.error({message:"ERROR encountered: " + JSON.stringify(body.errors || body.status)});
      throw new Error("Server responded with status code " + r[0].statusCode + " "+JSON.stringify(body.errors || body.status));
    } else {
      return body.api_docs
    }
  });
}

exports.createActiveDocs = function(options){

}

exports.updateActiveDocs = function(options){

}

exports.deleteActiveDocs = function(activedocs_id){

}
