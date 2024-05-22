package util

import (
	"encoding/json"
	"net/http"
)

func JSONError(w http.ResponseWriter, errorMessage string, statusCode int) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.Header().Set("X-Content-Type-Options", "nosniff")

	jsonErr := map[string]interface{}{"message": errorMessage, "statusCode": statusCode}

	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(jsonErr)
}
