package main

import (
	"log"
	"net/http"
	"html/template"
	"encoding/json"
	"io/ioutil"
	"os"
	"github.com/joho/godotenv"
	"fmt"
	"strings"
)

func uploadProof(w http.ResponseWriter, r *http.Request) {
	godotenv.Load()
  	url := "https://www.vcareapi.com/vcareOssApi/UploadProof/"
  	method := "POST"
	photoId:= r.URL.Query().Get("photoid")
    pob := r.URL.Query().Get("pob")
    additionalProof := r.URL.Query().Get("additionalproof")
    enrollmentId := r.URL.Query().Get("enrollmentid")
  	

  	payload := strings.NewReader("<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<VCAREOSSAPI xmlns=\"http://www.oss.vcarecorporation.com/oss\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">\n	<CREDENTIALS>\n	<VENDORID>Demo-Truewireless</VENDORID>\n	<USERNAME>Demo-TruewireUser</USERNAME>\n	<PASSWORD>Demo-TruewirewtK123hyutrw09</PASSWORD>\n	<PIN>Demo-63216741646566</PIN>\n	<REFERENCENUMBER>1541564620</REFERENCENUMBER>\n</CREDENTIALS>\n<VCAREOSS>\n<UPLOADPROOF>\n<ENROLLMENTID>"+enrollmentId+"</ENROLLMENTID>\n	<SIGNATUREFILENAME></SIGNATUREFILENAME>\n	<PROOFFILE>"+pob+"</PROOFFILE>\n	<BILLPROOF></BILLPROOF>\n	<IDPROOF>"+photoId+"</IDPROOF>\n	<ADDITIONALINFO>"+additionalProof+"</ADDITIONALINFO>\n	<ADDRESSPROOF></ADDRESSPROOF>\n	<ISBASE64CODE>Y</ISBASE64CODE>\n	<CUSTRESERT></CUSTRESERT>\n	<AGENTID>Justin</AGENTID>\n	<AGENTPASSWORD>Pass753.</AGENTPASSWORD>\n	<SOURCE></SOURCE>\n	</UPLOADPROOF>\n</VCAREOSS>\n</VCAREOSSAPI>")
  	fmt.Println(string(payload))

  	client := &http.Client {
  	}
  	req, err := http.NewRequest(method, url, payload)

  	if err != nil {
    	fmt.Println(err)
  	}
  	req.Header.Add("Content-Type", "application/xml")

  	res, err := client.Do(req)
  	defer res.Body.Close()
  	body, err := ioutil.ReadAll(res.Body)
  	
  	fmt.Println(string(body))
	json.NewEncoder(w).Encode(string(body))
}

func createCustomer(w http.ResponseWriter, r *http.Request) {
	godotenv.Load()

	zipCode := r.URL.Query().Get("zipcode")
    state := r.URL.Query().Get("state")
    tribal := r.URL.Query().Get("tribal")
    planId := r.URL.Query().Get("planid")
    enrollmentId := r.URL.Query().Get("enrollmentId")
    fname := r.URL.Query().Get("fname")
    mname := r.URL.Query().Get("mname")
    lname := r.URL.Query().Get("lname")
    dob := r.URL.Query().Get("dob")
   // tribalId := r.URL.Query().Get("tribalid")
    preffContact := r.URL.Query().Get("preffcontact")
    address := r.URL.Query().Get("address")
    city := r.URL.Query().Get("city")
    ssn := r.URL.Query().Get("ssn")
    programCode := r.URL.Query().Get("programcode")

    agentLogin := os.Getenv("AGENTLOGIN")
    agentPassword := os.Getenv("AGENTPASSWORD")
  //  vendorId := os.Getenv("VENDORID")
    //username := os.Getenv("USERNAME")
   // password := os.Getenv("PASSWORD")
   // pin := os.Getenv("PIN")
	


	refNumber := os.Getenv("123456")


  	url := "https://www.vcareapi.com/vcareOssApi/CreateCustomer/"
  	method := "POST"

	payload := strings.NewReader("<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<VCAREOSSAPI xmlns=\"http://www.oss.vcarecorporation.com/oss\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">\n  <CREDENTIALS>\n  <VENDORID>Demo-Truewireless</VENDORID>\n  <USERNAME>Demo-TruewireUser</USERNAME>\n  <PASSWORD>Demo-TruewirewtK123hyutrw09</PASSWORD>\n  <PIN>Demo-63216741646566</PIN>\n  <REFERENCENUMBER>"+refNumber+"</REFERENCENUMBER>\n</CREDENTIALS>\n<VCAREOSS>\n<CREATECUSTOMER>\n<COMPANY_ID>54</COMPANY_ID>\n  <ENROLLMENTID>"+enrollmentId+"</ENROLLMENTID>\n  <SUFFIX_NAME></SUFFIX_NAME>\n  <FIRSTNAME>"+fname+"</FIRSTNAME>\n  <MIDDLENAME>"+mname+"</MIDDLENAME>\n  <LASTNAME>"+lname+"</LASTNAME>\n  <DOB>"+dob+"</DOB>\n  <SSN>"+ssn+"</SSN>\n  <BENEFICIARYSAMEASCUSTOMER>Y</BENEFICIARYSAMEASCUSTOMER>\n  <BENEFICIARYSUFFIX></BENEFICIARYSUFFIX>\n  <BENEFICIARYFIRSTNAME></BENEFICIARYFIRSTNAME>\n  <BENEFICIARYMIDDLENAME></BENEFICIARYMIDDLENAME>\n  <BENEFICIARYLASTNAME></BENEFICIARYLASTNAME>\n  <BENEFICIARYDOB></BENEFICIARYDOB>\n  <BENEFICIARYSSN></BENEFICIARYSSN>\n  <BENEFICIARYTRIBALID></BENEFICIARYTRIBALID>\n  <BESTWAYTOREACH>"+preffContact+"</BESTWAYTOREACH>\n  <ALTERNATIVEEMAIL></ALTERNATIVEEMAIL>\n  <ALTERNATIVECONTACTNAME></ALTERNATIVECONTACTNAME>\n  <ALTERNATIVECONTACTNUMBER></ALTERNATIVECONTACTNUMBER>\n  <PHYSICALADDRESS>\n<ADDRESS1>"+address+"</ADDRESS1>\n  <ADDRESS2></ADDRESS2>\n  <CITY>"+city+"</CITY>\n  <STATE>"+state+"</STATE>\n  <ZIP>"+zipCode+"</ZIP>\n  </PHYSICALADDRESS>\n<MAILINGADDRESS>\n<ADDRESS1>"+shipping_address+"</ADDRESS1>\n  <ADDRESS2></ADDRESS2>\n  <CITY>"+shipping_city+"</CITY>\n  <STATE>"+shipping_state+"</STATE>\n  <ZIP>"+shipping_zip+"</ZIP>\n  </MAILINGADDRESS>\n<LIFELINE>\n<PROGRAMCODE>"+programCode+"</PROGRAMCODE>\n  <INCOMECERTIFY></INCOMECERTIFY>\n  <TEMPORARYADDRESS>N</TEMPORARYADDRESS>\n  <TRIBAL>"+tribal+"</TRIBAL>\n  <HOUSEHOLDCOUNT></HOUSEHOLDCOUNT>\n  <MULTIPLEHOUSEHOLDS></MULTIPLEHOUSEHOLDS>\n  </LIFELINE>\n<CLAIMNUMBER></CLAIMNUMBER>\n  <ISSUEDATEONPROOF></ISSUEDATEONPROOF>\n  <EXPIRATIONDATEONPROOF></EXPIRATIONDATEONPROOF>\n  <PLANID>"+planId+"</PLANID>\n  <ENROLLMENTTYPE>Shipment</ENROLLMENTTYPE>\n  <HOUSEHOLDLIFELINE></HOUSEHOLDLIFELINE>\n  <ADULT></ADULT>\n  <SHARE></SHARE>\n  <CERTIFI1></CERTIFI1>\n  <CERTIFI2></CERTIFI2>\n  <DSHSCLIENTID></DSHSCLIENTID>\n  <CUSTOMERINFOMATR></CUSTOMERINFOMATR>\n  <DRIVER_LICENSE_NUMBER></DRIVER_LICENSE_NUMBER>\n  <ADDRESSVALIDATION></ADDRESSVALIDATION>\n  <ISRURAL></ISRURAL>\n  <ISWEBPARTNER></ISWEBPARTNER>\n  <IPADDRESS></IPADDRESS>\n  <CUSTOMERCLASSIFICATION_ID></CUSTOMERCLASSIFICATION_ID>\n  <CUSTOMERPASSWORD></CUSTOMERPASSWORD>\n  <AGENTLOGIN>"+agentLogin+"</AGENTLOGIN>\n  <AGENTPASSWORD>"+agentPassword+"</AGENTPASSWORD>\n  <SOURCE></SOURCE>\n  </CREATECUSTOMER>\n</VCAREOSS>\n</VCAREOSSAPI>")

  	client := &http.Client {
  	}
  	req, err := http.NewRequest(method, url, payload)

  	if err != nil {
    	fmt.Println(err)
  	}
  	req.Header.Add("Content-Type", "application/xml")

  	res, err := client.Do(req)
  	defer res.Body.Close()
  	body, err := ioutil.ReadAll(res.Body)

  	fmt.Println(string(body))
	json.NewEncoder(w).Encode(string(body))
}

func getPlanService(w http.ResponseWriter, r *http.Request) {
	godotenv.Load()
	tribal := "N"
	zipCode := r.URL.Query().Get("zipcode");
	state 	:= r.URL.Query().Get("state");
	tribal  = r.URL.Query().Get("tribal");

	url := "https://www.vcareapi.com/vcareOssApi/GetPlanService/"
	method := "POST"

	payload := strings.NewReader("<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<VCAREOSSAPI xmlns=\"http://www.oss.vcarecorporation.com/oss\" \n    xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">\n    <CREDENTIALS>\n        <VENDORID>Demo-Truewireless</VENDORID>\n  <USERNAME>Demo-TruewireUser</USERNAME>\n  <PASSWORD>Demo-TruewirewtK123hyutrw09</PASSWORD>\n  <PIN>Demo-63216741646566</PIN>\n  <REFERENCENUMBER>9541564622</REFERENCENUMBER>\n    </CREDENTIALS>\n    <VCAREOSS>\n        <GETPLANSERVICE>\n            <STATE>"+state+"</STATE>\n            <TYPE>LIFELINE</TYPE>\n            <TRANSACTIONTYPE></TRANSACTIONTYPE>\n            <AGENTID>justin</AGENTID>\n            <AGENTPASSWORD>Pass753.</AGENTPASSWORD>\n            <SOURCE></SOURCE>\n        </GETPLANSERVICE>\n        <CHECKSERVICEAVAILABILITY>\n            <TRIBAL>"+tribal+"</TRIBAL>\n            <ZIPCODE>"+zipCode+"</ZIPCODE>\n        </CHECKSERVICEAVAILABILITY>\n\n    </VCAREOSS>\n</VCAREOSSAPI>")

	client := &http.Client {
	}
	req, err := http.NewRequest(method, url, payload)

	if err != nil {
	  fmt.Println(err)
	}
	req.Header.Add("Content-Type", "application/xml")

	res, err := client.Do(req)
	defer res.Body.Close()
	body, err := ioutil.ReadAll(res.Body)

 	fmt.Println(string(body))
	json.NewEncoder(w).Encode(string(body))
}

func checkServiceAvailability(w http.ResponseWriter, r *http.Request) {
	godotenv.Load()
	//APIKEY := os.Getenv("APIKEY");
	zipCode := r.URL.Query().Get("zipcode");
	url := "https://www.vcareapi.com/vcareOssApi/CheckServiceAvailability/"
  	method := "POST"
	payload := strings.NewReader("<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<VCAREOSSAPI xmlns=\"http://www.oss.vcarecorporation.com/oss\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">\n	<CREDENTIALS>\n	<VENDORID>Demo-Truewireless</VENDORID>\n	<USERNAME>Demo-TruewireUser</USERNAME>\n	<PASSWORD>Demo-TruewirewtK123hyutrw09</PASSWORD>\n	<PIN>Demo-63216741646566</PIN>\n	<REFERENCENUMBER>94453456</REFERENCENUMBER>\n</CREDENTIALS>\n<VCAREOSS>\n<CHECKSERVICEAVAILABILITY>\n<ENROLLMENTTYPE>LIFELINE</ENROLLMENTTYPE>\n	<ZIPCODE> "+zipCode+"</ZIPCODE>\n	<COMPANYID>54</COMPANYID>\n	<ISENROLLMENT>y</ISENROLLMENT>\n	<ISWEBPARTNER></ISWEBPARTNER>\n	<SOURCE></SOURCE>\n	<AGENTID>justin</AGENTID>\n	<AGENTPASSWORD>Pass753.</AGENTPASSWORD>\n	</CHECKSERVICEAVAILABILITY>\n</VCAREOSS>\n</VCAREOSSAPI>")

  	client := &http.Client {
  	}
  	req, err := http.NewRequest(method, url, payload)

  	if err != nil {
    	fmt.Println(err)
  	}
  	req.Header.Add("Content-Type", "application/xml")

  	res, err := client.Do(req)
  	defer res.Body.Close()
  	body, err := ioutil.ReadAll(res.Body)
  	
  	fmt.Println(string(body))
	json.NewEncoder(w).Encode(string(body))
}


func createApplication(w http.ResponseWriter, r *http.Request) {

	godotenv.Load()

	benefit := r.URL.Query().Get("benefit");
	fname := r.URL.Query().Get("fname");
	lname := r.URL.Query().Get("lname");
	dob := r.URL.Query().Get("dob");
	tribalID := r.URL.Query().Get("tribalID");
	address := r.URL.Query().Get("address");
	city := r.URL.Query().Get("city");
	state := r.URL.Query().Get("state");
	zip := r.URL.Query().Get("zip");
	ssn := r.URL.Query().Get("ssn");

	APIKEY := os.Getenv("APIKEY");

	url := "https://api.universalservice.org/nvca-svc/consumer/eligibility-check/"
	method := "POST"

	payload := strings.NewReader("{  \"firstName\": \""+fname+"\",  \"middleName\": \"\",  \"lastName\": \""+lname+"\",  \"address\": \""+address+"\",  \"state\": \""+state+"\",  \"city\": \""+city+"\",  \"zipCode\": \""+zip+"\",  \"urbanizationCode\": \"\",  \"dob\": \""+dob+"\",  \"ssn4\": \""+ssn+"\",  \"tribalId\": \""+tribalID+"\",  \"bqpFirstName\": \"\",  \"bqpLastName\": \"\",  \"bqpDob\": \"\",  \"bqpSsn4\": \"\",  \"bqpTribalId\": \"\",  \"eligibilityProgramCode\": \""+benefit+"\",  \"consentInd\": \"Y\",  \"contactPhoneNumber\": \"\",  \"contactEmail\": \"\",  \"contactAddress\": \" \",  \"contactCity\": \"\",  \"contactState\": \"\",  \"contactZipCode\": \"\",  \"contactUrbCode\": \"\",  \"carrierUrl\": \"https://enrollments-gotruewireless.telgoo5.com/national-verifier-callback/\"}")

	client := &http.Client {
	}
	req, err := http.NewRequest(method, url, payload)

	if err != nil {
		fmt.Println(err)
	}
	req.Header.Add("authorization", APIKEY)
	req.Header.Add("accept", "application/json")
	req.Header.Add("accept-language", "en-US,en;q=0.8")
	req.Header.Add("content-type", "application/json")

	res, err := client.Do(req)
	defer res.Body.Close()
	body, err := ioutil.ReadAll(res.Body)

	fmt.Println(string(body))
	json.NewEncoder(w).Encode(string(body))

}

func statusCheck(w http.ResponseWriter, r *http.Request) {
	APIKEY := os.Getenv("APIKEY");
	eligibilityCheckId := r.URL.Query().Get("eligibilityCheckId");


	url := "https://api.universalservice.org/nvca-svc/consumer/eligibility-check/"+eligibilityCheckId+"/status";
  	method := "POST"
  	payload := strings.NewReader("{\n    \"repId\": \"\",\n    \"repNotAssisted\": \"\",\n    \"carrierUrl\": \"https://enrollments-gotruewireless.telgoo5.com/national-verifier-callback/\"\n}")
  	
  	client := &http.Client {}
  	req, err := http.NewRequest(method, url, payload)

  	if err != nil {
		fmt.Println(err)
  	} 
  	req.Header.Add("authorization", APIKEY)
  	req.Header.Add("accept", "application/json")
  	req.Header.Add("accept-language", "en-US,en;q=0.8")
  	req.Header.Add("content-type", "application/json")
  	res, err := client.Do(req)
  	defer res.Body.Close()
  	body, err := ioutil.ReadAll(res.Body)
	json.NewEncoder(w).Encode(string(body))
}


func home(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/"{
		http.NotFound(w, r)
		return
	}
	ts, err := template.ParseFiles("internal/ui/html/home.page.tmpl")
	if err != nil {
		log.Println(err.Error())
		http.Error(w, "Internal Server Error", 500)
		return
	}	
	err = ts.Execute (w, nil)
	if err != nil {
		log.Println(err.Error())
		http.Error(w, "Internal Server Error", 500)
	}
}