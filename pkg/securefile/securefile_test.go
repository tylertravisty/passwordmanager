package securefile

import (
	"os"
	"testing"
)

const (
	integrationTest = "SECUREFILE_INTEGRATION_TEST"
)

func TestSaveWritesFile(t *testing.T) {
	fileInt := os.Getenv(integrationTest)
	if fileInt == "" {
		t.Skipf("Set %s to run this test.", integrationTest)
	}

	rs := ReadSaver{
		Filepath: "./passwordstore.test",
		Password: "testpassword1234",
	}

	plaintext := "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book."

	err := rs.Save([]byte(plaintext))
	if err != nil {
		t.Fatalf("Save() err = %v, want nil", err)
	}

	_, err = os.Stat(rs.Filepath)
	if err != nil {
		if os.IsNotExist(err) {
			t.Fatalf("File `%s` does not exist", rs.Filepath)
		}
		t.Fatalf("Stat on file `%s` returned err = %v", rs.Filepath, err)
	}

}
