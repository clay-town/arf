package main 

import (
	i "github.com/clay-town/arf/internal/arf"
	"log"
	"net/http"
	"os"
	"github.com/joho/godotenv"
)

var items i.Items

func main() {
	fs := http.FileServer(http.Dir("./internal/ui/static/"))
	mux := http.NewServeMux()

	mux.Handle("/static/", http.StripPrefix("/static", fs))
	mux.HandleFunc("/", home)
	mux.HandleFunc("/status", statusCheck)

	godotenv.Load()
	log.Println("Starting server on :"+os.Getenv("PORT"))
	err := http.ListenAndServe(":"+os.Getenv("PORT"), mux)
	log.Fatal(err)


	
}
