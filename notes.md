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
- Add creation dates to each password to track how long a password has been used for (see below for alerting when password is too old).
- Save settings within password file. Make password file self-contained. Can be transferred to any system.
  - Include setting for when user should be alerted when password(s) expire.

### To Do
- Figure out Wails logging subsytem - can you specify a log file? If not, create custom log file functionality.
- Add profiles/directories that can be used to organize password entries.
- Create more tests for securefile Read/Save functions. Test error is returned when expected.

# Frontend

### Doing
- Implement Unlock page
  - decrypt the password file
  - redirect user to password manager screen
- In MainMenu - call GetPasswordFile() - if empty, tell user to create file.
  - Add functionality to create new file
    - Ask user for password
      - Check if password is complex (can be done in frontend).
        - red/yellow/green meter that indicates complexity of password
        - too simple/good/great
        - Add conditional to only show password complexity on first password input.
        - Only show password complexity once user starts typing (think about this behavior)
    - Show user dialog box to save file.
    - Generate new securefile using password and filepath from user input.
      - Handle any errors caused from permission issues at the time the file is being written to.
    - Send user to Unlock screen
      - If user hits "Cancel" button on save file screen, it does not redirect to Unlock - need to handle this case.
- Think about frontend with MemoryRouter like website: do not store data on frontend and pass around to different components. Each component calls the backend for state.
  - Render each component independently based on state from backend.
  - Get to each component from Router NOT from nested components in a parent render function.
- App will render *after* componentDidMount if state changes - so call onStart() in componentDidMount.
  - For Home component, if passwordfile doesn't exist, redirect to MainMenu, otherwise redirect to Unlock page.
- Return password success/fail to user
- Create dialogue for user to select filepath for password file

### On deck
- If password file is missing, provide user with error message.
- Import existing password file.
  - Check if file exists. If not, return error and tell user file does not exist.
- Create Error page with "/error" route.
  - If unhandled error occurs, redirect to error screen.
- Allow user to change filepath from unlock screen (in some kind of menu panel)

### To Do

# Future
- Handle filepaths (config and passwordfile) for non-Nix operating systems (Windows)
- Allow users to have multiple passwordfiles with different passwords that can be selected from the unlock screen
