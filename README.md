# Auth-Service

## **App**

---

### Dependecies:

1. `node`

## **Deployment**

---

### Docker Image Build

- `docker build -f Dockerfile -t localhost:5000/auth-service:latest .` For building app image
- `docker tag localhost:5000/auth-service:latest {remote_domain}/{project_name}/{repo_name}/{image_name}:{image_tag}` tag images and add real values in placeholders e.g. {image_tag} could be "latest".

### Helm Deployment

- Make sure you have kubernetes installed in your system.
- Navigate to project root directory.
- `helm upgrade -i auth_service .\helm` to install auth_service helm release.
- `C:\Windows\System32\drivers\etc\hosts` open hosts file as an administrator.
- `127.0.0.1 auth.shaed.ai` add this binding in `hosts` file.
- auth_service should be up on `http://auth.shaed.ai`.

### GCloud Docker Authorization

- Download gcloud and install it in your system, and add path to environment. source: `https://dl.google.com/dl/cloudsdk/channels/rapid/GoogleCloudSDKInstaller.exe`
- `gcloud init` login with your organization account.
- `gcloud auth configure-docker us-east1-docker.pkg.dev` add artifact registry hosts to configurations.
- `gcloud auth print-access-token | docker login -u oauth2accesstoken --password-stdin https://us-east1-docker.pkg.dev` login docker with access token.
- `$ACCESS_TOKEN=$(gcloud auth print-access-token)` store access token to ACCESS_TOKEN variable
- `kubectl create secret docker-registry us-east1-k8-secret --docker-server=us-east1-docker.pkg.dev --docker-username=oauth2accesstoken --docker-password="$ACCESS_TOKEN"` login kubernetes with access token

### Push Images

- `docker push localhost:5000/auth-service`

### Pull Images

- `docker pull localhost:5000/auth-service`

### Migrations

---

`npm run migration:generate --name=new-migration-nsme-small-description` generate new migration
`npm run migration:run` run all unapplied migrations

### How to use (For Dev)

---

- `npm i` to install all packages.
- create `.env` file at the root project directory.
- `npm run migration:run` ton apply all migration to db.
- `npm run dev` to run dev server.
- `npm run build` to generate a build using `.env` file.
- `npm start` to run app after build.
