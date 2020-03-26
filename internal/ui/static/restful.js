document.addEventListener("DOMContentLoaded", function() {
  createApplication();
  statusCheck();
  sendUserToManyChatFlowAfterApplicationCreation();
  checkServiceAvailability()
  getPlanId();
  createCustomer();
  clearFields();
  uploadProof();
  //uploadURLs();
  userConsent();
});

var Step_1_Completed = 16950972;
var Step_2_Completed = 16950974;
var Step_3_Completed = 16950977;
var Step_4_Completed = 16950982;
var Step_5_Completed = 16950986;

var mc_address = 2865544;
var mc_city = 2865546;
var mc_dob = 2865548;
var mc_enrollmentID = 3079819;
var mc_fname =2865542;
var mc_lname = 2865543;
var mc_ssn = 2865723;
var mc_state = 2865545;
var mc_tribalID = 2865742;
var mc_zip = 2865547;
var mc_eligibility_checkID = 2853139;
var mc_eligibility_exp = 2853143;
var mc_nv_status = 2853140;


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

function uploadURLs() {
  button = document.getElementById("upload_all_button");
  button.addEventListener("click", function(){
    var photo_id = document.getElementById("vcare_photoID").value;
    var pob = document.getElementById("vcare_pob").value;
    var additional_proof = document.getElementById("vcare_additional_proof").value;

    var request = new XMLHttpRequest();
    console.log("upload URLs js function");
    var url = "/uploadurl?photoid="+photo_id+"&pob="+pob+"&additional_proof="+additional_proof;

    request.open('POST', url, true);
    request.onload = function(){
      var data = this.response;
      response=JSON.parse(data);
      statusCheckResponse(response);     
    }
    request.send();
  });
}


function convertImgToBase64(url, output){
  console.log("conver to base parent function")
  var canvas = document.createElement('CANVAS');
  var ctx = canvas.getContext('2d');
  var img = new Image;
  img.crossOrigin = 'Anonymous';
  img.onload = function(){
    console.log("conver to base Anonymous function")
    canvas.height = img.height;
    canvas.width = img.width;
      ctx.drawImage(img,0,0);
      var dataURL = canvas.toDataURL('image/png');
      if(output == "ap") {
        document.getElementById('additional_proof_output').value = dataURL  
        console.log("ap set")
      } else if(output == "id") {
        document.getElementById('photo_id_output').value = dataURL
        console.log("photo id set")
      } else if(output == "pob"){
        document.getElementById('pob_output').value = dataURL
        console.log("pob set")
      }    
      canvas = null; 
  };
  img.src = url;
}


function uploadProof() {
  button = document.getElementById("upload_all_button");
  button.addEventListener("click", function(){
    document.getElementById("photo_id_status").innerHTML = "";
    document.getElementById('pob_status').innerHTML = "please wait...";
    document.getElementById("upload_all_button").disabled = true;

    console.log("upload all photos function");

    var photoId= document.getElementById("vcare_photoID").value;
    var pob = document.getElementById("vcare_pob").value;
    var additionalProof = document.getElementById("vcare_additional_proof").value;
    var enrollmentId = document.getElementById("photo_enrollment_id").value;
    var manychatID = document.getElementById("photo_manychat").value;
    const wait=ms=>new Promise(resolve => setTimeout(resolve, ms)); 

    console.log("deeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeebug")
    convertImgToBase64(additionalProof, "ap");
    convertImgToBase64(photoId, "id");
    convertImgToBase64(pob, "pob");    
    
    wait(4*1000).then(() => { 
      additionalProof = document.getElementById("additional_proof_output").value
      photoId = document.getElementById("photo_id_output").value
      pob = document.getElementById("pob_output").value
      
      uploadPhotoID(photoId, enrollmentId)
      uploadPOB(pob, enrollmentId)
      uploadProofVcare(additionalProof, enrollmentId)
      addTagToUser(manychatID, Step_5_Completed);
      console.log(photoId)
    })
  });
}

function uploadPhotoID(photoId, enrollmentId){
  var request = new XMLHttpRequest();
  //var url = "/uploadphotoid?photoid="+photoId+"&enrollmentid="+enrollmentId;
  var url = "/uploadphotoid?enrollmentid="+enrollmentId;
  sendBase64ToServer(url, photoId)
}

function uploadPOB(pob, enrollmentId){
  var request = new XMLHttpRequest();
  var url = "/uploadpob?&enrollmentid="+enrollmentId;
  sendBase64ToServer(url, enrollmentId)
}

function uploadProofVcare(additionalProof, enrollmentId){
  var request = new XMLHttpRequest();
  var url = "/uploadproof?&enrollmentid="+enrollmentId;
  sendBase64ToServer(url, enrollmentId)
}

