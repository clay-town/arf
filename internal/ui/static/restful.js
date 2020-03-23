document.addEventListener("DOMContentLoaded", function() {
  createApplication();
  statusCheck();
  submitApplication();
  sendUserToManyChatFlowAfterApplicationCreation();
});

function sendEligibilityToManyChat(eligibilityCheckId, manychatID, fname, lname, tribalid, address, city, state, zip, ssn){
  var request = new XMLHttpRequest()
  var url = "https://hooks.zapier.com/hooks/catch/2550009/o1co8fq?manychatid="+manychatID+"&eligibilityCheckId="+eligibilityCheckId+"&fname="+fname+"&lname="+lname+"&tribalid="+tribalid+"&address="+address+"&city="+city+"&state="+state+"&zip="+zip+"&ssn="+ssn;

  request.open('POST', url, true);
  request.send();
}

function applicationResponse(nv_response, manychatID, fname, lname, tribalid, address, city, state, zip, ssn) {
  var status = "";
  var eligibilityCheckId = "";
  eligibilityCheckId = nv_response.eligibilityCheckId;
  status = nv_response.status;
  if(status == "BAD_REQUEST"){
    document.getElementById("nv_status").innerHTML = "National Verifier Status: " + status;
    errors = "";
    for(i in nv_response.errors){
      errors += "\n" + nv_response.errors[i].code + "\t" + nv_response.errors[i].field +"\n";
    }
    document.getElementById("nv_errors").innerHTML = "ERRORS: " + errors;
    
  }else if(status == "PENDING_RESOLUTION" || status == "PENDING_ELIGIBILITY") {
    document.getElementById("nv_status").innerHTML = "National Verifier Status: " + status;
    document.getElementById("nv_eligibility_id").innerHTML = "eligibilityCheckId:" + eligibilityCheckId;
    errors = "";
    for(i in nv_response.failures){
      errors += "\n" + nv_response.failures[i] +"\n";
    }
    document.getElementById("nv_errors").innerHTML = "ERRORS: " + errors;
    sendEligibilityToManyChat(eligibilityCheckId, manychatID, fname, lname, tribalid, address, city, state, zip, ssn);

  }else if(status == "PENDING_CERT" || status == "APP_NOT_FOUND" || status == "IN_PROGRESS "){
    document.getElementById("nv_status").innerHTML = "National Verifier Status: " + status;
    document.getElementById("nv_eligibility_id").innerHTML = "eligibilityCheckId:" + eligibilityCheckId;
    sendEligibilityToManyChat(eligibilityCheckId, manychatID, fname, lname, tribalid, address, city, state, zip, ssn);

  }else if(status == "COMPLETE" || status == "PENDING_REVIEW" ){
    document.getElementById("nv_status").innerHTML = "National Verifier Status: " + status;
    document.getElementById("nv_eligibility_id").innerHTML = "eligibility CheckId:" + eligibilityCheckId;
    document.getElementById("nv_errors").innerHTML = "eligibility Expiration Date:" + nv_response.eligibilityExpirationDate;
    sendEligibilityToManyChat(eligibilityCheckId, manychatID, fname, lname, tribalid, address, city, state, zip, ssn);

  }else if(status == "INTERNAL_SERVER_ERROR"){
    document.getElementById("nv_status").innerHTML = "National Verifier Status: " + status;
    document.getElementById("nv_errors").innerHTML = nv_response.message;
  }
}


function createApplication(){
  button = document.getElementById("nv_submit");

  button.addEventListener("click", function(){
    benefit=document.getElementById("benefits").value;
    manychatid = document.getElementById("manychatID").value;
    fname = document.getElementById("fname").value;
    lname = document.getElementById("lname").value;
    dob = document.getElementById("dob").value;
    tribalid = document.getElementById("tribalID").value;
    address = document.getElementById("address").value;
    city = document.getElementById("city").value;
    state = document.getElementById("state").value;
    zip = document.getElementById("zip").value;
    ssn = document.getElementById("ssn").value;

    var request = new XMLHttpRequest();
    console.log("create app js function");
    var url = "/createapplication?benefit="+benefit+"&fname="+fname+"&lname="+lname+"&dob="+dob+"&tribalid="+tribalid+"&address="+address+"&city="+city+"&state="+state+"&zip="+zip+"&ssn="+ssn;

    request.open('POST', url, true);
    request.onload = function(){
      var data = this.response;
      console.log("raw data:");
      console.log(data);
      first_parse =JSON.parse(data);
      console.log("data parsed once:");
      console.log(first_parse);
      second_parse = JSON.parse(first_parse);
      console.log("data parsed twice:");
      console.log(second_parse);
      applicationResponse(second_parse, manychatid, fname, lname, tribalid, address, city, state, zip, ssn);
    }
    request.send();

  });
}

function sendUserToManyChatFlowAfterApplicationCreation(){
  button = document.getElementById("send_user_flow");

  button.addEventListener("click", function(){
    manychatid = document.getElementById("senduser_manychatID").value;

    var request = new XMLHttpRequest()
    var url = "https://hooks.zapier.com/hooks/catch/2550009/o1cb0a0?manychatid="+manychatID;

    request.open('POST', url, true);
    request.send();
    document.getElementById("sent_status").innerHTML = "Application form sent to user!";
  });

}


function statusCheck(eligibilityCheckId = "62265B7E2DCFF1B7C9A1A47890A72E72E02F6341DED39B6784CC11D071182F3A") {
  button = document.getElementById("status_submit");

  button.addEventListener("click", function(){
    var request = new XMLHttpRequest();
    console.log("status check js function");
    var url = "/status?eligibilityCheckId="+eligibilityCheckId;

    request.open('POST', url, true);
    request.onload = function(){
      var data = this.response;
      console.log(data);
      obj=JSON.parse(data)
      document.getElementById("status").innerHTML = "Application Status: " + JSON.parse(obj).message;
      console.log(JSON.parse(data));
      
      }
      request.send();

  });
}

function submitApplication(){
  button = document.getElementById("vcare_submit");

  button.addEventListener("click", function(){
      //TO DO

  });
}



// function getUrlVars() {
//   var vars = {};
//   var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
//     vars[key] = value;
//   });
//   return vars;
// }


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

