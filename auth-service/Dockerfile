FROM golang:1.21-alpine

WORKDIR /usr/src/app

COPY go.mod go.sum ./

RUN go mod download

COPY . .

RUN go build -o app ./cmd/main

CMD ["./app"]
