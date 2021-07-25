package main

import (
	"fmt"
	"os"
	"os/user"
	"passwordmanager/internal/config"

	"github.com/wailsapp/wails"
)

type PasswordManager struct {
	Config  *config.Config
	runtime *wails.Runtime
}

func (pm *PasswordManager) WailsInit(runtime *wails.Runtime) error {
	pm.runtime = runtime
	return nil
}

func (pm *PasswordManager) GetPasswordFilePath() (string, error) {
	if pm.Config.File.PasswordFile.Path == "" {
		return "", ErrPasswordFilePathEmpty
	}

	return pm.Config.File.PasswordFile.Path, nil
}

func (pm *PasswordManager) NewPasswordFile() (string, error) {
	filepath := pm.runtime.Dialog.SelectSaveFile()
	fmt.Println(filepath)
	if filepath == "" {
		return "", ErrPasswordFilePathInvalid
	}
	return filepath, nil
}

func (pm *PasswordManager) OnStart() error {
	cfg, err := setupConfig()
	if err != nil {
		return fmt.Errorf("Error while setting up config: %v", err)
	}
	pm.Config = cfg

	if pm.Config.File.PasswordFile.Path == "" {
		return ErrPasswordFilePathEmpty
	}

	_, err = os.Stat(pm.Config.File.PasswordFile.Path)
	if err != nil {
		if os.IsNotExist(err) {
			return ErrPasswordFileMissing
		}
		return fmt.Errorf("Error while checking if password file exists at `%s`: %v", pm.Config.File.PasswordFile.Path, err)
	}

	return nil
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
