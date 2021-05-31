package main

import (
	_ "embed"
	"fmt"

	"github.com/wailsapp/wails"
)

func basic() string {
	return "World!"
}

//go:embed frontend/build/static/js/main.js
var js string

//go:embed frontend/build/static/css/main.css
var css string

func main() {
	// config := config.NewConfig("./build/config.json")
	// fmt.Println(config)

	app := wails.CreateApp(&wails.AppConfig{
		Width:     720,
		Height:    1440,
		Title:     "Password Manager",
		JS:        js,
		CSS:       css,
		Colour:    "#131313",
		Resizable: true,
	})
	app.Bind(basic)
	app.Bind(printPassword)
	app.Run()
}

func printPassword(password string) {
	fmt.Println("Password: ", password)
}
