FROM golang:1.21-alpine AS build

WORKDIR /usr/src/app

COPY go.mod go.sum ./

RUN go mod download

COPY . .

RUN go build -o app ./cmd

FROM alpine:3.22.1

WORKDIR /app

COPY --from=build /usr/src/app/app .
