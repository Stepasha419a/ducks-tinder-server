package login_service

type (
	LoginService interface {
		CheckLogin(login string) (bool, error)
	}
)
