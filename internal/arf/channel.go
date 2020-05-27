package arf

type Channel struct {
	Title string `xml:"title"`
	Items []Item `xml:"item"`
}