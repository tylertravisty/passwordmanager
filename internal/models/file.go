package models

import (
	"crypto/aes"
	"crypto/cipher"
	"crypto/sha256"
	"fmt"
	"io/ioutil"

	"golang.org/x/crypto/bcrypt"
	"golang.org/x/crypto/pbkdf2"
)

const (
	keyIter      = 65536
	keyLength    = 32
	keySaltSize  = 16
	bcryptSize   = 60
	bcryptCost   = 20
	gcmNonceSize = 12
)

// FileService manages the files for the app.
type FileService interface {
	Read(password string) ([]byte, error)
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

func (fs *fileService) Read(password string) ([]byte, error) {
	rawFile, err := ioutil.ReadFile(fs.filepath)
	if err != nil {
		return nil, fmt.Errorf("Could not read file %s: %v", fs.filepath, err)
	}

	salt, bcryptHash, nonce, ciphertext := rawFile[:keySaltSize], rawFile[keySaltSize:keySaltSize+bcryptSize], rawFile[keySaltSize+bcryptSize:keySaltSize+bcryptSize+gcmNonceSize], rawFile[keySaltSize+bcryptSize+gcmNonceSize:]

	err = bcrypt.CompareHashAndPassword(bcryptHash, []byte(password))
	if err != nil {
		return nil, fmt.Errorf("Could not verify password is valid: %v", err)
	}

	key := pbkdf2.Key([]byte(password), salt, keyIter, keyLength, sha256.New)

	c, err := aes.NewCipher(key)
	if err != nil {
		return nil, fmt.Errorf("Error while creating new AES cipher: %v", err)
	}

	gcm, err := cipher.NewGCMWithNonceSize(c, gcmNonceSize)
	if err != nil {
		return nil, fmt.Errorf("Error while creating new GCM: %v", err)
	}

	if len(ciphertext) < gcm.NonceSize() {
		return nil, fmt.Errorf("Ciphertext is smaller than GCM nonce size")
	}

	plaintext, err := gcm.Open(nil, nonce, ciphertext, nil)
	if err != nil {
		return nil, fmt.Errorf("Error while opening ciphertext: %v", err)
	}

	return plaintext, nil
}
