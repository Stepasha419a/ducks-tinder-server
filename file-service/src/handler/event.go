package handler

type UploadFile struct {
	Data string `json:"data"`
	Type string `json:"type"`
}

type DeleteFile struct {
	Name string `json:"name"`
}
