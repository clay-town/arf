document.addEventListener("DOMContentLoaded", function() {
  createApplication();
  statusCheck();
  submitApplication();
  sendUserToManyChatFlowAfterApplicationCreation();
  checkServiceAvailability()
  getPlanId();
  createCustomer();
  clearFields();
});

function createCustomer() {
  button = document.getElementById("vcare_submit");

  button.addEventListener("click", function(){
    console.log("create customer js function");
    var zipCode = document.getElementById("vcare_zip_a").value;
    var state = document.getElementById("get_plan_state").value;
    var tribal = document.getElementById("vcare_tribal").value;
    var planId = document.getElementById("vcare_plan_id").value;
    var enrollmentId = document.getElementById("enrollment_id_b").value;
    var fname = document.getElementById("vcare_fname").value;
    var mname = document.getElementById("vcare_mname").value;
    var lname = document.getElementById("vcare_lname").value;
    var dob = document.getElementById("vcare_dob").value;
    var tribalId = document.getElementById("vcare_tribal_ID").value;
    var preffContact= document.getElementById("vcare_preff_contact").value;
    var address = document.getElementById("vcare_address").value;
    var city = document.getElementById("vcare_city").value;
    var ssn = document.getElementById("vcare_ssn").value;
    var photoId = document.getElementById("vcare_photoID").value;
    var pob = document.getElementById("vcare_insurance").value;
    var programCode = document.getElementById("vcare_benefits").value.split(' ')[1]
    var refNumber = uniqueIdentifierGenerator();
    console.log(programCode);
    console.log(refNumber)

    if(document.getElementById("shipping_physical").checked){
      var shipping_address = address;
      var shipping_city = city;
      var shipping_state = state;
      var shipping_zip = zip;
    }else{
      var shipping_address = document.getElementById("vcare_shipping_address");
      var shipping_city = document.getElementById("vcare_shipping_city");
      var shipping_state = document.getElementById("vcare_shipping_state");
      var shipping_zip = document.getElementById("vcare_shipping_zip");
    }

    // make call to another function that can encode the photos


    var request = new XMLHttpRequest();
    
    var url = "/createcustomer?zipcode="+zipCode+"&state="+state+"&tribal="+tribal+"&planid="+planId
            +"&enrollmentId="+enrollmentId+"&fname="+fname+"&mname="+mname+"&lname="+lname+"&dob="+dob
            +"&tribalid="+tribalId+"&preffcontact="+preffContact+"&address="+address+"&city="+city
            +"&ssn="+ssn+"&programcode="+programCode+"&shipping_address="+shipping_address
            +"&shipping_city="+shipping_city+"&shipping_state="+shipping_state+"&shipping_zip="
            +shipping_zip+"&refNumber="+refNumber;

    request.open('POST', url, true);
    request.onload = function(){
      var data = this.response;
      console.log(data);
      
      response=JSON.parse(data);
      console.log(response);

      parser = new DOMParser();
      xmlDoc = parser.parseFromString(response,"text/xml");

      description = xmlDoc.getElementsByTagName("description")[0].innerHTML
      document.getElementById("final_display_window").innerHTML = "Description: " + description

      if(description == "SUCCESS") {
          
        document.getElementById("error_final_display_window").innerHTML = ""
      } else if(description == "FAIL"){
        errorDescription = xmlDoc.getElementsByTagName("errorDescription")[0].innerHTML
        document.getElementById("error_final_display_window").innerHTML = "Error Description: " + errorDescription;
      }
      console.log(response)
      }
    request.send();

  });
}

function getPlanId() {
  button = document.getElementById("plan_id_submit");

  button.addEventListener("click", function(){
    console.log("get plan id js function");
    var zipCode = document.getElementById("vcare_zip_a").value;
    var tribal = "N"
    var state = document.getElementById("get_plan_state").value;

    if(document.getElementById("vcare_tribal").checked){
      tribal = "Y"
    }

    var request = new XMLHttpRequest();
    var url = "/getplan?zipcode="+zipCode+"&tribal="+tribal+"&state="+state;

    request.open('POST', url, true);
    request.onload = function(){
      var data = this.response;
      console.log(data);
      response=JSON.parse(data);
      console.log(response);

      parser = new DOMParser();
      xmlDoc = parser.parseFromString(response,"text/xml");

      description = xmlDoc.getElementsByTagName("description")[0].innerHTML
      document.getElementById("plan_id").innerHTML = "Description: " + description

      if(description == "SUCCESS") {
          // iterate through plan names, looking to match based on hierarchy we get from cheesecake
          // if i understand correctly, "TRUEMETRO" is the plan name I want
          // planid = 
        document.getElementById("get_plan_error_description").innerHTML = "Plan ID: 16"
        document.getElementById("vcare_plan_id").value = "16"
      } else if(description == "FAIL"){
        errorDescription = xmlDoc.getElementsByTagName("errorDescription")[0].innerHTML
        document.getElementById("get_plan_error_description").innerHTML = "Error Description: " + errorDescription;
      }
      console.log(response)
      }
    request.send();
  });
}

