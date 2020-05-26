package main

import (
	"log"
	"net/http"
	"html/template"
	"encoding/json"
	"encoding/xml"
	// "io/ioutil"
	"fmt"
	// "strings"
)

type test_struct struct {
    Test string `json:"image"`
}

func statusCheck(w http.ResponseWriter, r *http.Request) {
	// APIKEY := os.Getenv("APIKEY");
	// eligibilityCheckId := r.URL.Query().Get("eligibilityCheckId");


	url := "https://www.ar15.com/forums/rss.html?b=7&f=133";
  resp, err := http.Get(url)
  if err != nil {
   fmt.Println(err)
  } 
  defer resp.Body.Close()

  items := Items{}
	decoder := xml.NewDecoder(resp.Body)

	err = decoder.Decode(&rss)

	if err != nil {
   fmt.Println(err)
  } 

  fmt.Println(items)
  //fmt.Println(string(data))
  // fmt.Println(resp)
  // data, err := ioutil.ReadAll(resp.Body)

  if err != nil {
   fmt.Println(err)
  } 

  json.NewEncoder(w).Encode(string(data))
  // method := "GET"
  // payload := strings.NewReader("")
  	
  // client := &http.Client {}
  // req, err := http.NewRequest(method, url) , payload)

  // if err != nil {
	 // fmt.Println(err)
  // } 
  // 	// req.Header.Add("authorization", APIKEY)
  // 	// req.Header.Add("accept", "application/json")
  // 	// req.Header.Add("accept-language", "en-US,en;q=0.8")
  // 	// req.Header.Add("content-type", "application/json")
  // res, err := client.Do(req)
  // defer res.Body.Close()
  // body, err := ioutil.ReadAll(res.Body)

  
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