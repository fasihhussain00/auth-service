DOCKER_REGISTRY = localhost:5000
IMAGE_TAG = latest
run: 
	npm start
dockerbuild: Dockerfile
	docker build -f Dockerfile -t $(DOCKER_REGISTRY)/auth-service/auth-service:$(IMAGE_TAG) .
dockerpush:
	docker push $(DOCKER_REGISTRY)/auth-service/auth-service:$(IMAGE_TAG)
docker: dockerbuild dockerpush
setup: package.json
	npm i
clean:
	rm -rf node_modules
migrate:
	npm run migrate
.PHONY: run clean setup dockerrun dockerpull dockerpush