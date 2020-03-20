document.addEventListener("DOMContentLoaded", function() {
  statusCheck();
});

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

function viaJavaScript(eligibilityCheckId = "62265B7E2DCFF1B7C9A1A47890A72E72E02F6341DED39B6784CC11D071182F3A") {
  var data = {};
  var xhr = new XMLHttpRequest();
  var url = "https://api.universalservice.org/nvca-svc/consumer/eligibility-check/62265B7E2DCFF1B7C9A1A47890A72E72E02F6341DED39B6784CC11D071182F3A/status"

  //xhr.open(form.method, form.action, true);
  xhr.open("post", url, true);
  xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
  xhr.setRequestHeader('accept-language', 'en-US,en;q=0.8');
  xhr.setRequestHeader('authorization', APIKEY);
  xhr.setRequestHeader('Access-Control-Request-Headers', 'Content-Type, Accept');
  

  xhr.send(JSON.stringify(data))
  xhr.onloadend = function () {
    // do stuff here
  }

  // next thing to try: https://stackoverflow.com/questions/6255344/how-can-i-use-jquery-to-post-json-data
$(function(){
$.ajax({
        url:('https://api.universalservice.org/nvca-svc/consumer/eligibility-check/62265B7E2DCFF1B7C9A1A47890A72E72E02F6341DED39B6784CC11D071182F3A/status'),
        dataType:'json',
        type: 'post',
        data: {}.serialize(),
        success:function(response){
              console.log(response);
              // If your API returns something, you're going to proccess the data here.
        }
    });
});


}





