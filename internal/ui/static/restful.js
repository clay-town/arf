document.addEventListener("DOMContentLoaded", function() {
  createApplication();
  //statusCheck();
});


function createApplication(){
  // var x = document.getElementById("initial_nv");
  // var text = "";
  // var i;
  // for (i = 0; i < x.length ;i++) {
  //   text += x.elements[i].value + "<br>";
  // }
  button = document.getElementById("nv_submit");
  button.addEventListener("click", function(){
  benefit=document.getElementById("benefits").value;
  fname = document.getElementById("fname").value;
  lname = document.getElementById("lname").value;
  dob = document.getElementById("dob").value;
  tribalID = document.getElementById("tribalID").value;
  address = document.getElementById("address").value;
  zip = document.getElementById("zip").value;
  ssn = document.getElementById("ssn").value;
  console.log(benefit);
  console.log(fname);
  console.log(lname);
  console.log(dob);
  console.log(tribalID);
  console.log(address);
  console.log(zip);
  console.log(ssn);
  // grab your vars
  });
}

function getUrlVars() {
  var vars = {};
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
    vars[key] = value;
  });
  return vars;
}

function statusCheck(eligibilityCheckId = "62265B7E2DCFF1B7C9A1A47890A72E72E02F6341DED39B6784CC11D071182F3A") {
  var request = new XMLHttpRequest();
  console.log("status check js function");
  var url = "/status?eligibilityCheckId="+eligibilityCheckId;

  request.open('POST', url, true);
  request.onload = function(){
    var data = this.response;
    console.log(data);
    console.log(JSON.parse(data));
    
    }
    request.send();
}

// document.getElementById("nv_submit").addEventListener("click", function() {
//     alert("Hello World!");
//   });

// function viaJavaScript(eligibilityCheckId = "62265B7E2DCFF1B7C9A1A47890A72E72E02F6341DED39B6784CC11D071182F3A") {
//   var data = {};
//   var xhr = new XMLHttpRequest();
//   var url = "https://api.universalservice.org/nvca-svc/consumer/eligibility-check/62265B7E2DCFF1B7C9A1A47890A72E72E02F6341DED39B6784CC11D071182F3A/status"

//   //xhr.open(form.method, form.action, true);
//   xhr.open("post", url, true);
//   xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
//   xhr.setRequestHeader('accept-language', 'en-US,en;q=0.8');
//   xhr.setRequestHeader('authorization', APIKEY);
//   xhr.setRequestHeader('Access-Control-Request-Headers', 'Content-Type, Accept');
  

//   xhr.send(JSON.stringify(data))
//   xhr.onloadend = function () {
//     // do stuff here
//   }
// }

