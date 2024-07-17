FROM golang:1.21-alpine

WORKDIR /usr/src/app

COPY file-service/go.mod file-service/go.sum ./

RUN go mod download

COPY file-service .

RUN go build -o app ./cmd

CMD ["./app"]
