package main

const (
	ErrConfigFileSave mainError = "Failed to save config file"

	ErrPasswordFilePathInvalid mainError = "Password file path is not valid"

	ErrPasswordFilePathEmpty mainError = "Password file path is empty"

	ErrPasswordFileMissing mainError = "Password file is missing"

	ErrPasswordFileOpen mainError = "Failed to open password file"

	ErrPasswordFileSave mainError = "Failed to save password file"
)

type mainError string

func (e mainError) Error() string {
	return string(e)
}
