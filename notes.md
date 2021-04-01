# Backend

### Doing
- Need more tests for password package:
    - Test passwords do NOT contain runes that shouldn't be included (for loop over password string)

### On deck
- Create data structure for holding passwords.
    - Create password.go in models.
    - Map with string keys (representing name of password) to standard password struct.
    - Standard password struct has name and category fields and array with all sub-fields.
    - Each sub-field has a name, value, type.
        - Example: [{name: "URL", value: "local.host", type: "text"}, {name: "Password", value: "supersecretpassword", type: "password"}, {name: "Username", value: "user@local.host", type: "text"}]
    - This data structure may have functions for generating passwords as well (or should this be somewhere else)?
- Encrypt data and write to file
- Decrypt/Read passwordfile
    - If password is wrong, display error to user.

### To Do
- Check if passwordfile exists
    - If it doesn't exist, create it.

# Frontend

### Doing

### On deck

### To Do
- Ask user for password (password screen)

# Future support
- Handle filepaths (config and passwordfile) for non-Nix operating systems (Windows)