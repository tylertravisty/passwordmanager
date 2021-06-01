package main

const (
	ErrPasswordFilePathEmpty mainError = "Password file path is empty"

	ErrPasswordFileMissing mainError = "Password file is missing"

	ErrPasswordFileOpen mainError = "Failed to open password file"
)

type mainError string

func (e mainError) Error() string {
	return string(e)
}
