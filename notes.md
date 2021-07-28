# Doing
# On Deck
# To Do

- (Password File) Password file layout
	- Store 
		- Category
			- Secret
				- Entry
	- Settings
- (Password File) Entry will have the following fields: name, value, type, date created, expiration date, etc.
	- Example: [{name: "URL", value: "local.host", type: "URL"}, {name: "Password", value: "supersecretpassword", type: "password"}, {name: "Username", value: "user@local.host", type: "username"}]
- (Password File) Entry types include: username, password, phone number, URL, etc.
- (Password File) Layout example
	- Twitter (Secret)
		- username (Entry)
		{"name": "username", "value": "myusername", "type": "text"}
		- password (Entry)
		{"name": "password", "value": "mysupersecretpassword", "type": "text"}
- (Password File) Create data structure for holding records.
	- Each entry has a name, value, type, date created, expiration date.
		- Example: [{name: "URL", value: "local.host", type: "text"}, {name: "Password", value: "supersecretpassword", type: "password"}, {name: "Username", value: "user@local.host", type: "text"}]
- (Password File) Add creation dates to each password to track how long a password has been used for (see below for alerting when password is too old).
- (Passowrd File) Save settings within password file. Make password file self-contained. Can be transferred to any system.
	- Include setting for when user should be alerted when password(s) expire.

- (Unlock) Implement Unlock page
	- Unlock password file with password passed from frontend, return success/fail to user.
		- If password is correct, redirect to password manager page.
		- If password is wrong, display error to user.
	- decrypt the password file
	- redirect user to password manager screen
- (Unlock) Return password success/fail to user

- (New Password File) Check if password is complex (can be done in frontend).
	- red/yellow/green meter that indicates complexity of password
	- too simple/good/great
	- Add conditional to only show password complexity on first password input.
	- only show password complexity once user starts typing (think about this behavior)
- (New Password File) Handle any errors caused from permission issues at the time the file is being written to.
- (New Password File) If user hits "Cancel" button on save file screen, it does not redirect to Unlock - need to handle this case.

- (On Start) If password file stored in config is missing, provide user with error message.
	- User either needs to import existing password file or create new password file.

- (Main Menu) Import existing password file.
	- Check if file exists. If not, return error and tell user file does not exist.

- (Error) Create Error page with "/error" route.
	- If unhandled error occurs, redirect to error screen.
	- Is this even needed? All errors may be handled by their respective views.
- (Error) Log internal errors to log file.

- (Feature) Allow users to have multiple passwordfiles with different passwords that can be selected from the unlock screen.
- (Feature) Handle filepaths (config and passwordfile) for non-Nix operating systems (Windows)
- (Feature) Add profiles/directories/categories that can be used to organize secrets.

- (Test) Create more tests for securefile Read/Save functions. Test error is returned when expected.
