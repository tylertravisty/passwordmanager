package models

type FileService interface {
}

func NewFileService(filepath string) FileService {
	return &fileService{
		filepath: filepath,
	}
}

var _ FileService = &fileService{}

type fileService struct {
	filepath string
}
