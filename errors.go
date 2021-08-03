package main

const (
	ErrConfigFileSave mainError = "Failed to save config file"

	ErrInvalidUnlockPassword mainError = "Unlock password is invalid"

	ErrPasswordFilePathInvalid mainError = "Password file path is not valid"

	ErrPasswordFilePathEmpty mainError = "Password file path is empty"

	ErrPasswordFileMissing mainError = "Password file is missing"

	ErrPasswordFileOpen mainError = "Failed to open password file"

	ErrPasswordFileRead mainError = "Failed to read password file"

	ErrPasswordFileSave mainError = "Failed to save password file"

	ErrSecretStoreNotSet mainError = "Secret store has not been set"

	ErrSecretStoreRead mainError = "Failed to read secret store"

	ErrSecretStoreWrite mainError = "Failed to write secret store"
)

type mainError string

func (e mainError) Error() string {
	return string(e)
}