var sendBase64ToServer = function(url, base64){
    var httpPost = new XMLHttpRequest(),
        path = url
        data = JSON.stringify({image: base64});
        httpPost.onload = function(){
          var response_data = this.response;
          response = JSON.parse(response_data);
          parser = new DOMParser();
          xmlDoc = parser.parseFromString(response,"text/xml");

          description = xmlDoc.getElementsByTagName("description")[0].innerHTML
          document.getElementById('pob_status').innerHTML = "";
          document.getElementById("upload_all_button").disabled = false;

          if(description == "SUCCESS") {  
            compositeString = document.getElementById("photo_id_status").innerHTML + "<br>"
            document.getElementById("photo_id_status").innerHTML = compositeString + description
          } else if(description == "FAIL"){
            compositeString = document.getElementById("photo_id_status").innerHTML + "<br>"
            errorDescription = xmlDoc.getElementsByTagName("errorDescription")[0].innerHTML + "<br>"
            document.getElementById("photo_id_status").innerHTML = compositeString + errorDescription
          }
        };

        httpPost.open("POST", path, true);
        httpPost.setRequestHeader('Content-Type', 'application/json');
        httpPost.send(data);
};

function createCustomer() {
  button = document.getElementById("vcare_submit");
  button.addEventListener("click", function(){
    document.getElementById("final_display_window").innerHTML="";
    document.getElementById("error_final_display_window").innerHTML="";

    console.log("create customer js function");
    var zipCode = document.getElementById("vcare_zip_a").value;
    var state = document.getElementById("get_plan_state").value;
    var tribal = document.getElementById("vcare_tribal").value;
    var planId = document.getElementById("plan_id_options").value;
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
    var programCode = document.getElementById("vcare_benefits").value.split(' ')[1]
    var manychatID = document.getElementById("enrollment_manychat").value;
    var refNumber = uniqueIdentifierGenerator();

    if(document.getElementById("shipping_physical").checked){
      var shipping_address = address;
      var shipping_city = city;
      var shipping_state = state;
      var shipping_zip = zipCode;
    }else{
      var shipping_address = document.getElementById("vcare_shipping_address");
      var shipping_city = document.getElementById("vcare_shipping_city");
      var shipping_state = document.getElementById("vcare_shipping_state");
      var shipping_zip = document.getElementById("vcare_shipping_zip");
    }

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
            
      response=JSON.parse(data);
      
      parser = new DOMParser();
      xmlDoc = parser.parseFromString(response,"text/xml");

      description = xmlDoc.getElementsByTagName("description")[0].innerHTML
      document.getElementById("final_display_window").innerHTML = "Description: " + description
    
      if(description == "SUCCESS") {
        addTagToUser(manychatID, Step_4_Completed);

        var request = new XMLHttpRequest()
        var url = "https://hooks.zapier.com/hooks/catch/2550009/o1j9i4n/?manychatid=" +manychatID;

        request.open('POST', url, true);
        request.send();

        // var request = new XMLHttpRequest()
        // var url = "https://hooks.zapier.com/hooks/catch/2550009/o1co8fq?manychatid="+manychatID+"&fname=***&lname=***&tribalid=***&address=***&city=***&state=***&zip=***&ssn=***";

        // request.open('POST', url, true);
        // request.send();
        setManyChatField(manychatID, mc_fname, "***");
        setManyChatField(manychatID, mc_lname, "***");
        setManyChatField(manychatID, mc_tribalID, "***");
        setManyChatField(manychatID, mc_address, "***");
        setManyChatField(manychatID, mc_city, "***");
        setManyChatField(manychatID, mc_state, "***");
        setManyChatField(manychatID, mc_zip, "***");
        setManyChatField(manychatID, mc_ssn, "***");
        
        document.getElementById("error_final_display_window").innerHTML = ""
        $("#plan_id_options").empty();
        $("#plan_id_options").append('<option value="">Select Plan ID</option>');

      } else if(description == "FAIL"){

        errorDescription = xmlDoc.getElementsByTagName("errorDescription")[0].innerHTML
        document.getElementById("error_final_display_window").innerHTML = "Error Description: " + errorDescription;
      }
    }
    request.send();
  });
}

