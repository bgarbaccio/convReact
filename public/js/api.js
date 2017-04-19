// The Api module is designed to handle all interactions with the server

var Api = (function() {
  var requestPayload;
  var responsePayload;
  var messageEndpoint = '/api/message';

  // Publicly accessible methods defined
  return {
    sendRequest: sendRequest,

    // The request/response getters/setters are defined here to prevent internal methods
    // from calling the methods without any of the callbacks that are added elsewhere.
    getRequestPayload: function() {
      return requestPayload;
    },
    setRequestPayload: function(newPayloadStr) {
      requestPayload = JSON.parse(newPayloadStr);
    },
    getResponsePayload: function() {
      return responsePayload;
    },
    setResponsePayload: function(newPayloadStr) {
      responsePayload = JSON.parse(newPayloadStr);
    }
  };


 // gets the params in the URL
 function urlParam(name) {
  var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href)
  if (!results){
    return null
  }else{
    return results[1] || 0
  }
    
};

//splits a phrase in two, separator ":". removes the last caracter from the second part (here it is a "/")
function splitProblem(problem){
  var res = problem.split(':');
  var def =res[0];
  var phrase=res[1];
  phrase = phrase.substring(0,phrase.length-1);
  return {def :def, phrase: phrase};
}

//function used to process the JSON file of the page "targetURLprob"
function probDefinitionCBprob(targetURLprob) {

  // intialize a query selector to simplify the requests
  return new Promise(function (resolve, reject) {
    $.getJSON(targetURLprob).done(function(data) {
      //$.get('/pbDefcallback', { targeturl:targetURLprob }, function(req,res){
      //  console.log("req: " + req + "\nres: " + res)
      //}).done(function(data) {
      var querySelector = data.QueryMXWOResponse.MXWOSet.WORKORDER[0].Attributes
      // assign values to previously initialize variables
      // this should be done by checking particular fields in the workorder
      // parsing the strings is just a workaround and shouldn't be used in production
      var desc = querySelector.DESCRIPTION.content.toLowerCase()
      resolve(desc);
    })
  } ) 
}

// //function used to process the JSON file of the page "targetURL"
// function probDefinitionCBjobplan(targetURLjobplan) {

//   // intialize a query selector to simplify the requests
//   return new Promise(function (resolve, reject) {

//     probDefinition().then(function(probdef){
//       var prob = splitProblem(probdef)
//       console.log("def")
//       console.log(prob.def)
//       console.log("phrase")
//       console.log(prob.phrase)

//       var appliance = new Array("anemometer", "blade", "brake", "controller", "gearbox", "generator", "nacelle", "pitch", "rotor", "tower", "wind vane", "yaw drive", "yaw motor");
//       for(var i =0; i <= appliance.length; i++){
//         if(prob.phrase.indexOf(appliance[i]) >= 0){
//           var keyword = appliance[i];
//         }
//       }
//       $.getJSON(targetURLjobplan).done(function(data) {
//       var jobvect=  data.QueryJOBPLANResponse.JOBPLANSet.JOBPLAN
//       var count= jobvect.length;

//       //matrix that will contain all the different job plans info
//       //[jp1num jp1desc]
//       //[jp2num jp2desc] ... 
//       var alljobp= new Array;
//       //We are going through all the job plans and looking for the ones that are active
//       //if a jobplan is active, we are checking if the description contains the keyword variable
//       //this keyword is the faulty appliance (for example gearbox). We are then saving 
//       //the job plan numbers and the descriptions 
//       for(var i=0; i<count; i++){
//         var querySelector = data.QueryJOBPLANResponse.JOBPLANSet.JOBPLAN[i]
//         var jobpinfo= new Array;
//         if(querySelector.Attributes.DESCRIPTION.content.toLowerCase().indexOf(keyword) >= 0 ){
//           if (querySelector.Attributes.STATUS.content == "ACTIVE") {
//             jobpinfo[0] = querySelector.Attributes.JPNUM.content;
//             console.log("job plan number")
//             console.log(jobpinfo[0])
//             jobpinfo[1] = querySelector.Attributes.DESCRIPTION.content;
//             console.log("job plan desc")
//             console.log(jobpinfo[1])
//             alljobp[i]=jobpinfo
//             console.log(alljobp)
//           }
//         }
//       }
//       console.log("job plans")
//       console.log(alljobp)
//       resolve(jobplan);
//       })
//     })
//   })
// }




function probDefinition(){
//initializing parameters we need in the url address 
    woID=urlParam('wonum')
    user = decodeURIComponent(urlParam('user'))
    farmID = urlParam('location')
    assetID = urlParam('assetnum')
    siteID = urlParam('siteid')

    //var targetURLprob ='http://cap-sg-prd-1.integration.ibmcloud.com:15308/maxrest/rest/os/MXWO?WONUM=' + woID + '&location=' + farmID + '&_lid=windadmin&_lpwd=windadmin&_format=json&callback=?'
    var targetURLjobplan= 'http://cap-sg-prd-1.integration.ibmcloud.com:15308/maxrest/rest/os/jobplan?SITEID='+ siteID +'&_lid=windadmin&_lpwd=windadmin&_format=json&callback=?'
    //var targetURLprob ='http://cap-sg-prd-1.integration.ibmcloud.com:15954/maxrest/rest/os/MXWO?WONUM=' + woID + '&location=' + farmID + '&_lid=windadmin&_lpwd=windadmin&_format=json&callback=?'
    var targetURLprob ='http://92.103.147.95/maxrest/rest/os/MXWO?WONUM=' + woID + '&location=' + farmID + '&_lid=windadmin&_lpwd=windadmin&_format=json&callback=?'
    
  return new Promise(function (resolve, reject) {
    //the promise contained in probDefinitionCB is resolved when the information is 
    //extracted from the JSON file.
    //the result (desc) is saved in the variable called res. 
    //probDefinitionCBjobplan(targetURLjobplan, "earbox").then( function(res) {
    probDefinitionCBprob(targetURLprob).then( function(res) {
      console.log("res");
      console.log(res);
      resolve(res);
    })
  });
  

}


  // Send a message request to the server
  function sendRequest(text, context) {

    // Build request payload
    var payloadToWatson = {};
    if (text) {
      payloadToWatson.input = {
        text: text
      };
    }
    
    //The promise contained in probDefinition is resolved here. 
    //This process helps us avoid asynchronicity issues. The result is saved in the "problem" variable
    probDefinition().then( function(problem) {
    var prob = splitProblem(problem)
    console.log("def")
    console.log(prob.def)
    console.log("phrase")
    console.log(prob.phrase)

    if (context) {
      console.log("context");
      console.log(context);
      payloadToWatson.context = context;
    }else{
      // initializes variables based on the parameters in the url
      var newcontext = {};
      newcontext.woID=urlParam('wonum');
      var user = decodeURIComponent(urlParam('user')).split(' ');
      newcontext.username = user[0];
      newcontext.userfamname=user[1];
      newcontext.farmID = urlParam('location');
      newcontext.assetID = urlParam('assetnum');
      newcontext.siteid= urlParam('siteid');
      newcontext.problemType = prob.def;
      newcontext.problemPhrase = prob.phrase;
      // newcontext.lang = urlParam('lang')
      payloadToWatson.context = newcontext;
    }

    // Built http request
    var http = new XMLHttpRequest();
    http.open('POST', messageEndpoint, true);
    http.setRequestHeader('Content-type', 'application/json');
    http.onreadystatechange = function() {
      if (http.readyState === 4 && http.status === 200 && http.responseText) {
        Api.setResponsePayload(http.responseText);
      }
    };

    var params = JSON.stringify(payloadToWatson);
    // Stored in variable (publicly visible through Api.getRequestPayload)
    // to be used throughout the application
    if (Object.getOwnPropertyNames(payloadToWatson).length !== 0) {
      Api.setRequestPayload(params);
    }

    // Send request
    http.send(params);
    });
    
  }

}());
