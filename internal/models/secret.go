package models

// SecretStore holds all secrets.
type SecretStore struct {
	Secrets map[string]Secret
}

// Secret holds a single entry.
type Secret struct {
	Category string
	Fields   []Field
}

// Field is a single field within each secret.
type Field struct {
	Name  string
	Type  string
	Value string
}
