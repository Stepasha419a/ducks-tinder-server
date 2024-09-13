package response_service

var (
	InternalServerErrorResponse = map[string]string{"status": "500", "message": "Internal server error"}
	BadRequest                  = map[string]string{"status": "400", "message": "BadRequest"}
	UnauthorizedResponse        = map[string]string{"status": "401", "message": "Unauthorized"}
	NotFound                    = map[string]string{"status": "404", "message": "Not found"}
)
