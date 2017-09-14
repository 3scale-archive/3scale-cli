var cli = require("./3scale-cli");
var config = require("./config");
var parrser = require("swagger-parser");
var SwaggerParser = require('swagger-parser');
var Q = require("q");
Q.longStackSupport = true;
const delayed = require('delay-promise');
var debug = require('debug');
var inquirer = require("inquirer");

var slug = require("slug");
slug.charmap['{'] = '_'
slug.charmap['}'] = '_'
slug.charmap['\/'] = '_SLASH_'

var services = require("./services");
var appplan = require("./application_plans");
var metrics = require("./metrics");
var methods = require("./methods");
var maprules = require("./mappingrules");

var HIT_METRIC_ID ="";
var METHODS = []

var ALLOWED_METHODS = [
  "GET","POST","PUT","OPTIONS","PATCH","HEAD","DELETE"
]

var PROMISE_DELAY = 1000 //in ms

exports.import = function(path, service_id, appplan_name, method_pattern){
  SwaggerParser.validate(path)
    .then(function(api) {
        // Success
        debug('Swagger spec is valid')
        //List methods to import
        var all_endpoints = extractEndpointsFromSwagger(api)
        var questions = [
          {
            type: 'checkbox',
            name: 'methods',
            message: 'Which methods to import',
            choices: all_endpoints.map(function(e){
                  	return {
                    	name: e.path,
                      value: e.path
                    }
                })
          }
        ];
        inquirer.prompt(questions).then(function(res){ //res.methods contains the method to be imported
          // console.log("RRRES",res)
          if(res.methods.length>0){ //methods selected
            // extract selected methods
            all_endpoints.forEach(function(e){
              if(res.methods.indexOf(e.path) > -1){
               METHODS.push(e)
              }
            })

            // Create a new service or push to an existing service?
            var question = [
              {
                type: 'confirm',
                name: 'service_create',
                message: 'Create a new service?',
              }
            ]
            inquirer.prompt(question).then(function(res){
              // console.log('res', res);
              if(res.service_create === true){
                // Create new service
                var title = api.info.title+Math.floor((Math.random() * 50) + 10);
                var ser = services.createService(title).then(function(service){
                  cli.print({message: "Service with id "+ service.id+" created on 3scale"});
                  threescale_water(api, res.service_id, METHODS)
                });
              } else {
                // Ask for service_id
                var question = [
                  {
                    type: 'input',
                    name: 'service_id',
                    message: 'Existing 3scale Service ID',
                  }
                ]
                inquirer.prompt(question).then(function(res){
                  // console.log(res)
                  threescale_water(api, res.service_id, METHODS)
                })
              }
            })

          }else{
            debug('No method selected')
            cli.print({message: "ERROR: You did not select any method to import.", type:"error"});
          }
        })
    })
    .catch(function(err) {
        // Error
        debug('Swagger spec is invalid')
        console.log(err)
        cli.print({message: "ERROR: "+err.message, type:"error"});
    });
  // parrser.parse(path, function(err,api){
  //
  // })
}

exports.import___ = function(path, service_id, appplan_name, method_pattern){
  parrser.parse(path, function(err,api){
    if(err)
      cli.print({message: "ERROR: "+err.message,type:"error"});

    if(api){ //swagger valid file
      var title = api.info.title+Math.floor((Math.random() * 50) + 10);
      if(service_id){ //update existing service
        threescale_waterfall(api, service_id,appplan_name,method_pattern);
      }else{
        var ser = services.createService(title).then(function(service){
          cli.print({message: "Service with id "+ service.id+" created on 3scale"});
          threescale_waterfall(api, service.id, appplan_name,method_pattern);
       });
     }
      cli.print({message: "Loading "+title+" swagger definition."});
    }
  });
};

var threescale_water = function(api, service_id, methods){
  metrics.getHitsMetric(service_id)
  .then(function(hit_metric){
    cli.print({message: "Hits metric with id "+ hit_metric.id+" found on 3scale"});
    HIT_METRIC_ID = hit_metric.id;
  }).then(function(){
    var promisesArr = [];
    methods.forEach(function(m) {
      promisesArr.push(delayed.creator(createMethodPromise, service_id, m))
    })
    return promisesArr;
  }).then(function(methodsPromiseArr){
    //Execute promises with delay
    var promisesArr = [];
    return delayed.series(methodsPromiseArr, PROMISE_DELAY).then((promisesArray) => {
      return promisesArray
    });
  })
  .then(function(threescaleMethodsArr){
    //create an array of promises for createMappingRule function
    var promisesArr = [];
    METHODS.forEach(function(m,index){
      promisesArr.push(delayed.creator(createMappingRulePromise, service_id,m,threescaleMethodsArr[index]))
    })
    return promisesArr
  })
  .then(function(mappingRulesPromiseArr){
    //Execute promises with delay
    return delayed.series(mappingRulesPromiseArr, PROMISE_DELAY).then((promisesArray) => {
      return promisesArray
    });
  })
  .done(function(){
    cli.success({message:"Import on 3scale complete"});
  })
}