function getPlanId() {
  button = document.getElementById("plan_id_submit");

  button.addEventListener("click", function(){
    document.getElementById("get_plan_error_description").innerHTML="";
    document.getElementById("plan_id").innerHTML="";

    console.log("get plan id js function");
    var zipCode = document.getElementById("vcare_zip_a").value;
    var tribal = "N"
    var state = document.getElementById("get_plan_state").value;
    var refNumber = uniqueIdentifierGenerator();

    if(document.getElementById("vcare_tribal").checked){
      tribal = "Y"
    }

    var request = new XMLHttpRequest();
    var url = "/getplan?zipcode="+zipCode+"&tribal="+tribal+"&state="+state+"&refNumber"+refNumber;

    request.open('POST', url, true);
    request.onload = function(){
      var data = this.response;
      response=JSON.parse(data);

      parser = new DOMParser();
      xmlDoc = parser.parseFromString(response,"text/xml");

      description = xmlDoc.getElementsByTagName("description")[0].innerHTML
      

      if(description == "SUCCESS") {
          txt = "";
          var x = xmlDoc.getElementsByTagName("planName");
          var y = xmlDoc.getElementsByTagName("planID");
          document.getElementById("plan_id").innerHTML = "Description: " + description

          for (i = 0; i < x.length; i++) {
               $("#plan_id_options").append("<option value=\"" + y[i].childNodes[0].nodeValue + "\">" + x[i].childNodes[0].nodeValue +" id: "+ y[i].childNodes[0].nodeValue + "</option>");

          }
        
      } else if(description == "FAIL"){
        errorDescription = xmlDoc.getElementsByTagName("errorDescription")[0].innerHTML
        document.getElementById("get_plan_error_description").innerHTML = "Error Description: " + errorDescription;
      }
    }
    request.send();
  });
}

function checkServiceAvailability(){
  button = document.getElementById("check_sevice_submit");

  button.addEventListener("click", function(){
    document.getElementById("check_service").innerHTML="";
    document.getElementById("enrollment_id_a").innerHTML="";

    console.log("check_service js function");
    var zipCode = document.getElementById("vcare_zip_a").value;
    var refNumber = uniqueIdentifierGenerator();
    var request = new XMLHttpRequest();
    var url = "/checkservice?zipcode="+zipCode+"&refnumber"+refNumber;

    request.open('POST', url, true);
    request.onload = function(){
      var data = this.response;
      obj=JSON.parse(data)
      parser = new DOMParser();

      xmlDoc = parser.parseFromString(obj,"text/xml");

      description = xmlDoc.getElementsByTagName("description")[0].innerHTML
      document.getElementById("check_service").innerHTML = "Description: " + description

      if(description == "SUCCESS") {
        manychatID = document.getElementById("enrollment_manychat").value;
        enrollmentId = xmlDoc.getElementsByTagName("enrollmentId")[0].innerHTML

        document.getElementById("enrollment_id_a").innerHTML = "Enrollment Id: " + enrollmentId
        document.getElementById("enrollment_id_b").value = enrollmentId

        // var request = new XMLHttpRequest()
        // var url = "https://hooks.zapier.com/hooks/catch/2550009/o1jkabb?manychatid="+manychatID+"&enrollmentid="+enrollmentId;

        // request.open('POST', url, true);
        // request.send();
        setManyChatField(manychatID, mc_enrollmentID, enrollmentId);
      } else if(description == "FAIL"){
        errorDescription = xmlDoc.getElementsByTagName("errorDescription")[0].innerHTML
        document.getElementById("enrollment_id_a").innerHTML = "Error Description: " + errorDescription;
      }
    }
    request.send();
  });
}


function sendEligibilityToManyChat(eligibilityCheckId, manychatID, fname, lname, tribalid, address, city, state, zip, ssn){
  // var request = new XMLHttpRequest()
  // var url = "https://hooks.zapier.com/hooks/catch/2550009/o1co8fq?manychatid="+manychatID+"&eligibilityCheckId="+eligibilityCheckId+"&fname="+fname+"&lname="+lname+"&tribalid="+tribalid+"&address="+address+"&city="+city+"&state="+state+"&zip="+zip+"&ssn="+ssn;

  // request.open('POST', url, true);
  // request.send();
  setManyChatField(manychatID, mc_eligibility_checkID, eligibilityCheckId);
  setManyChatField(manychatID, mc_fname, fname);
  setManyChatField(manychatID, mc_lname, lname);
  setManyChatField(manychatID, mc_tribalID, tribalid);
  setManyChatField(manychatID, mc_address, address);
  setManyChatField(manychatID, mc_city, city);
  setManyChatField(manychatID, mc_state, state);
  setManyChatField(manychatID, mc_zip, zip);
  setManyChatField(manychatID, mc_ssn, ssn);
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
    addTagToUser(manychatID, Step_1_Completed);
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
    addTagToUser(manychatID, Step_1_Completed);
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
    document.getElementById("nv_status").innerHTML = "";
    document.getElementById("nv_eligibility_id").innerHTML = "";
    document.getElementById("nv_errors").innerHTML = "";

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
        first_parse =JSON.parse(data);
        second_parse = JSON.parse(first_parse);
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

    document.getElementById("sent_status").innerHTML="";

    manychatID = document.getElementById("senduser_manychatID").value;

    if(manychatID != ""){
      var request = new XMLHttpRequest()
      var url = "https://hooks.zapier.com/hooks/catch/2550009/o1cb0a0?manychatid="+manychatID;

      request.open('POST', url, true);
      request.send();

      addTagToUser(manychatID, Step_2_Completed);

      document.getElementById("sent_status").innerHTML = "Application form sent to user!";
    }else{
      document.getElementById("sent_status").innerHTML = "Please enter a ManyChat ID";
    }

    
  });

}

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
      response=JSON.parse(data);
      statusCheckResponse(response, manychatID);  
    }
    request.send();
  });
}

