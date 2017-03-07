var cli = require("./3scale-cli");
var config = require("./config");
var parrser = require("swagger-parser");
var Q = require("q");
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
exports.import = function(path,service_id, appplan_name, method_pattern){
  parrser.parse(path, function(err,api){
    if(err)
      cli.error({error:err});

    if(api){ //swagger valid file
      var title = api.info.title+Math.floor((Math.random() * 50) + 10);
      if(service_id){ //update existing service
        threescale_waterfall(api, service_id,appplan_name,method_pattern);
      }else{
        var ser = services.createService(title).then(function(s){
          var service_id =s.service.id;
          cli.print({message: "Service with id "+ service_id+" created on 3scale"});
          threescale_waterfall(api, service_id, appplan_name,method_pattern);
       });
     }

      cli.print({message: "Loading "+title+" swagger definition."});
    }
  });

};

var  threescale_waterfall= function(api, service_id, appplan_name,method_pattern){
  // appplan.createAppPlan(service_id,appplan_name).then(function(plan){
  //   var application_plan_id = plan.application_plan.id;
  //   cli.print({message: "Application plan with id "+ application_plan_id+" created on 3scale"});
  // }).then(function(){
  metrics.listMetrics(service_id)
  .then(function(metricList){
    cli.print({message: "Hits metric with id "+ metricList.metrics[0].metric.id+" found on 3scale"});
    HIT_METRIC_ID = metricList.metrics[0].metric.id;
    return metricList.metrics[0].metric.id;
  }).then(function(hit_metric_id){
    var methodsArr = [];
    for (var e in api.paths){
      for(var m in api.paths[e]){ //methods
        var method = api.paths[e][m];
        method.path = api.basePath+e;
        method.method = m;
        if(method_pattern){
          method.friendly_name = method_pattern.replace(/{method}/g,method.method.toUpperCase()).replace(/{path}/g,method.path);
        }else{
          method.friendly_name = slug(method.path.replace(/[/]/g,"_").substring(1)+"_"+method.method.toUpperCase(),"_");
        }
        method.system_name = slug(method.friendly_name).replace(/_SLASH_/g,"/");
        methodsArr.push(method);
      }
   }
   return methodsArr;
  }).then(function(methodsArr){
    var promisesArr = [];
    methodsArr.forEach(function(m){
      //Create methods
      promisesArr.push(methods.createMethod(service_id,HIT_METRIC_ID,m.system_name,m.friendly_name).then(function(data){
        cli.print({message:"Method "+data.friendly_name+" with system_name "+data.system_name+" created on 3scale."});
        m["threescale"]=data //add threescale data about newly created method
        return m;
      }));
    });
    return Q.all(promisesArr).then(function(responses){
      return responses
    });
 }).then(function(methods){
     var promisesArr = [];
     methods.forEach(function(m){
       promisesArr.push(maprules.createMappingRule(service_id,m.method.toUpperCase(),m.path,1,m.threescale.id).then(function(data){
         cli.print({message:"Mapping rule "+data.id+" for pattern "+m.path+" created on 3scale."});
         return data
      })); //end of .push
     })//end forEach

     return Q.all(promisesArr).then(function(responses){
       return responses;
     });
 }).done(function(){
   cli.success({message:"Import on 3scale complete"});
 });
};
