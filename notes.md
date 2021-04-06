# Backend

### Doing
- Test Read/Save functions
- Check if passwordfile exists
    - If it doesn't exist, create it.
    - File must have a minimum number of bytes -> Create file with 32-byte string in the beginning.
- Encrypt data and write to file
    - PBKDF2(password, salt) = Key: Use to encrypt file; do NOT store key; need to store salt at beginning of file.
        - Salt size = 16 bytes
    - bcrypt(Key): Store at beginning of file to validate password.
    - Save at beginning of file: [PBKDF2_salt][bcrypt_hash]

### On deck
- Write test for password.Random function
- Create data structure for holding secrets.
    - Each sub-field has a name, value, type.
        - Example: [{name: "URL", value: "local.host", type: "text"}, {name: "Password", value: "supersecretpassword", type: "password"}, {name: "Username", value: "user@local.host", type: "text"}]
- Decrypt/Read passwordfile
    - If password is wrong, display error to user.

### To Do
- Add profiles/directories that can be used to organize password entries.

# Frontend

### Doing

### On deck

### To Do
- Ask user for password (password screen)

# Future support
- Handle filepaths (config and passwordfile) for non-Nix operating systems (Windows)