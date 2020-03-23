package main 

import (
	"log"
	"net/http"
	"os"
	"github.com/joho/godotenv"
)

func main() {
	fs := http.FileServer(http.Dir("./internal/ui/static/"))
	mux := http.NewServeMux()

	mux.Handle("/static/", http.StripPrefix("/static", fs))
	mux.HandleFunc("/", home)
	mux.HandleFunc("/status", statusCheck)
	mux.HandleFunc("/createapplication", createApplication)
	mux.HandleFunc("/checkservice", checkServiceAvailability)
	mux.HandleFunc("/getplan", getPlanService)
	mux.HandleFunc("/createcustomer", createCustomer)
	mux.HandleFunc("/uploadproof", uploadProof)

	mux.HandleFunc("/checkservice", checkServiceAvailability)
	mux.HandleFunc("/getplanservice", getPlanService)
	mux.HandleFunc("/createcustomer", createCustomer)
	mux.HandleFunc("/upladproof", uploadProof)

	godotenv.Load()
	log.Println("Starting server on :"+os.Getenv("PORT"))
	err := http.ListenAndServe(":"+os.Getenv("PORT"), mux)
	log.Fatal(err)


	
}