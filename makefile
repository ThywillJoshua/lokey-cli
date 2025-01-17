build-ui:
	@echo "Building the UI application..."
	cd ui && ng build

run-ui:
	@echo "Running the UI application..."
	@go run main.go ui &
	@sleep 2 && cd ui && ng serve

build:
	@echo "Building the application..."
	cd ui && ng build
	go build main.go

run:
	@echo "Running the application..."
	cd ui && ng serve
	go run main.go ui

.PHONY: build-ui run-ui build run