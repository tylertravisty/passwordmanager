# Backend

### Doing

### On deck
- Create data structure for holding secrets.
    - Each sub-field has a name, value, type.
        - Example: [{name: "URL", value: "local.host", type: "text"}, {name: "Password", value: "supersecretpassword", type: "password"}, {name: "Username", value: "user@local.host", type: "text"}]
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