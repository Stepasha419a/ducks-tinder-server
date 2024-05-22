package util

import (
	"encoding/json"
	"net/http"
)

func JSONResponse(w http.ResponseWriter, response map[string]interface{}, statusCode int) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.Header().Set("X-Content-Type-Options", "nosniff")

	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(response)
}
