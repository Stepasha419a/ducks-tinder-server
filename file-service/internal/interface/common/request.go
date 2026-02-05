package interface_common

type UploadFileDto struct {
	Data []byte `validate:"required"`
	Type string `validate:"required"`
}

type DeleteFileDto struct {
	Filename string `validate:"required"`
}
