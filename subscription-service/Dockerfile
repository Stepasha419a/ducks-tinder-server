FROM golang:1.25.3-alpine AS build

WORKDIR /usr/src/app

COPY go.mod go.sum ./

RUN go mod download

COPY . .

RUN go build -o app ./cmd/main/main.go ./cmd/main/wire_gen.go
RUN go build -o migration ./cmd/migration

FROM alpine:3.22.1

RUN apk add --no-cache ca-certificates curl

WORKDIR /app

COPY --from=build /usr/src/app/app .
COPY --from=build /usr/src/app/migration .
