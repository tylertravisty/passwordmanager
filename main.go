package main

import (
	_ "embed"
	"fmt"
	"log"
	"os"
	"os/user"
	"passwordmanager/internal/config"

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
	cfg, err := onStart()
	if err != nil {
		switch err {
		case ErrPasswordFilePathEmpty:
			// Handle missing password file path - ask user to create new password file or to provide path to existing password file
		case ErrPasswordFileMissing:
			// Handle missing password file - tell user password file is missing and provide path - ask user to: 1) put file back and retry, 2) provide different path and retry, 3) create new password file.
		default:
			// Alert user to problem
		}
		fmt.Println(cfg)
		log.Fatal(err)
	}

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
	app.Bind(checkPassword)
	app.Run()
}

func onStart() (*config.Config, error) {
	cfg, err := setupConfig()
	if err != nil {
		return nil, fmt.Errorf("Error while setting up config: %v", err)
	}

	if cfg.File.PasswordFile.Path == "" {
		return cfg, ErrPasswordFilePathEmpty
	}

	_, err = os.Stat(cfg.File.PasswordFile.Path)
	if err != nil {
		if os.IsNotExist(err) {
			return cfg, ErrPasswordFileMissing
		}
		return nil, fmt.Errorf("Error while checking if password file exists at `%s`: %v", cfg.File.PasswordFile.Path, err)
	}

	return cfg, nil
}

func setupConfig() (*config.Config, error) {
	u, err := user.Current()
	if err != nil {
		return nil, err
	}

	homeDir := u.HomeDir

	topPath := buildPath(homeDir, topDir)
	_, err = os.Stat(topPath)
	if err != nil {
		if os.IsNotExist(err) {
			err = os.Mkdir(topPath, 0755)
			if err != nil {
				return nil, fmt.Errorf("Error while making top directory `%s`: %v", topPath, err)
			}
		} else {
			return nil, fmt.Errorf("Error while checking if top directory exists at `%s`: %v", topPath, err)
		}
	}

	configPath := buildPath(homeDir, topDir, configDir)
	_, err = os.Stat(configPath)
	if err != nil {
		if os.IsNotExist(err) {
			err = os.Mkdir(configPath, 0755)
			if err != nil {
				return nil, fmt.Errorf("Error while making config directory `%s`: %v", configPath, err)
			}
		} else {
			return nil, fmt.Errorf("Error while checking if config directory exists at `%s`: %v", configPath, err)
		}
	}

	configFilePath := buildPath(homeDir, topDir, configDir, configFile)
	cfg := config.NewConfig(configFilePath)

	_, err = os.Stat(configFilePath)
	if err != nil {
		if os.IsNotExist(err) {
			err = cfg.Save()
			if err != nil {
				return nil, fmt.Errorf("Error while saving config file: %v", err)
			}
		} else {
			return nil, fmt.Errorf("Error while checking if config file exists at `%s`: %v", configPath, err)
		}
	}

	err = cfg.Read()
	if err != nil {
		return nil, fmt.Errorf("Error while reading config file: %v", err)
	}

	return cfg, nil
}

func buildPath(base string, parts ...string) string {
	path := base
	for _, part := range parts {
		path = path + "/" + part
	}

	return path
}

func checkPassword(password string) bool {
	fmt.Println(password)
	if len(password)%2 == 0 {
		return true
	} else {
		return false
	}
}