function checkServiceAvailability(){
  button = document.getElementById("check_sevice_submit");
  button.addEventListener("click", function(){
    console.log("check_service js function");
    var zipCode = document.getElementById("vcare_zip_a").value;
    var request = new XMLHttpRequest();
    var url = "/checkservice?zipcode="+zipCode;

    request.open('POST', url, true);
    request.onload = function(){
      var data = this.response;
      obj=JSON.parse(data)
      parser = new DOMParser();

      xmlDoc = parser.parseFromString(obj,"text/xml");

      description = xmlDoc.getElementsByTagName("description")[0].innerHTML
      document.getElementById("check_service").innerHTML = "Description: " + description

      if(description == "SUCCESS") {
        enrollmentId = xmlDoc.getElementsByTagName("enrollmentId")[0].innerHTML
        document.getElementById("enrollment_id_a").innerHTML = "Enrollment Id: " + enrollmentId
        document.getElementById("enrollment_id_b").value = enrollmentId
      } else if(description == "FAIL"){
        errorDescription = xmlDoc.getElementsByTagName("errorDescription")[0].innerHTML
        document.getElementById("enrollment_id_a").innerHTML = "Error Description: " + errorDescription;
      }
      console.log(obj)
      }
    request.send();
  });
}


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


    if(document.getElementById("user_consent").checked){
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
    }else{
      document.getElementById("nv_status").innerHTML = "Must get user consent before submitting";
    }

    

  });
}

function sendUserToManyChatFlowAfterApplicationCreation(){
  button = document.getElementById("send_user_flow");

  button.addEventListener("click", function(){
    manychatID = document.getElementById("senduser_manychatID").value;

    var request = new XMLHttpRequest()
    var url = "https://hooks.zapier.com/hooks/catch/2550009/o1cb0a0?manychatid="+manychatID;

    request.open('POST', url, true);
    request.send();
    document.getElementById("sent_status").innerHTML = "Application form sent to user!";
  });

}


function statusCheckResponse(response){
  response = JSON.parse(response);
  if(response.status ==  "BAD_REQUEST"){
    document.getElementById("status").innerHTML = "Application Status: " + response.status;
  } else if(response.status == "IN_PROGRESS" || response.status == "PENDING_REVIEW "){
    document.getElementById("status").innerHTML = "Application Status: " + response.status;
  }else if(response.status == "PENDING_CERT" || response.status == "PENDING_ELIGIBILITY" || response.status == "PENDING_RESOLUTION"){
    document.getElementById("status").innerHTML = "Application Status: " + response.status +" Please resend form to user.";
  }else{
     document.getElementById("status").innerHTML = "Application Status: " + response.message;
  }
}

function statusCheck() {
  button = document.getElementById("status_submit");

  button.addEventListener("click", function(){
    var eligibilityCheckId = document.getElementById("status_check_id").value;
    var request = new XMLHttpRequest();
    console.log("status check js function");
    var url = "/status?eligibilityCheckId="+eligibilityCheckId;

    request.open('POST', url, true);
    request.onload = function(){
      var data = this.response;
      console.log(data);
      response=JSON.parse(data);
      console.log(response.message);
      statusCheckResponse(response);
      console.log(JSON.parse(response).status);
      console.log(JSON.parse(data));
      
      }
      request.send();

  });
}

function displayShippingFields(){
    document.getElementById("shipping_form").style.visibility = "hidden";
}

function uniqueIdentifierGenerator(){
  var seconds = new Date().getTime() / 1000;
  return Math.trunc(seconds);
}

function clearFields(){
  button = document.getElementById("clear");

  button.addEventListener("click", function(){
    document.getElementById('inital_nv').reset();
    document.getElementById('manychatID_form').reset();
    document.getElementById('status_form').reset();
    document.getElementById('submit_vcare_form').reset();

  });
}

/**
 * convertImgToBase64
 * @param  {String}   url
 * @param  {Function} callback
 * @param  {String}   [outputFormat='image/png']
 * @author HaNdTriX
 * @example
  convertImgToBase64('http://goo.gl/AOxHAL', function(base64Img){
    console.log('IMAGE:',base64Img);
  })
 */
function convertImgToBase64(url, callback, outputFormat){
  var canvas = document.createElement('CANVAS');
  var ctx = canvas.getContext('2d');
  var img = new Image;
  img.crossOrigin = 'Anonymous';
  img.onload = function(){
    canvas.height = img.height;
    canvas.width = img.width;
      ctx.drawImage(img,0,0);
      var dataURL = canvas.toDataURL(outputFormat || 'image/png');
      //console.log(dataURL);
      document.getElementById("status").innerHTML = dataURL;
    return(dataURL);
  };
}




function submitApplication(){
  button = document.getElementById("vcare_submit");

  button.addEventListener("click", function(){
    var photoID = document.getElementById("vcare_photoID").value;


    console.log("vcare submit button pushed");
    console.log(convertImgToBase64(photoID, function(base64Img){
    }));
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

