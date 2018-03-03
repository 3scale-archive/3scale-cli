var parser = require("raml-1-parser");
var cli = require("./3scale-cli");
var config = require("./config");
var Q = require("q");
var slug = require("slug");
var _ = require("underscore");

var slug = require("slug");
slug.charmap['{'] = '_'
slug.charmap['}'] = '_'
slug.charmap['\/'] = '_SLASH_'

var services = require("./services");
var appplan = require("./application_plans");
var metrics = require("./metrics");
var methods = require("./methods");

var METHOD_ARR=[]
var RESOURCESTYPES={}
var api

if (exports.allowinsecure == 'Y' || exports.allowinsecure == 'y'){
  	process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}


exports.import = function(path, service_id, appplan_name,method_pattern){
  api = parser.loadApiSync(path);
  var title = api.title()+Math.floor((Math.random() * 50) + 10);

  cli.print({message: "Loading "+title+ " raml definition."});

  if(service_id){ //update existing service
    threescale_waterfall(api, service_id,appplan_name,method_pattern);
  }else{
    var ser = services.createService(title).then(function(s){
      var service_id = s.service.id;
      cli.print({message: "Service with id "+ service_id+" created on 3scale"});
      threescale_waterfall(api, service_id, appplan_name,method_pattern);
   });
 }
}

var  threescale_waterfall= function(api, service_id, appplan_name,method_pattern){
  appplan.getPlan(service_id,appplan_name).then(function(plan){
    if(plan)
      return;
    return appplan.createAppPlan(service_id,appplan_name).then(function(plan){
        var application_plan_id = plan.application_plan.id;
        cli.print({message: "Application plan with id "+ application_plan_id+" created on 3scale"});
    })
  })
  .then(function(){ // load and store resourceTypes
    api.resourceTypes().forEach(function(r){
      RESOURCESTYPES[r.name()]=[]
      r.methods().forEach(function(m){
            RESOURCESTYPES[r.name()].push(m.method())
      })
    })
  })
  .then(function(){
    return metrics.listMetrics(service_id);
  })
  .then(function(metricList){
    cli.print({message: "Hits metric with id "+ metricList.metrics[0].metric.id+" found on 3scale"});
    HIT_METRIC_ID = metricList.metrics[0].metric.id;
    return metricList.metrics[0].metric.id;
  }).then(function(hit_metric_id){
    var methodsArr = [];
    var methodsArr = [];
    var apiResources = api.resources();
    var promises = [];
    for (var i =0; i<apiResources.length;i++) {
      promises.push(exploreResource(apiResources[i],method_pattern)); // push the Promises to our array
    }
    return Q.all(promises);
  }).then(function(){
    var promisesArr = [];
    METHOD_ARR.forEach(function(m){
      promisesArr.push(methods.createMethod(service_id,HIT_METRIC_ID,m.system_name,m.friendly_name).then(function(data){
        cli.print({message:"Method "+data.friendly_name+" with system_name "+data.system_name+" created on 3scale."});
        }));
    });
    return Q.all(promisesArr); //aray of promises
 }).then(function(a){
    cli.success({message:"Import on 3scale complete"});
 }).done();
};


var exploreResource = function(resource,method_pattern){
  var arr = []
  if(resource.resources().length>0){ //explore recursively
    for (var i =0; i<resource.resources().length;i++) {
      exploreResource(resource.resources()[i],method_pattern); // push the Promises to our array
    }
  }
  if(resource.methods().length>0){
    var methods = resource.methods()
    for (var i =0; i<methods.length;i++) {
      var m = methods[i]
      var method = {}
      var re = new RegExp(api.baseUri().value(),"g");
      method.path = resource.absoluteUri().replace(re,'');
      method.method = m.method();
      if(method_pattern){
        method.friendly_name = method_pattern.replace(/{method}/g,method.method.toUpperCase()).replace(/{path}/g,method.path);
      }else{
        method.friendly_name = method.method.toUpperCase()+'_'+method.path
      }
      method.system_name = slug(method.friendly_name);
      METHOD_ARR.push(method);
    }
  }
  if(resource.resources().length==0 && resource.methods().length==0 && resource.type()){ // no children, no method but resourceTypes
    RESOURCESTYPES[resource.type().name()].forEach(function(r){ //FIXME refactor
      var method = {}
      var re = new RegExp(api.baseUri().value(),"g");
      method.path = resource.absoluteUri().replace(re,'');
      method.method = r;
      if(method_pattern){
        method.friendly_name = method_pattern.replace(/{method}/g,method.method.toUpperCase()).replace(/{path}/g,method.path);
      }else{
        method.friendly_name = method.method.toUpperCase()+'_'+method.path
      }
      method.system_name = slug(method.friendly_name);
      METHOD_ARR.push(method);
    })
  }

  return true;
}
