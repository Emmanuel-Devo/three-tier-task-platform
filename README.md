# Three-Tier Task Platform

A containerized task management application built with **React, Node.js/Express, MongoDB, Docker, Kubernetes, Terraform, and GitHub Actions**.

The project demonstrates how a three-tier application can be developed locally, containerized, deployed to Kubernetes, exposed through an NGINX Ingress, monitored with Kubernetes Metrics Server, and managed with Infrastructure as Code.

## Architecture

```text
                    ┌─────────────────────┐
                    │       Browser       │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   NGINX Ingress     │
                    │      / and /api     │
                    └───────┬───────┬─────┘
                            │       │
                    /       │       │ /api
                            ▼       ▼
                 ┌────────────┐  ┌────────────┐
                 │  Frontend  │  │   Backend  │
                 │ React/Vite │  │ Node/Express│
                 └────────────┘  └──────┬─────┘
                                        │
                                        ▼
                                 ┌─────────────┐
                                 │   MongoDB   │
                                 │ Persistent  │
                                 │   Storage   │
                                 └─────────────┘
```

## Technology Stack

### Application

* React
* Vite
* Axios
* Node.js
* Express.js
* Mongoose
* MongoDB

### DevOps / Infrastructure

* Docker
* Docker Compose
* Kubernetes
* Kind
* NGINX Ingress Controller
* Terraform
* Kubernetes Metrics Server
* Git
* GitHub Actions

## Project Structure

three-tier-task-platform/
│
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── controllers/
│   │   │   └── taskController.js
│   │   ├── middleware/
│   │   │   └── errorHandler.js
│   │   ├── models/
│   │   │   └── Task.js
│   │   ├── routes/
│   │   │   └── taskRoutes.js
│   │   └── server.js
│   ├── Dockerfile
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── TaskForm.jsx
│   │   │   ├── TaskItem.jsx
│   │   │   └── TaskList.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── Dockerfile
│   ├── package.json
│   └── package-lock.json
│
├── k8s/
│   ├── namespace.yaml
│   ├── backend/
│   │   └── backend.yaml
│   ├── frontend/
│   │   └── frontend.yaml
│   ├── database/
│   │   └── mongodb.yaml
│   └── ingress/
│       └── ingress.yaml
│
├── terraform/
│   └── Kubernetes infrastructure configuration
│
├── docker-compose.yml
├── .gitignore
└── README.md


## Application Features

The task platform supports:

* Create tasks
* View tasks
* Update task completion status
* Delete tasks
* Backend health checks
* Client-side validation
* Loading and error states
* MongoDB data persistence
* Responsive frontend interface

### Backend API

| Method | Endpoint         | Purpose              |
| ------ | ---------------- | -------------------- |
| GET    | /health        | Backend health check |
| GET    | /api/tasks     | Get all tasks        |
| POST   | /api/tasks     | Create a task        |
| PUT    | /api/tasks/:id | Update a task        |
| DELETE | /api/tasks/:id | Delete a task        |

## Docker

Both the frontend and backend have their own Dockerfiles.

The frontend uses a multi-stage build:

1. Node.js builds the React application.
2. NGINX serves the production build.

The backend uses a Node.js Alpine image and runs the Express API.

MongoDB runs using the official MongoDB container image.

## Docker Compose

Before Kubernetes deployment, the complete application was tested using Docker Compose.

The Compose stack contains:

* MongoDB
* Node.js backend
* React frontend
* Custom Docker network
* Persistent MongoDB volume
* Health checks
* Container restart policies

Start the complete stack with:

bash
docker compose up -d --build


Check the services:

bash
docker compose ps


Stop the stack:

bash
docker compose down


## Kubernetes Deployment

The application was deployed locally to a dedicated Kubernetes cluster created with Kind.

Create the cluster:

bash
kind create cluster --name task-platform


Create the application namespace:
bash
kubectl apply -f k8s/namespace.yaml


Deploy MongoDB:

bash
kubectl apply -f k8s/database/mongodb.yaml


Deploy the backend:

bash
kubectl apply -f k8s/backend/backend.yaml


Deploy the frontend:

bash
kubectl apply -f k8s/frontend/frontend.yaml


Install the NGINX Ingress Controller for Kind:

bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/kind/deploy.yaml


Apply the application Ingress:

bash
kubectl apply -f k8s/ingress/ingress.yaml


Check the application:

bash
kubectl get all -n task-platform


## Kubernetes Services

The application uses separate Kubernetes Services for each tier:

* frontend — ClusterIP service
* backend — ClusterIP service
* mongodb — ClusterIP service

The frontend and backend are kept internal to the cluster and are accessed through the NGINX Ingress.

## NGINX Ingress

NGINX Ingress provides a single entry point for the application.

Routing:

text
/       → frontend service
/api    → backend service


The Ingress configuration is stored in:

text
k8s/ingress/ingress.yaml


For the local Kind environment, the Ingress controller is accessed through port forwarding:

