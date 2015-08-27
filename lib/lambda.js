
/**
 * action used for the '3scale-cli lambda' command
 */

var generator = require("3scale-lambda");
var cli = require("./3scale-cli");
var config = require("./config");

exports.generateLambdaFunction = function(service_id) {
  var outputDir = process.cwd();
  cli.info({message:"writing your Lambda bundle to " + outputDir});
  var options = {
    providerKey: config.get("threescale:provider_key"),
    serviceID: service_id
  };
  generator(options, outputDir);
};
