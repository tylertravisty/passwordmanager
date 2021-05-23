package password

import (
	"strings"
	"testing"
)

func TestRuneCount(t *testing.T) {
	tests := []struct {
		name string
		arg  []rune
		want int
	}{
		{"upperRunes", upperRunes, 26},
		{"lowerRunes", lowerRunes, 26},
		{"numberRunes", numberRunes, 10},
		{"symbolRunes", symbolRunes, 32},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := len(tt.arg)
			if got != tt.want {
				t.Fatalf("len(%s) = %d, want %d", tt.name, got, tt.want)
			}
		})
	}
}

func TestGenerateReturnsPasswordWithCorrectSize(t *testing.T) {
	tests := []struct {
		upper  bool
		lower  bool
		number bool
		symbol bool
		size   int
	}{
		{true, true, true, true, 3},
		{true, true, true, true, 45},
		{true, false, false, false, 20},
		{false, true, true, false, 100},
	}

	for _, tt := range tests {
		password, err := Generate(tt.upper, tt.lower, tt.number, tt.symbol, tt.size)
		if err != nil {
			t.Fatalf("Want Generate() err = nil, got %v", err)
		}

		len := len(password)
		if len != tt.size {
			t.Fatalf("len(password) = %d want %d", len, tt.size)
		}
	}
}

func TestGenerateReturnsErrorWithBadInput(t *testing.T) {
	tests := []struct {
		upper  bool
		lower  bool
		number bool
		symbol bool
		size   int
	}{
		{false, false, false, false, 3},
		{true, true, true, true, 0},
		{true, false, false, false, -20},
	}

	for _, tt := range tests {
		_, err := Generate(tt.upper, tt.lower, tt.number, tt.symbol, tt.size)
		if err == nil {
			t.Fatalf("Generate() err = nil, want not nil")
		}
	}
}

func TestGenerateReturnsPasswordWithCorrectRunes(t *testing.T) {
	tests := []struct {
		upper  bool
		lower  bool
		number bool
		symbol bool
		size   int
	}{
		{true, false, false, false, 100},
		{false, true, false, false, 100},
		{false, false, true, false, 100},
		{false, false, false, true, 100},
		{true, true, false, false, 100},
		{true, false, true, false, 100},
		{true, false, false, true, 100},
		{false, true, true, false, 100},
		{false, true, false, true, 100},
		{false, false, true, true, 100},
		{true, true, true, false, 100},
		{true, true, false, true, 100},
		{true, false, true, true, 100},
		{false, true, true, true, 100},
		{true, true, true, true, 100},
	}

	for _, tt := range tests {
		password, err := Generate(tt.upper, tt.lower, tt.number, tt.symbol, tt.size)
		if err != nil {
			t.Fatalf("Want Generate() err = nil, got %v", err)
		}

		for _, r := range password {
			if !tt.upper && strings.ContainsRune(string(upperRunes), r) {
				t.Fatalf("Got password with upper rune, want no upper runes")
			}

			if !tt.lower && strings.ContainsRune(string(lowerRunes), r) {
				t.Fatalf("Got password with lower rune, want no lower runes")
			}

			if !tt.number && strings.ContainsRune(string(numberRunes), r) {
				t.Fatalf("Got password with number rune, want no number runes")
			}

			if !tt.symbol && strings.ContainsRune(string(symbolRunes), r) {
				t.Fatalf("Got password with symbol rune, want no symbol runes")
			}
		}
	}
}

func TestRandomReturnsCorrectNumberOfBytes(t *testing.T) {
	tests := []struct {
		size int
	}{
		{0},
		{3},
		{45},
		{20},
		{100},
	}

	for _, tt := range tests {
		randomBytes, err := Random(tt.size)
		if err != nil {
			t.Fatalf("Want Random() err = nil, got %v", err)
		}

		len := len(randomBytes)
		if len != tt.size {
			t.Fatalf("len(randomBytes) = %d, want %d", len, tt.size)
		}
	}
}

func TestRandomReturnsErrorWithNegativeSize(t *testing.T) {
	tests := []struct {
		size int
	}{
		{-1},
		{-3},
		{-45},
		{-20},
		{-100},
	}

	for _, tt := range tests {
		_, err := Random(tt.size)
		if err == nil {
			t.Fatalf("Random() err = nil, want not nil")
		}
	}
}
