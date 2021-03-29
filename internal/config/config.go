package config

import (
	"encoding/json"
	"fmt"
	"os"
)

type Config struct {
	Filepath string
	File     ConfigFile
}

type ConfigFile struct {
	PasswordFile PasswordFile `json:"password_file,omitempty"`
}

type PasswordFile struct {
	Path string `json:"path,omitempty"`
}

func NewConfig(filepath string) *Config {
	return &Config{
		Filepath: filepath,
		File:     ConfigFile{},
	}
}

func (c *Config) Read() error {
	return read(c.Filepath, c.File)
}

func (c *Config) Save() error {
	return write(c.Filepath, c.File)
}

func read(filepath string, config interface{}) error {
	f, err := os.Open(filepath)
	if err != nil {
		return fmt.Errorf("config: error while opening file %s: %v", filepath, err)
	}
	defer f.Close()

	dec := json.NewDecoder(f)
	return dec.Decode(config)
}

func write(filepath string, config interface{}) error {
	f, err := os.OpenFile(filepath, os.O_CREATE|os.O_WRONLY|os.O_TRUNC, 0644)
	if err != nil {
		return fmt.Errorf("config: error while opening file %s: %v", filepath, err)
	}
	defer f.Close()

	enc := json.NewEncoder(f)
	enc.SetIndent("", "    ")
	return enc.Encode(config)
}
