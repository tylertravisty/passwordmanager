package models

type Services struct {
	FileS FileService
}

type ServicesConfig func(*Services) error

func NewServices(cfgs ...ServicesConfig) (*Services, error) {
	var s Services
	for _, cfg := range cfgs {
		if err := cfg(&s); err != nil {
			return nil, err
		}
	}
	return &s, nil
}

func WithFile(path string) ServicesConfig {
	return func(s *Services) error {
		s.FileS = NewFileService(path)

		return nil
	}
}
