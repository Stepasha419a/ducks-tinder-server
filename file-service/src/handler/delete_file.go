package handler

import (
	"errors"
	util "go-file-server/src/util"
	"net/http"
	"os"
	"path"

	"github.com/gorilla/mux"
)

func HandleDeleteFile(w http.ResponseWriter, r *http.Request) {
	fileName := mux.Vars(r)["fileName"]

	if _, err := os.Stat(path.Join("static", fileName)); errors.Is(err, os.ErrNotExist) {
		util.JSONError(w, http.StatusText(http.StatusNotFound), http.StatusNotFound)
		return
	}

	e := os.Remove(path.Join("static", fileName))
	if e != nil {
		panic(e)
	}

	util.JSONResponse(w, map[string]interface{}{"fileName": fileName}, http.StatusOK)
}
