package secret

// Store holds all secret entries.
type Store struct {
	Name       string     `json:"name,omitempty"`
	Categories []Category `json:"categories"`
}

// Category organizes the secrets.
type Category struct {
	Name    string   `json:"name,omitempty"`
	Secrets []Secret `json:"secrets"`
}

// Secret holds individual entries.
type Secret struct {
	Name    string  `json:"name,omitempty"`
	Entries []Entry `json:"entries"`
}

// Entry is a single entry within each secret.
type Entry struct {
	Name   string  `json:"name,omitempty"`
	Type   string  `json:"type,omitempty"`
	Value  string  `json:"value,omitempty"`
	Fields []Field `json:"fields"`
}

// Field allows for entries to be expanded.
type Field struct {
	Name  string `json:"name,omitempty"`
	Type  string `json:"type,omitempty"`
	Value string `json:"value,omitempty"`
}