// var  threescale_waterfall= function(api, service_id, appplan_name,method_pattern){
//   // appplan.createAppPlan(service_id,appplan_name).then(function(plan){
//   //   var application_plan_id = plan.application_plan.id;
//   //   cli.print({message: "Application plan with id "+ application_plan_id+" created on 3scale"});
//   // }).then(function(){
//
//   metrics.getHitsMetric(service_id)
//   .then(function(hit_metric){
//     cli.print({message: "Hits metric with id "+ hit_metric.id+" found on 3scale"});
//     HIT_METRIC_ID = hit_metric.id;
//   })
//   .then(function(){
//     return extractMethodsFromSwagger(api,method_pattern)
//   })
//   .then(function(methodsArr){ //FIXME promises & delay for methods and mapping rule creation
//
//     METHODS = methodsArr
//     //create an array of promises for createMethod function
//     var promisesArr = [];
//     methodsArr.forEach(function(m){
//       promisesArr.push(delayed.creator(createMethodPromise, service_id,m))
//     })
//     return promisesArr
//   })
//   .then(function(methodsPromiseArr){
//     //Execute promises with delay
//     var promisesArr = [];
//     return delayed.series(methodsPromiseArr, PROMISE_DELAY).then((promisesArray) => {
//       return promisesArray
//     });
//   })
//   .then(function(threescaleMethodsArr){
//     //create an array of promises for createMappingRule function
//     var promisesArr = [];
//     METHODS.forEach(function(m,index){
//       promisesArr.push(delayed.creator(createMappingRulePromise, service_id,m,threescaleMethodsArr[index]))
//     })
//     return promisesArr
//   })
//   .then(function(mappingRulesPromiseArr){
//     //Execute promises with delay
//     return delayed.series(mappingRulesPromiseArr, PROMISE_DELAY).then((promisesArray) => {
//       return promisesArray
//     });
//   })
//   .done(function(){
//     cli.success({message:"Import on 3scale complete"});
//   })
// };


var extractEndpointsFromSwagger = function (api, method_pattern) {
  var methodsArr = [];
  for (var e in api.paths){
    for(var m in api.paths[e]){ //methods
      var method = api.paths[e][m];
      method.http_verb = m;
      if(!Array.isArray(method) || ALLOWED_METHODS.indexOf(method.http_verb.toUpperCase()) > -1){ //method obj should not be an array and the HTTP verb should be in the authorized list
        method.path = ""

        if(typeof api.basePath != "undefined"){
          method.path = api.basePath === "/" ? "" : api.basePath //remove first slash if basepath is "/"
        }
        method.path += e;

        if(method_pattern){
          method.friendly_name = method_pattern.replace(/{method}/g,method.http_verb.toUpperCase()).replace(/{path}/g,method.path);
        }else{
          method.friendly_name = slug(method.path.replace(/[/]/g,"_").substring(1)+"_"+method.http_verb.toUpperCase(),"_");
        }
        method.system_name = slug(method.friendly_name).replace(/_SLASH_/g,"/");
        methodsArr.push(method);
      }
    }
  }
  return methodsArr;
}

var extractMethodsFromSwagger = function (api,method_pattern){
  var methodsArr = [];
   for (var e in api.paths){
     for(var m in api.paths[e]){ //methods
       var method = api.paths[e][m];
       method.http_verb = m;
       if(!Array.isArray(method) || ALLOWED_METHODS.indexOf(method.http_verb.toUpperCase()) > -1){ //method obj should not be an array and the HTTP verb should be in the authorized list
        method.path = ""

        if(typeof api.basePath != "undefined"){
          method.path = api.basePath === "/" ? "" : api.basePath //remove first slash if basepath is "/"
        }
        method.path += e;

        if(method_pattern){
          method.friendly_name = method_pattern.replace(/{method}/g,method.http_verb.toUpperCase()).replace(/{path}/g,method.path);
        }else{
          method.friendly_name = slug(method.path.replace(/[/]/g,"_").substring(1)+"_"+method.http_verb.toUpperCase(),"_");
        }
        method.system_name = slug(method.friendly_name).replace(/_SLASH_/g,"/");
        methodsArr.push(method);
      }
     }
  }
  return methodsArr;
}

// A sample promise which takes an argument
function createMethodPromise(service_id, m) {
    return methods.createMethod(service_id, HIT_METRIC_ID, m.system_name, m.friendly_name).then(function(data){
      cli.print({message:"Method "+data.friendly_name.inverse+" with system_name "+data.system_name.inverse+" created on 3scale."});
      m["threescale"] = data //add threescale data about newly created method
      return data
    });
};

// A sample promise which takes an argument
function createMappingRulePromise(service_id,method,threescaleMethod) {
    return maprules.createMappingRule(service_id,method.http_verb.toUpperCase(),method.path,1,threescaleMethod.id).then(function(data){
        cli.print({message:"Mapping rule "+data.id.toString().inverse+" for pattern "+method.path.inverse+" created on 3scale."});
        return data
    });
};
