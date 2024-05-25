package handler

type UploadFileEvent struct {
	Data string `json:"data"`
	Type string `json:"type"`
}

type DeleteFileEvent struct {
	Filename string `json:"filename"`
}
