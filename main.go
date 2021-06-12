package main

import (
	_ "embed"
	"fmt"

	"github.com/wailsapp/wails"
)

const (
	topDir     = ".travisty"
	configDir  = "passwordmanager"
	configFile = "passwordmanager.json"
)

func basic() string {
	return "World!"
}

//go:embed frontend/build/static/js/main.js
var js string

//go:embed frontend/build/static/css/main.css
var css string

func main() {
	pm := &PasswordManager{}

	app := wails.CreateApp(&wails.AppConfig{
		Width:     720,
		Height:    1440,
		Title:     "Password Manager",
		JS:        js,
		CSS:       css,
		Colour:    "#131313",
		Resizable: true,
	})
	app.Bind(pm)
	app.Bind(basic)
	app.Bind(checkPassword)
	app.Run()
}

func checkPassword(password string) bool {
	fmt.Println(password)
	if len(password)%2 == 0 {
		return true
	} else {
		return false
	}
}
