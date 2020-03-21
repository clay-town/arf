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
)

func createApplication(w http.ResponseWriter, r *http.Request) {
	godotenv.Load()

	benefit := r.URL.Query().Get("benefit");
	fname := r.URL.Query().Get("fname");
	lname := r.URL.Query().Get("lname");
	dob := r.URL.Query().Get("dob");
	tribalID := r.URL.Query().Get("tribalID");
	address := r.URL.Query().Get("address");
	zip := r.URL.Query().Get("zip");
	ssn := r.URL.Query().Get("zip");
	APIKEY := os.Getenv("APIKEY");

	client := &http.Client{

	}
}

func statusCheck(w http.ResponseWriter, r *http.Request) {
	godotenv.Load()
	eligibilityCheckId := r.URL.Query().Get("eligibilityCheckId")
	APIKEY := os.Getenv("APIKEY");
	client := &http.Client{

	}
	
	values := map[string]string{"repId":"","repNotAssisted":"1","carrierUrl":"https://enrollments-gotruewireless.telgoo5.com/national-verifier-callback/"}
	jsonValue, _ := json.Marshal(values);

	var url = "https://api.universalservice.org/nvca-svc/consumer/eligibility-check/"+eligibilityCheckId+"/status";

	response, err := client.Post(url, string(jsonValue), bytes.NewBuffer(jsonValue));
	req, err := http.NewRequest("POST", url, nil);
	req.Header.Add("authorization", APIKEY);
    req.Header.Add("accept", "application/json");
    req.Header.Add("accept-encoding", "gzip, deflate");
    req.Header.Add("accept-language", "en-US,en;q=0.8");
    req.Header.Add("content-type", "application/json");
	response, err = client.Do(req)

	   
    if err != nil {
        log.Printf("The HTTP request failed with error %s\n", err)
    } else {
        data, _ := ioutil.ReadAll(response.Body)
        log.Println(string(data));
        json.NewEncoder(w).Encode(string(data));
    }
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