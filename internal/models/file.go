package models

// FileService manages the files for the app.
type FileService interface {
}

// NewFileService returns a new FileService.
func NewFileService(filepath string) FileService {
	return &fileService{
		filepath: filepath,
	}
}

var _ FileService = &fileService{}

type fileService struct {
	filepath string
}
