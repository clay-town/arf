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
	
func checkServiceAvailability(w http.ResponseWriter, r *http.Request) {
	godotenv.Load()
}
func getPlanService(w http.ResponseWriter, r *http.Request) {
	godotenv.Load()
}
func createCustomer(w http.ResponseWriter, r *http.Request) {
	godotenv.Load()
}
func uploadProof(w http.ResponseWriter, r *http.Request) {
	godotenv.Load()
}


func createApplication(w http.ResponseWriter, r *http.Request) {
}
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