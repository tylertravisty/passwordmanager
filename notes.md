# Backend

### Doing
- Check if passwordfile exists
    - If it doesn't exist, create it.

### On deck
- Write test for password.Random function
- Create data structure for holding secrets.
    - Each sub-field has a name, value, type.
        - Example: [{name: "URL", value: "local.host", type: "text"}, {name: "Password", value: "supersecretpassword", type: "password"}, {name: "Username", value: "user@local.host", type: "text"}]
- Decrypt/Read passwordfile
    - If password is wrong, display error to user.

### To Do
- Add profiles/directories that can be used to organize password entries.
- Create more tests for securefile Read/Save functions. Test error is returned when expected.

# Frontend

### Doing

### On deck

### To Do
- Ask user for password (password screen)

# Future support
- Handle filepaths (config and passwordfile) for non-Nix operating systems (Windows)