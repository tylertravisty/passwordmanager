package securefile

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
	bcryptCost   = 11
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

// ReadSaver stores the filepath and password of the secure file to be saved and read.
type ReadSaver struct {
	Filepath string
	Password string
}

// Read reads the ciphertext from the filepath and decrypts the data using the password.
func (rs *ReadSaver) Read() ([]byte, error) {
	fileBytes, err := ioutil.ReadFile(rs.Filepath)
	if err != nil {
		return nil, fmt.Errorf("Could not read file %s: %v", rs.Filepath, err)
	}

	magic := magicNumber()

	fileSignature, salt, bcryptHash, nonce, ciphertext := fileBytes[:len(magic)], fileBytes[len(magic):len(magic)+keySaltSize], fileBytes[len(magic)+keySaltSize:len(magic)+keySaltSize+bcryptSize], fileBytes[len(magic)+keySaltSize+bcryptSize:len(magic)+keySaltSize+bcryptSize+gcmNonceSize], fileBytes[len(magic)+keySaltSize+bcryptSize+gcmNonceSize:]

	if !bytes.Equal(fileSignature, magic) {
		return nil, fmt.Errorf("File signature does not match magic number")
	}

	key := pbkdf2.Key([]byte(rs.Password), salt, keyIter, keyLength, sha256.New)

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

// Save encrypts the plaintext data with the provided password and saves the ciphertext at the filepath.
func (rs *ReadSaver) Save(plaintext []byte) error {
	fulltext, err := addPrefix(plaintext)
	if err != nil {
		return fmt.Errorf("Could not add byte prefix to plaintext: %v", err)
	}

	fmt.Println("Salt")
	salt, err := libpassword.Random(keySaltSize)
	if err != nil {
		return fmt.Errorf("Error while generating salt for encryption key: %v", err)
	}

	fmt.Println("Key")
	key := pbkdf2.Key([]byte(rs.Password), salt, keyIter, keyLength, sha256.New)

	fmt.Println("BCrypt")
	bcryptHash, err := bcrypt.GenerateFromPassword(key, bcryptCost)
	if len(bcryptHash) != bcryptSize {
		return fmt.Errorf("Length of generated bcrypt hash %d does not equal expected bcrypt hash size %d", len(bcryptHash), bcryptSize)
	}

	fmt.Println("New cipher")
	c, err := aes.NewCipher(key)
	if err != nil {
		return fmt.Errorf("Error while creating new AES cipher: %v", err)
	}

	fmt.Println("New GCM")
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

	fmt.Println("Seal")
	ciphertext := gcm.Seal(nil, nonce, fulltext, nil)

	magic := magicNumber()

	fileBytes := []byte{}

	fileBytes = append(fileBytes, magic...)
	fileBytes = append(fileBytes, salt...)
	fileBytes = append(fileBytes, bcryptHash...)
	fileBytes = append(fileBytes, nonce...)
	fileBytes = append(fileBytes, ciphertext...)

	fmt.Println("Write")
	err = ioutil.WriteFile(rs.Filepath, fileBytes, 0644)
	if err != nil {
		return fmt.Errorf("Error while writing to file: %v", err)
	}

	return nil
}
