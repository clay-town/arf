document.addEventListener("DOMContentLoaded", function() {
  createApplication();
  statusCheck();
  sendUserToManyChatFlowAfterApplicationCreation();
  checkServiceAvailability()
  getPlanId();
  createCustomer();
  clearFields();
  uploadProof();
});

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
    console.log("upload all photos function");

    var photoId= document.getElementById("vcare_photoID").value;
    var pob = document.getElementById("vcare_pob").value;
    var additionalProof = document.getElementById("vcare_additional_proof").value;
    var enrollmentId = document.getElementById("enrollment_id_b").value;
    const wait=ms=>new Promise(resolve => setTimeout(resolve, ms)); 

    console.log("deeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeebug")
    convertImgToBase64(additionalProof, "ap");
    convertImgToBase64(photoId, "id");
    convertImgToBase64(pob, "pob");    
    
    wait(12*1000).then(() => { 
      additionalProof = document.getElementById("additional_proof_output").value
      photoId = document.getElementById("photo_id_output").value
      pob = document.getElementById("pob_output").value
      
      uploadPhotoID(photoId, enrollmentId)
      uploadPOB(pob, enrollmentId)
      uploadProofVcare(additionalProof, enrollmentId)
      console.log(photoId)
    })
  });
}

function uploadPhotoID(photoId, enrollmentId){
  var request = new XMLHttpRequest();
  var url = "/uploadphotoid?photoid="+photoId+"&enrollmentid="+enrollmentId;

  request.open('POST', url, true);
  request.onload = function(){
    var data = this.response;
          
    response=JSON.parse(data);
    parser = new DOMParser();
    xmlDoc = parser.parseFromString(response,"text/xml");

    description = xmlDoc.getElementsByTagName("description")[0].innerHTML
        //document.getElementById("final_display_window").innerHTML = "Description: " + description
  console.log("pid: " + description);
    if(description == "SUCCESS") {
            
          document.getElementById("photo_id_status").innerHTML = "Photo ID Upload Successful"
    } else if(description == "FAIL"){
          document.getElementById("photo_id_status").innerHTML = "Photo ID Upload Failed"
          //errorDescription = xmlDoc.getElementsByTagName("errorDescription")[0].innerHTML
          //document.getElementById("error_final_display_window").innerHTML = "Error Description: " + errorDescription;
    }
  }
  request.send();
}


function uploadPOB(pob, enrollmentId){
  var request = new XMLHttpRequest();
  var url = "/uploadpob?pob="+pob+"&enrollmentid="+enrollmentId;

  request.open('POST', url, true);
  request.onload = function(){
    var data = this.response;
      
    response=JSON.parse(data);
    parser = new DOMParser();
    xmlDoc = parser.parseFromString(response,"text/xml");

    description = xmlDoc.getElementsByTagName("description")[0].innerHTML
        //document.getElementById("final_display_window").innerHTML = "Description: " + description
    console.log("pob: " + description);
    if(description == "SUCCESS") {
            
          document.getElementById("pob_status").innerHTML = "Proof of Benefits Upload Successful"
    } else if(description == "FAIL"){
          document.getElementById("pob_status").innerHTML = "Proof of Benefits Upload Failed"
          //errorDescription = xmlDoc.getElementsByTagName("errorDescription")[0].innerHTML
          //document.getElementById("error_final_display_window").innerHTML = "Error Description: " + errorDescription;
    }
  }
  request.send();
}

function uploadProofVcare(additionalProof, enrollmentId){
  var request = new XMLHttpRequest();
  var url = "/uploadproof?additionalproof="+additionalProof+"&enrollmentid="+enrollmentId;

  request.open('POST', url, true);
  request.onload = function(){
    var data = this.response;
      
    response=JSON.parse(data);
    parser = new DOMParser();
    xmlDoc = parser.parseFromString(response,"text/xml");

    description = xmlDoc.getElementsByTagName("description")[0].innerHTML
        //document.getElementById("final_display_window").innerHTML = "Description: " + description
    console.log("proof: " + description);
    if(description == "SUCCESS") {
          document.getElementById("additional_proof_status").innerHTML = "Additional Proof Upload Successful"
    } else if(description == "FAIL"){
          document.getElementById("additional_proof_status").innerHTML = "Additional Proof Upload Failed"
          //errorDescription = xmlDoc.getElementsByTagName("errorDescription")[0].innerHTML
          //document.getElementById("error_final_display_window").innerHTML = "Error Description: " + errorDescription;
    }
  }
  request.send();
}

function createCustomer() {
  button = document.getElementById("vcare_submit");
  button.addEventListener("click", function(){

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
        
        document.getElementById("error_final_display_window").innerHTML = ""
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
        enrollmentId = xmlDoc.getElementsByTagName("enrollmentId")[0].innerHTML
        document.getElementById("enrollment_id_a").innerHTML = "Enrollment Id: " + enrollmentId
        document.getElementById("enrollment_id_b").value = enrollmentId
      } else if(description == "FAIL"){
        errorDescription = xmlDoc.getElementsByTagName("errorDescription")[0].innerHTML
        document.getElementById("enrollment_id_a").innerHTML = "Error Description: " + errorDescription;
      }
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
      response=JSON.parse(data);
      statusCheckResponse(response);     
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

function submitApplication(){
  button = document.getElementById("vcare_submit");

  button.addEventListener("click", function(){
    var photoID = document.getElementById("vcare_photoID").value;


    console.log("vcare submit button pushed");
    console.log(convertImgToBase64(photoID, function(base64Img){
    }));
  });
}