package user_service

type (
	UserRegisteredDto struct {
		Id   string
		Name string
	}

	UserService interface {
		EmitUserRegistered(dto *UserRegisteredDto) error
	}
)
