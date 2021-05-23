package securefile

import (
	"os"
	"testing"
)

const (
	integrationTestEnvVar = "SECUREFILE_INTEGRATION_TEST"
)

func TestMain(m *testing.M) {
	exitCode := run(m)
	os.Exit(exitCode)
}

func run(m *testing.M) int {
	return m.Run()
}

func TestReadReadsSecureFile(t *testing.T) {
	fileInt := os.Getenv(integrationTestEnvVar)
	if fileInt == "" {
		t.Skipf("Set %s to run this test.", integrationTestEnvVar)
	}

	tests := []struct {
		name      string
		filepath  string
		password  string
		plaintext string
	}{
		{"withPasswordAndPlaintext", "./securefile.test", "testpassword1234!@#$", "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book."},
		{"withEmptyPlaintext", "./securefile.test", "testpassword1234!@#$", ""},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			rs := &ReadSaver{
				Filepath: tt.filepath,
				Password: tt.password,
			}

			err := rs.Save([]byte(tt.plaintext))
			if err != nil {
				t.Fatalf("Failed to save securefile: %v", err)
			}
			defer func() {
				err := os.Remove(rs.Filepath)
				if err != nil {
					t.Fatalf("Want os.Remove() err = nil, got: %v", err)
				}
			}()

			got, err := rs.Read()
			if err != nil {
				t.Fatalf("Want Read() err = nil, got: %v", err)
			}

			want := tt.plaintext

			if string(got) != want {
				t.Fatalf("Plaintext read from file: `%s`; want `%s`", string(got), want)
			}
		})
	}
}

func TestSaveWritesSecureFile(t *testing.T) {
	fileInt := os.Getenv(integrationTestEnvVar)
	if fileInt == "" {
		t.Skipf("Set %s to run this test.", integrationTestEnvVar)
	}

	tests := []struct {
		name      string
		filepath  string
		password  string
		plaintext string
	}{
		{"withPasswordAndPlaintext", "./securefile.test", "testpassword1234!@#$", "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book."},
		{"withEmptyPlaintext", "./securefile.test", "testpassword1234!@#$", ""},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			rs := &ReadSaver{
				Filepath: tt.filepath,
				Password: tt.password,
			}

			err := rs.Save([]byte(tt.plaintext))
			if err != nil {
				t.Fatalf("Want Save() err = nil, got: %v", err)
			}
			defer func() {
				err := os.Remove(rs.Filepath)
				if err != nil {
					t.Fatalf("Want os.Remove() err = nil, got: %v", err)
				}
			}()

			_, err = os.Stat(rs.Filepath)
			if err != nil {
				if os.IsNotExist(err) {
					t.Fatalf("File `%s` does not exist", rs.Filepath)
				}
				t.Fatalf("Stat on file `%s` returned err = %v", rs.Filepath, err)
			}
		})
	}
}
