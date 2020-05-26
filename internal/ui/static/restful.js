document.addEventListener("DOMContentLoaded", function() {
  statusCheck();
});

function statusCheckResponse(response, manychatID){
  response = JSON.parse(response);
  if(response.status ==  "BAD_REQUEST"){
    document.getElementById("status").innerHTML = "Application Status: "+response.status;
  } else if(response.status == "IN_PROGRESS" || response.status == "PENDING_REVIEW "){
    document.getElementById("status").innerHTML = "Application Status: "+response.status;
  }else if(response.status == "PENDING_CERT" || response.status == "PENDING_ELIGIBILITY"){
    document.getElementById("status").innerHTML = "Application Status: " + response.status + " Please resend form to user.";
  }else if(response.status == "PENDING_RESOLUTION"){
    document.getElementById("status").innerHTML = "Application Status: " + response.status + " Please resend form to user.";
    errors = "";
    for(i in response.failures){
      errors += "\n" + response.failures[i]+"\n";
    }
    document.getElementById("status_failures").innerHTML = "ERRORS: " + errors;
  }else if(response.status == "COMPLETE"){
    document.getElementById("status").innerHTML = "Application Status: "+response.status;
    addTagToUser(manychatID, Step_3_Completed);
  }else{
     document.getElementById("status").innerHTML = "Application Status: " + response.message;
  }
}

function statusCheck() {
  button = document.getElementById("status_submit");

  button.addEventListener("click", function(){
    document.getElementById("status").innerHTML="";
    document.getElementById("status_failures").innerHTML="";

    var eligibilityCheckId = document.getElementById("status_check_id").value;
    var manychatID = document.getElementById("status_manychatID").value;

    var request = new XMLHttpRequest();
    console.log("status check js function");
    var url = "/status?eligibilityCheckId="+eligibilityCheckId;

    request.open('POST', url, true);
    request.onload = function(){
      var data = this.response;
      
      // console.log(JSON.parse(JSON.parse(data)));
      // response=JSON.parse(data);
      // statusCheckResponse(response, manychatID);  
    }
    request.send();
  });
}