bash
kubectl port-forward service/ingress-nginx-controller 8080:80 -n ingress-nginx


The application can then be accessed at:


http://localhost:8080


## MongoDB Persistence

MongoDB uses a Kubernetes PersistentVolumeClaim.

The database storage is defined in:

k8s/database/mongodb.yaml


Persistence was tested by:

1. Creating a task.
2. Deleting the MongoDB pod.
3. Allowing Kubernetes to recreate the pod.
4. Refreshing the application.
5. Confirming that the task was still present.

This verified that application data survives MongoDB pod recreation.

## Health Checks

The backend exposes:

GET /health


Kubernetes uses this endpoint for:

* Liveness probes
* Readiness probes

The frontend also has Kubernetes liveness and readiness checks.

This allows Kubernetes to determine whether the application containers are healthy and ready to receive traffic.

## Resource Management

The frontend and backend deployments include CPU and memory requests and limits.

Example:

yaml
resources:
  requests:
    cpu: "100m"
    memory: "128Mi"
  limits:
    cpu: "500m"
    memory: "256Mi"


This helps Kubernetes manage workload resources within the local cluster.

## Monitoring

Kubernetes Metrics Server was installed to provide basic resource monitoring.

Check node resource usage:

bash
kubectl top nodes


Check pod resource usage:

bash
kubectl top pods -n task-platform


Example cluster monitoring result:


CPU:    244m
Memory: 1686Mi


The project uses Metrics Server instead of a full Prometheus/Grafana stack to keep the local development environment lightweight.

## Terraform

Terraform is used to manage the Kubernetes infrastructure as Code.

The Terraform configuration manages resources including:

* Kubernetes namespace
* MongoDB PersistentVolumeClaim
* MongoDB Deployment
* MongoDB Service
* Backend Deployment
* Backend Service
* Frontend Deployment
* Frontend Service

Initialize Terraform:

bash
cd terraform
terraform init


Format the configuration:

bash
terraform fmt


Validate the configuration:

bash
terraform validate


Preview infrastructure changes:

bash
terraform plan


The final Terraform plan was verified with:

No changes. Your infrastructure matches the configuration.

## CI with GitHub Actions

GitHub Actions automatically checks the project when changes are pushed to the `master` branch or when a pull request is opened.

The workflow performs:

### Backend

* Installs dependencies using `npm ci`
* Checks Node.js syntax
* Verifies important backend files

### Frontend

* Installs dependencies
* Builds the React application

### Docker

* Builds the backend Docker image
* Builds the frontend Docker image

Workflow file:

.github/workflows/ci.yml


The GitHub Actions workflow has been successfully tested and completed with passing jobs.

## Local Development

### Backend

bash
cd backend
npm ci
npm start


### Frontend

bash
cd frontend
npm ci
npm run dev


### Docker Compose

bash
docker compose up -d --build

### Kubernetes

bash
kubectl get all -n task-platform

## Project Verification

The final Kubernetes environment was verified with:

bash
kubectl get all -n task-platform


Current application components:

Backend     → Running
Frontend    → Running
MongoDB     → Running
Services    → Running
Ingress     → Running

The NGINX Ingress Controller was also verified:

bash
kubectl get pods -n ingress-nginx

Metrics Server was verified with:

bash
kubectl get pods -n kube-system | grep metrics-server
kubectl top nodes

## Current Deployment Status

This project is currently configured and tested as a **local Kubernetes deployment using Kind**.

AWS EKS is not required for the current implementation.

The Terraform configuration currently manages the local Kubernetes environment rather than provisioning AWS infrastructure.

A future version can be extended to deploy the same application to AWS EKS when cloud resources are available.

## What This Project Demonstrates

This project demonstrates practical experience with:

* Building a three-tier web application
* Containerizing applications with Docker
* Managing multi-container applications with Docker Compose
* Deploying applications to Kubernetes
* Creating Kubernetes Deployments and Services
* Configuring health checks
* Managing persistent storage
* Configuring NGINX Ingress routing
* Monitoring Kubernetes resource usage
* Managing Kubernetes infrastructure with Terraform
* Implementing CI with GitHub Actions
* Using Git and GitHub for version control
* Testing application availability and data persistence

## Future Improvements

Possible future improvements include:

* Deploying to AWS EKS
* Adding HTTPS/TLS
* Adding Kubernetes Secrets
* Adding Horizontal Pod Autoscaling
* Adding centralized logging
* Adding Prometheus and Grafana when additional resources are available
* Adding automated Kubernetes deployment through CI/CD

## Project Status

**Completed and tested locally.**

The application has been successfully:

* Containerized
* Tested with Docker Compose
* Deployed to Kubernetes
* Exposed through NGINX Ingress
* Tested for MongoDB persistence
* Validated with Terraform
* Checked through GitHub Actions
* Monitored with Kubernetes Metrics Server

## Author

**Emmanuel Bullion**

Cloud Engineering / DevOps

GitHub: Emmanuel-Devo
