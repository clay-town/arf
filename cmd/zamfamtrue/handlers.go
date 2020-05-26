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

type test_struct struct {
    Test string `json:"image"`
}

func statusCheck(w http.ResponseWriter, r *http.Request) {
	APIKEY := os.Getenv("APIKEY");
	eligibilityCheckId := r.URL.Query().Get("eligibilityCheckId");


	url := "";
  	method := "POST"
  	payload := strings.NewReader("")
  	
  	client := &http.Client {}
  	req, err := http.NewRequest(method, url, payload)

  	if err != nil {
		fmt.Println(err)
  	} 
  	// req.Header.Add("authorization", APIKEY)
  	// req.Header.Add("accept", "application/json")
  	// req.Header.Add("accept-language", "en-US,en;q=0.8")
  	// req.Header.Add("content-type", "application/json")
  	// res, err := client.Do(req)
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