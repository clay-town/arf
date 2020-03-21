package main

import (
	"bytes"
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

func createApplication(w http.ResponseWriter, r *http.Request) {
	godotenv.Load()

	benefit := r.URL.Query().Get("benefit");
	fname := r.URL.Query().Get("fname");
	lname := r.URL.Query().Get("lname");
	phone := r.URL.Query().Get("phone");
	dob := r.URL.Query().Get("dob");
	tribalID := r.URL.Query().Get("tribalID");
	address := r.URL.Query().Get("address");
	city := r.URL.Query().Get("city");
	state := r.URL.Query().Get("state");
	zip := r.URL.Query().Get("zip");
	ssn := r.URL.Query().Get("ssn");

	// APIKEY := os.Getenv("APIKEY");

	// client := &http.Client{

	// }


	url := "https://api.universalservice.org/nvca-svc/consumer/eligibility-check"
	method := "PUT"

	payload := strings.NewReader("{\n\"firstName\": \"JOHN\",\n\"middleName\": \"APPLESAUCE\",\n\"lastName\": \"SMITH\",\n\"address\": \"12345 MADE UP LANE\",\n\"state\": \"MD\",\n\"city\": \"LOS CANADA\",\n\"zipCode\": \"00234\",\n\"urbanizationCode\": \"URB ROYAL OAKS\",\n\"dob\": \"1970-11-23\",\n\"ssn4\": \"0123\",\n\"tribalId\": \"46631\",\n\"bqpFirstName\": \"JOHN\",\n\"bqpLastName\": \"DOE\",\n\"bqpDob\": \"1990-09-09\",\n\"bqpSsn4\": \"4567\",\n\"bqpTribalId\": \"899939\",\n\"eligibilityProgramCode\": \"E1,E2,E3\",\n\"consentInd\": \"Y\",\n\"contactPhoneNumber\": \"9999999999\",\n\"contactEmail\": \"JOHNSMITH@EMAIL.COM\",\n\"contactAddress\": \"123 MADE UP LANE\",\n\"contactCity\": \"NEW YORK\",\n\"contactState\": \"NY\",\n\"contactZipCode\": \"10038\",\n\"contactUrbCode\": \"URB ROYAL OAKS\",\n\"repId\": \"\",\n\"repNotAssisted\": \"1\",\n\"carrierUrl\": \"companysite.com\"\n}")

	client := &http.Client {
	}
	req, err := http.NewRequest(method, url, payload)

	if err != nil {
	fmt.Println(err)
	}
	req.Header.Add("Content-Type:", "application/json")
	req.Header.Add("authorization", "Basic ODdAbGhnOWN3NHRneDlqN2JqLnVxZm9kenlwenRybnA6eVVfKWFfMlNyJGpLbEgtXzRzXkBRVGJpTE45KV5GRno=")
	req.Header.Add("accept-language", "en-US,en;q=0.8")
	req.Header.Add("content-type", "application/json")

	res, err := client.Do(req)
	defer res.Body.Close()
	body, err := ioutil.ReadAll(res.Body)

	fmt.Println(string(body))
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
	fmt.Println("heeeellooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo")
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