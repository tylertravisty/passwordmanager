package securefile

import (
	"os"
	"testing"
)

const (
	integrationTestEnvVar = "SECUREFILE_INTEGRATION_TEST"
	testFilepath          = "./securefile.test"
	testPassword          = "testpassword1234!@#$"
	testPlaintext         = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book."
)

func TestMain(m *testing.M) {
	exitCode := run(m)
	os.Exit(exitCode)
}

func run(m *testing.M) int {
	return m.Run()
}

func TestSaveWritesSecureFile(t *testing.T) {
	fileInt := os.Getenv(integrationTestEnvVar)
	if fileInt == "" {
		t.Skipf("Set %s to run this test.", integrationTestEnvVar)
	}

	rs := &ReadSaver{
		Filepath: testFilepath,
		Password: testPassword,
	}

	err := rs.Save([]byte(testPlaintext))
	if err != nil {
		t.Fatalf("Want Save() err = nil, got: %v", err)
	}
	t.Cleanup(func() {
		err := os.Remove(rs.Filepath)
		if err != nil {
			t.Fatalf("Want os.Remove() err = nil, got: %v", err)
		}
	})

	_, err = os.Stat(rs.Filepath)
	if err != nil {
		if os.IsNotExist(err) {
			t.Fatalf("File `%s` does not exist", rs.Filepath)
		}
		t.Fatalf("Stat on file `%s` returned err = %v", rs.Filepath, err)
	}

}

func TestReadReadsSecureFile(t *testing.T) {
	fileInt := os.Getenv(integrationTestEnvVar)
	if fileInt == "" {
		t.Skipf("Set %s to run this test.", integrationTestEnvVar)
	}

	rs := &ReadSaver{
		Filepath: testFilepath,
		Password: testPassword,
	}

	err := rs.Save([]byte(testPlaintext))
	if err != nil {
		t.Fatalf("Failed to save securefile: %v", err)
	}
	t.Cleanup(func() {
		err := os.Remove(rs.Filepath)
		if err != nil {
			t.Fatalf("Want os.Remove() err = nil, got: %v", err)
		}
	})

	got, err := rs.Read()
	if err != nil {
		t.Fatalf("Want Read() err = nil, got: %v", err)
	}

	want := testPlaintext

	if string(got) != want {
		t.Fatalf("Plaintext read from file: `%s`; want `%s`", string(got), want)
	}
}
