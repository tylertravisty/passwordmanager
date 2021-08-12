# Doing

# On Deck
- (Password Manager) Add buttons to copy entry values to clipboard.
	- navigator.clipboard.writeText
- (Password Manager) Implement Password Manager page
	- Change "Add Entry" page to just adding new editable item in list within secret edit stage.
		- "Add Entry" button should request "type" first from pre-set list.
		- If "type" is "password", then add a "Random" button next to item to generate random password.
	- Do "Add Secret" and "Add Entry" need to be in Edit stage?
		- Autosave on create
		- User can delete if mistake
		- Only need edit for things that can't be reversed, like deleting.
	- Develop UI components
		- categories(is this needed?)

# To Do

- (CSS) Standardize all "Cancel", "Save", and "Back" button stylings into single CSS file.

- (Password Manager) Create predefined list of entry types, all user to change while editing.
- (Password Manager) Refactor code to remove unnecessary classes and convert to functional components instead.
- (Password Manager) Password entries should have optional fields: date created, expiration date.
- (Password Manager) Implement alerts when passwords reach expiration date.
- (Password Manager) Implement entry types : username, password, phone number, URL, email, etc.
- (Password Manager) Implement categories for organizing secrets.
- (Password Manager) Allow users to have multiple passwordfiles with different passwords that can be selected from the unlock screen.
- (Password Manager) Implement automatic lock out after some defined time of inactivity.
	- Add setting for user to change/remove timer for each password file.

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

- (SecureFile) Add function to securefile package to *test* password without returning contents.
	- Write tests to test this function.