function displayShippingFields(){
  if(document.getElementById("shipping_physical").checked){
    document.getElementById("shipping_form").style.display = "none";
  }else{
    document.getElementById("shipping_form").style.display = "initial";
  }
}

function userConsent(){
  var agent = document.getElementById("agent").value
  var fname = document.getElementById("fname").value
  var lname = document.getElementById("lname").value
  if(document.getElementById("user_consent").checked && agent != "" && fname != "" && lname != ""){

    var request = new XMLHttpRequest()
    var url = "https://hooks.zapier.com/hooks/catch/2550009/o1jp6b9?agent="+agent+"&fname="+fname+"&lname="+lname;

    request.open('POST', url, true);
    request.send();

    document.getElementById("benefits").disabled = false;
    document.getElementById("manychatID").disabled = false;
    document.getElementById("dob").disabled = false;
    document.getElementById("tribalID").disabled = false;
    document.getElementById("address").disabled = false;
    document.getElementById("city").disabled = false;
    document.getElementById("state").disabled = false;
    document.getElementById("zip").disabled = false;
    document.getElementById("ssn").disabled = false;
  }else{
    document.getElementById("benefits").disabled = true;
    document.getElementById("manychatID").disabled = true;
    document.getElementById("dob").disabled = true;
    document.getElementById("tribalID").disabled = true;
    document.getElementById("address").disabled = true;
    document.getElementById("city").disabled = true;
    document.getElementById("state").disabled = true;
    document.getElementById("zip").disabled = true;
    document.getElementById("ssn").disabled = true;
  }
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
    document.getElementById("agent").value="";
    document.getElementById("fname").value="";
    document.getElementById("lname").value="";
    document.getElementById('vcare_zip_a').value = "";
    document.getElementById('get_plan_state').value = "";
    document.getElementById("nv_status").innerHTML = "";
    document.getElementById("nv_eligibility_id").innerHTML="";
    document.getElementById("nv_errors").innerHTML="";
    document.getElementById("sent_status").innerHTML="";
    document.getElementById("status").innerHTML="";
    document.getElementById("status_failures").innerHTML="";
    document.getElementById("check_service").innerHTML="";
    document.getElementById("enrollment_id_a").innerHTML="";
    document.getElementById("get_plan_error_description").innerHTML="";
    document.getElementById("plan_id").innerHTML="";
    document.getElementById("final_display_window").innerHTML="";
    document.getElementById("error_final_display_window").innerHTML="";
    document.getElementById("photo_id_status").innerHTML="";
    document.getElementById("pob_status").innerHTML="";
    document.getElementById("additional_proof_status").innerHTML="";
    document.getElementById("vcare_photoID").value="";
    document.getElementById("vcare_pob").value="";
    document.getElementById("vcare_additional_proof").value="";
    document.getElementById("photo_id_output").value="";
    document.getElementById("additional_proof_output").value="";
    document.getElementById("pob_output").value="";
    $("#plan_id_options").empty();
    $("#plan_id_options").append('<option value="">Select Plan ID</option>');
    document.getElementById("user_consent").checked = false;
    userConsent();
  });
}

function addTagToUser(manychatID, tagName) {
  var request = new XMLHttpRequest()
  var url = "https://hooks.zapier.com/hooks/catch/2550009/o1jq4dp?manychatid="+manychatID+"&tagName="+tagName;

  request.open('POST', url, true);
  request.send();
}

function setManyChatField(manychatID, customField, value){
  var request = new XMLHttpRequest()
  var url = "https://hooks.zapier.com/hooks/catch/2550009/o1j05sb?manychatid="+manychatID+"&customField="+customField+"&value="+value;

  request.open('POST', url, true);
  request.send();
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