var nconf = require("nconf");
var config = require("./config");
var cli = require("./3scale-cli");
var Q = require("q");
var request = Q.denodeify(require("request"));
var HttpError = require('http-error-constructor');

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

  cli.debug({name: '3scale-cli:acounts:list', msg: 'API call URL: %o', data: url})
  cli.debug({name: '3scale-cli:accounts:list', msg: 'data sent %o: ', data: options.form});

  var response = request(options);
  return response.then(function (r) {
    var res  = r[0].req.res;
    var body = JSON.parse(res.body);
    if (res.statusCode >= 300) {
      cli.error({message:"ERROR encountered: " + JSON.stringify(body.errors || body.error || body.status)});
      cli.debug({name: '3scale-cli:accounts:list', msg: 'ERROR:' +r[0].statusCode+" %o", data: (body.errors || body.error || body.status)})
      throw new Error("Server responded with status code " + r[0].statusCode + " "+JSON.stringify(body.errors || body.error || body.status));
    } else {
      cli.debug({name: '3scale-cli:accounts:list', msg: 'result: %o', data: body.accounts})
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

  cli.debug({name: '3scale-cli:acounts:show', msg: 'API call URL: %o', data: url})
  cli.debug({name: '3scale-cli:accounts:show', msg: 'data sent %o: ', data: options.form});

  var response = request(options);
  return response.then(function (r) {
    var res  = r[0].req.res;
    var body = JSON.parse(res.body);
    if (res.statusCode >= 300) {
      cli.error({message:"ERROR encountered: " + JSON.stringify(body.errors || body.error || body.status)});
      cli.debug({name: '3scale-cli:accounts:show', msg: 'ERROR:' +r[0].statusCode+" %o", data: (body.errors || body.error || body.status)})
      throw new Error("Server responded with status code " + r[0].statusCode + " "+JSON.stringify(body.errors || body.error || body.status));
    } else {
      cli.debug({name: '3scale-cli:accounts:show', msg: 'result: %o', data: body.account})
      return body.account;
    }
  }).catch(function (err) {
      return err
  });
}
