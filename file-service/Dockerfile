FROM golang:1.25.3-alpine AS build

RUN apk add --no-cache \
    build-base \
    vips-dev

WORKDIR /usr/src/app

COPY go.mod go.sum ./

RUN go mod download

COPY . .

RUN go build -o app ./cmd

FROM alpine:3.22.1

RUN apk add --no-cache curl

WORKDIR /app

COPY --from=build /usr/src/app/app .

CMD ["/app/app"]
