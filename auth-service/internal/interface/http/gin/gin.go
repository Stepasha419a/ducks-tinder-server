package gin_impl

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type GinImpl struct {
	Engine *gin.Engine
	server *http.Server
	name   string
	port   int
}
