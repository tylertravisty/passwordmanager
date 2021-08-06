package main

import (
	"encoding/json"
	"fmt"
	"os"
	"os/user"
	"passwordmanager/internal/config"
	"passwordmanager/internal/secret"
	"passwordmanager/pkg/securefile"
	"reflect"

	"github.com/wailsapp/wails"
)

type PasswordManager struct {
	Config  *config.Config
	Store   *secret.Store
	rs      securefile.ReadSaver
	log     *wails.CustomLogger
	runtime *wails.Runtime
}

func (pm *PasswordManager) WailsInit(runtime *wails.Runtime) error {
	pm.runtime = runtime
	pm.log = runtime.Log.New("Password Manager")
	return nil
}

func (pm *PasswordManager) GetPasswordFilePath() (string, error) {
	if pm.Config.File.PasswordFile.Path == "" {
		return "", ErrPasswordFilePathEmpty
	}

	return pm.Config.File.PasswordFile.Path, nil
}

func (pm *PasswordManager) GetSecretStore() (string, error) {
	if pm.Store == nil {
		return "", ErrSecretStoreNotSet
	}

	secretStoreJSON, err := json.Marshal(pm.Store)
	if err != nil {
		pm.log.Errorf("Failed to marshal secret store in JSON object: %v", err)
		return "", ErrSecretStoreRead
	}

	return string(secretStoreJSON), nil
}

func (pm *PasswordManager) SetSecretStore(secretStoreStr string) error {
	pmStoreStr, err := json.Marshal(*pm.Store)
	if err != nil {
		pm.log.Errorf("Failed to marhsal password manager store: %v", err)
		return ErrSecretStoreWrite
	}

	var tempStore secret.Store
	err = json.Unmarshal(pmStoreStr, &tempStore)
	if err != nil {
		pm.log.Errorf("Failed to unmarhsal password manager store string: %v", err)
		return ErrSecretStoreWrite
	}

	err = json.Unmarshal([]byte(secretStoreStr), pm.Store)
	if err != nil {
		pm.log.Errorf("Failed to unmarhsal secret store string: %v", err)
		return ErrSecretStoreWrite
	}

	if reflect.DeepEqual(tempStore, *pm.Store) {
		fmt.Println("EQUAL!!")
		return nil
	}
	fmt.Println("NOT EQUAL!!")

	err = pm.rs.Save([]byte(secretStoreStr))
	if err != nil {
		pm.log.Errorf("Failed to update secret store: %v", err)
		return ErrSecretStoreWrite
	}

	return nil
}

func (pm *PasswordManager) NewPasswordFile(unlockPassword string) (string, error) {
	filepath := pm.runtime.Dialog.SelectSaveFile()
	if filepath == "" {
		return "", ErrPasswordFilePathInvalid
	}

	pm.rs.Filepath = filepath
	pm.rs.Password = unlockPassword

	newStore := secret.Store{
		Name: "New Secret Store",
		Categories: []secret.Category{
			{
				Secrets: []secret.Secret{},
			},
		},
	}
	jsonStore, err := json.Marshal(newStore)
	if err != nil {
		pm.log.Errorf("Failed to marshal new secret store into JSON object: %v", err)
		// TODO: should there be a different error here?
		return "", ErrPasswordFileSave
	}

	err = pm.rs.Save(jsonStore)
	if err != nil {
		// TODO: log error from Save to application log file
		pm.log.Errorf("Failed to save password file: %v", err)
		return "", ErrPasswordFileSave
	}

	pm.Config.File.PasswordFile.Path = filepath
	err = pm.Config.Save()
	if err != nil {
		// TODO: specify what function logged this error
		pm.log.Errorf("Failed to save config file: %v", err)
		return "", ErrConfigFileSave
	}

	return filepath, nil
}

func (pm *PasswordManager) LockPasswordFile() error {
	// TODO: check if string can be overwriten in memory
	pm.rs.Password = ""
	// TODO: check if Store can be manually wiped from memory
	pm.Store = nil

	return nil
}

func (pm *PasswordManager) UnlockPasswordFile(unlockPassword string) error {
	pm.rs.Filepath = pm.Config.File.PasswordFile.Path
	pm.rs.Password = unlockPassword

	jsonStore, err := pm.rs.Read()
	if err != nil {
		if err == securefile.ErrInvalidPassword {
			return ErrInvalidUnlockPassword
		}
		pm.log.Errorf("Failed to read password file: %v", err)
		return ErrPasswordFileRead
	}

	var store secret.Store
	err = json.Unmarshal(jsonStore, &store)
	if err != nil {
		pm.log.Errorf("Failed to unmarshal secret store into JSON object: %v", err)
		// TODO: should there be a different error here?
		return ErrPasswordFileRead
	}
	pm.Store = &store

	return nil
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
