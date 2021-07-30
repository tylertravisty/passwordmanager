package securefile

const (
	ErrInvalidPassword pkgError = "Password is invalid"
)

type pkgError string

func (e pkgError) Error() string {
	return string(e)
}
