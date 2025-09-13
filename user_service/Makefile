GREEN  := $(shell tput -Txterm setaf 2)
YELLOW := $(shell tput -Txterm setaf 3)
WHITE  := $(shell tput -Txterm setaf 7)
CYAN   := $(shell tput -Txterm setaf 6)
RESET  := $(shell tput -Txterm sgr0)

## Live reload:
watch-prepare: ## Install the tools required for the watch command
	curl -sSfL https://raw.githubusercontent.com/cosmtrek/air/master/install.sh | sh

watch: ## Run the service with hot reload
	bin/air

## Build:
build: ## Build the service
	go build -o user-service

## Docker:
docker-compose: ## Start the service in docker
	docker-compose up -d --build --force-recreate

docker-build: ## Build the Docker image with a specified tag
	docker build --platform linux/amd64 -t arthurhozanna/user-service:$(tag) .

docker-push: ## Build the Docker image with a specified tag
	docker push arthurhozanna/user-service:$(tag)
