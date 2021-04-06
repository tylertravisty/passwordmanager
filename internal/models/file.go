package models

import (
	"bytes"
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"crypto/sha256"
	"fmt"
	"io/ioutil"
	libpassword "passwordmanager/pkg/password"

	"golang.org/x/crypto/bcrypt"
	"golang.org/x/crypto/pbkdf2"
)

const (
	bcryptSize   = 60
	bcryptCost   = 20
	gcmNonceSize = 12
	keyIter      = 65536
	keyLength    = 32
	keySaltSize  = 16
)

func magicNumber() []byte {
	// Hex = 5EC2E75AFE
	return []byte{94, 194, 231, 90, 254}
}

func addPrefix(text []byte) ([]byte, error) {
	prefix := make([]byte, gcmNonceSize)

	_, err := rand.Read(prefix)
	if err != nil {
		return nil, fmt.Errorf("Error while reading random bytes: %v", err)
	}

	return append(prefix, text...), nil
}

func removePrefix(text []byte) []byte {
	return text[gcmNonceSize:]
}

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
	fileBytes, err := ioutil.ReadFile(fs.filepath)
	if err != nil {
		return nil, fmt.Errorf("Could not read file %s: %v", fs.filepath, err)
	}

	magic := magicNumber()

	fileSignature, salt, bcryptHash, nonce, ciphertext := fileBytes[:len(magic)], fileBytes[len(magic):len(magic)+keySaltSize], fileBytes[len(magic)+keySaltSize:len(magic)+keySaltSize+bcryptSize], fileBytes[len(magic)+keySaltSize+bcryptSize:len(magic)+keySaltSize+bcryptSize+gcmNonceSize], fileBytes[len(magic)+keySaltSize+bcryptSize+gcmNonceSize:]

	if !bytes.Equal(fileSignature, magic) {
		return nil, fmt.Errorf("File signature does not match magic number")
	}

	key := pbkdf2.Key([]byte(password), salt, keyIter, keyLength, sha256.New)

	err = bcrypt.CompareHashAndPassword(bcryptHash, key)
	if err != nil {
		return nil, fmt.Errorf("Could not verify password is valid: %v", err)
	}

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

	fulltext, err := gcm.Open(nil, nonce, ciphertext, nil)
	if err != nil {
		return nil, fmt.Errorf("Error while opening ciphertext: %v", err)
	}

	plaintext := removePrefix(fulltext)

	return plaintext, nil
}

func (fs *fileService) Save(password string, plaintext []byte) error {
	fulltext, err := addPrefix(plaintext)
	if err != nil {
		return fmt.Errorf("Could not add byte prefix to plaintext: %v", err)
	}

	salt, err := libpassword.Random(keySaltSize)
	if err != nil {
		return fmt.Errorf("Error while generating salt for encryption key: %v", err)
	}

	key := pbkdf2.Key([]byte(password), salt, keyIter, keyLength, sha256.New)

	bcryptHash, err := bcrypt.GenerateFromPassword(key, bcryptCost)
	if len(bcryptHash) != bcryptSize {
		return fmt.Errorf("Length of generated bcrypt hash %d does not equal expected bcrypt hash size %d", len(bcryptHash), bcryptSize)
	}

	c, err := aes.NewCipher(key)
	if err != nil {
		return fmt.Errorf("Error while creating new AES cipher: %v", err)
	}

	gcm, err := cipher.NewGCMWithNonceSize(c, gcmNonceSize)
	if err != nil {
		return fmt.Errorf("Error while creating new GCM: %v", err)
	}

	if len(fulltext) < gcm.NonceSize() {
		return fmt.Errorf("Plaintext is smaller than GCM nonce size")
	}

	nonce, err := libpassword.Random(gcmNonceSize)
	if err != nil {
		return fmt.Errorf("Error while generating nonce for GCM: %v", err)
	}

	ciphertext := gcm.Seal(nil, nonce, fulltext, nil)

	magic := magicNumber()

	fileBytes := []byte{}

	fileBytes = append(fileBytes, magic...)
	fileBytes = append(fileBytes, salt...)
	fileBytes = append(fileBytes, bcryptHash...)
	fileBytes = append(fileBytes, nonce...)
	fileBytes = append(fileBytes, ciphertext...)

	err = ioutil.WriteFile(fs.filepath, fileBytes, 0644)
	if err != nil {
		return fmt.Errorf("Error while writing to file: %v", err)
	}

	return nil
}
