package password

import (
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
			t.Fatalf("Generate() err = %v, want nil", err)
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

// func TestGenerateReturnsPasswordWithCorrectRunes(t *testing.T) {
// 	tests := []struct {
// 		upper  bool
// 		lower  bool
// 		number bool
// 		symbol bool
// 		size   int
// 	}{
// 		{true, false, false, false, 100},
// 		{false, true, false, false, 100},
// 		{false, false, true, false, 100},
// 		{false, false, false, true, 100},
// 		{true, true, true, true, 100},
// 	}
// }
