package password

import (
	"crypto/rand"
	"fmt"
	"math/big"
)

var upperRunes = []rune("ABCDEFGHIJKLMNOPQRSTUVWXYZ")
var lowerRunes = []rune("abcdefghijklmnopqrstuvwxyz")
var numberRunes = []rune("0123456789")
var symbolRunes = []rune("!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~")

// Generate generates a random string with the specified size containing runes from the designated sets.
func Generate(upper, lower, number, symbol bool, size int) (string, error) {
	if size <= 0 {
		return "", fmt.Errorf("password: Password size must be greater than 0")
	}

	runeSet := []rune{}

	if upper {
		runeSet = append(runeSet, upperRunes...)
	}
	if lower {
		runeSet = append(runeSet, lowerRunes...)
	}
	if number {
		runeSet = append(runeSet, numberRunes...)
	}
	if symbol {
		runeSet = append(runeSet, symbolRunes...)
	}

	if len(runeSet) == 0 {
		return "", fmt.Errorf("password: No runes selected for password")
	}

	password := make([]rune, size)
	for i := 0; i < size; i++ {
		n, err := rand.Int(rand.Reader, big.NewInt(int64(len(runeSet))))
		if err != nil {
			return "", fmt.Errorf("password: Error while generating random number: %v", err)
		}
		password[i] = runeSet[n.Int64()]
	}

	return string(password), nil
}
