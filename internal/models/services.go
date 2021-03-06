package models

import "passwordmanager/pkg/securefile"

// Services holds all of the services for the app.
type Services struct {
	FileS *securefile.ReadSaver
}

// ServicesConfig defines the type all With* functions need to return.
type ServicesConfig func(*Services) error

// NewServices runs all ServicesConfig functions.
func NewServices(cfgs ...ServicesConfig) (*Services, error) {
	var s Services
	for _, cfg := range cfgs {
		if err := cfg(&s); err != nil {
			return nil, err
		}
	}
	return &s, nil
}

// WithFile instantiates the FileService.
func WithFile(path string) ServicesConfig {
	return func(s *Services) error {
		s.FileS = &securefile.ReadSaver{Filepath: path}

		return nil
	}
}
