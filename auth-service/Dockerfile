FROM golang:1.21-alpine AS build

WORKDIR /usr/src/app

COPY go.mod go.sum ./

RUN go mod download

COPY . .

RUN go build -o app ./cmd/main
RUN go build -o migration ./cmd/migration

FROM alpine:3.22.1

# TODO: check is ca-certificates package needed for https requests (out-coming https requests from service)
RUN apk add --no-cache ca-certificates curl

WORKDIR /app

COPY --from=build /usr/src/app/app .
COPY --from=build /usr/src/app/migration .
