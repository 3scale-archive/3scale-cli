var nconf = require("nconf");
var config = require("./config");
var cli = require("./3scale-cli");
var Q = require("q");
var request = Q.denodeify(require("request"));
var HttpError = require('http-error-constructor');

if (exports.allowinsecure == 'Y' || exports.allowinsecure == 'y'){
  	process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}


exports.listAccounts = function (){
  var url = config.API+"/accounts.json";
  var options ={
    method:'GET',
    url: url,
    form:{
      "access_token": config.access_token
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
      return body.accounts;
    }
  }).catch(function (err) {
      return err
  });
}

exports.showAccount = function (account_id){
  var url = config.API+"/accounts/"+account_id+".json";
  var options ={
    method:'GET',
    url: url,
    form:{
      "access_token": config.access_token,
      "id": account_id
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
      return body.account;
    }
  }).catch(function (err) {
      return err
  });
}
