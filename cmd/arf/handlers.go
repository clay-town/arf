package main

import (
  i "github.com/clay-town/arf"
	"log"
	"net/http"
	"html/template"
	"encoding/json"
	"encoding/xml"
  "golang.org/x/net/html/charset"
  "bytes"
	"io/ioutil"
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
   return
  }
  defer resp.Body.Close()

  data, err := ioutil.ReadAll(resp.Body)
  if err != nil {
   fmt.Println(err)
   return
  } 

  reader := bytes.NewReader(data)
  decoder := xml.NewDecoder(reader)
  decoder.CharsetReader = charset.NewReaderLabel
  
  rss := i.Rss{}  
  err = decoder.Decode(&rss)
  if err != nil {
   fmt.Println(err)
   return
  } 

  // just a sample loop
  // 
  // for futher proof of concept we should now move this into another function,
  //  loop through the titles, 
  //    clean them of common words
  //    parse into words and check them against the subscriptions hash (not built yet)

  //        
  posts := rss.Channel.Items
  for i := 0; i < len(posts); i++{
    fmt.Println(posts[i].Title)
  }

  json.NewEncoder(w).Encode(string("hello world"))
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