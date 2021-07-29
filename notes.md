# Doing
# On Deck
# To Do

- (Password Manager) Implement Password Manager page
- (Password Manager) Password entries should have optional fields: date created, expiration date.
- (Password Manager) Implement alerts when passwords reach expiration date.
- (Password Manager) Implement entry types : username, password, phone number, URL, email, etc.
- (Password Manager) Implement categories for organizing secrets.
- (Password Manager) Allow users to have multiple passwordfiles with different passwords that can be selected from the unlock screen.

- (Unlock) Implement Unlock page
	- Decrypt and load password file with password passed from frontend, return success/fail to user.
		- If password is correct, redirect to password manager page.
		- If password is wrong, display error to user.

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

- (OS Support) Handle filepaths (config and passwordfile) for non-Nix operating systems (Windows)

- (Test) Create more tests for securefile Read/Save functions. Test error is returned when expected.
