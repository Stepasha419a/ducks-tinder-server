FROM golang:1.21-alpine AS build

WORKDIR /usr/src/app

COPY go.mod go.sum ./

RUN go mod download

COPY . .

RUN go build -o app ./cmd/main

FROM alpine:latest

WORKDIR /usr/src/app

COPY --from=build /usr/src/app .

CMD ["./app"]