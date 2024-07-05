package user_service

type (
	UserRegisteredDto struct {
		Id   string `json:"id"`
		Name string `json:"name"`
	}

	UserService interface {
		EmitUserRegistered(dto *UserRegisteredDto) error
	}
)
