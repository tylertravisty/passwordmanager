# Backend

### Doing
- On start, check if password file exists
    - If it doesn't exist at path from config,
        - ask user if a password file already exists and have user give filepath
        - or have user indicate no password file exists and new one needs to be created
            - ask user if password file should be stored at default location or different location
    - Ask user where he wants the password file saved; store path in config.
- Unlock securefile with password passed from frontend, return success/fail to user.

### On deck

- Allow user to change filepath from unlock screen (in some kind of menu panel)
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
- Return password success/fail to user
- Create dialogue for user to select filepath for password file

### On deck
- Allow user to change filepath from unlock screen (in some kind of menu panel)

### To Do

# Future
- Handle filepaths (config and passwordfile) for non-Nix operating systems (Windows)
- Allow users to have multiple passwordfiles with different passwords that can be selected from the unlock screen