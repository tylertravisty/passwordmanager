package secret

// Store holds all secret entries.
type Store struct {
	Entries map[string]Entry
}

// Entry holds a single secret entry.
type Entry struct {
	Category string
	Fields   []Field
}

// Field is a single field within each secret.
type Field struct {
	Name  string
	Type  string
	Value string
}
