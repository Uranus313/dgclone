FROM golang:alpine AS builder
RUN apk add --no-cache git
WORKDIR /go/src/app
COPY . .
RUN go get -d -v ./...
RUN go build -o /go/bin/app -v ./main.go

# final stage
FROM alpine:latest
RUN apk --no-cache add ca-certificates
WORKDIR /app
COPY --from=builder /go/bin/app /app/app
COPY .env .env  
ENTRYPOINT ["/app/app"]
LABEL Name=products Version=0.0.1
EXPOSE 8080


# Stage 1: Build the Go binary
# FROM golang:alpine AS builder

# # Set the Current Working Directory inside the container
# WORKDIR /app

# # Copy go.mod and go.sum files first to leverage caching
# COPY go.mod go.sum ./

# # Download all dependencies. Dependencies will be cached if the go.mod and go.sum files are not changed
# RUN go mod download

# # Copy the source code into the container
# COPY . .

# # Build the Go app
# RUN go build -o app .

# # Stage 2: Create a minimal image
# FROM alpine:latest

# # Set the Current Working Directory inside the container
# WORKDIR /root/

# # Copy the Pre-built binary file from the previous stage
# COPY --from=builder /app/app .

# # Command to run the executable
# CMD ["./app"]
