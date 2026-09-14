# Three-Tier Task Platform

A containerized three-tier task management application built with **React, Node.js/Express, MongoDB, Docker, Kubernetes, and Terraform**.

The project demonstrates how a full-stack application can be developed locally, containerized with Docker, deployed to Kubernetes, and managed declaratively with Terraform.

> **Note:** This project is currently deployed and tested locally using Docker Desktop and a Kind Kubernetes cluster. AWS/EKS deployment is not included in the current version.

---

## Architecture

```text
                    ┌─────────────────────┐
                    │       Browser       │
                    │   React Frontend    │
                    └──────────┬──────────┘
                               │
                               │ HTTP
                               ▼
                    ┌─────────────────────┐
                    │    Frontend Tier    │
                    │ React + Vite + Nginx│
                    │   Kubernetes Pod    │
                    └──────────┬──────────┘
                               │
                               │ API Requests
                               ▼
                    ┌─────────────────────┐
                    │     Backend Tier    │
                    │ Node.js + Express   │
                    │   Kubernetes Pod    │
                    └──────────┬──────────┘
                               │
                               │ MongoDB Protocol
                               ▼
                    ┌─────────────────────┐
                    │    Database Tier    │
                    │      MongoDB 8      │
                    │ Persistent Storage   │
                    └─────────────────────┘
```

### Infrastructure flow

```text
Application Code
      │
      ▼
Docker Images
      │
      ▼
Kubernetes / Kind
      │
      ├── Frontend Deployment
      ├── Backend Deployment
      ├── MongoDB Deployment
      ├── Kubernetes Services
      └── PersistentVolumeClaim
      │
      ▼
Terraform
```

---

## Project Overview

The application is a simple task management platform where users can:

* Create tasks
* View tasks
* Mark tasks as completed
* Update tasks
* Delete tasks

The application is separated into three main tiers:

### 1. Presentation Tier

Built with:

* React
* Vite
* Axios
* Nginx

The frontend provides the user interface and communicates with the backend through REST API requests.

### 2. Application Tier

Built with:

* Node.js
* Express.js
* Mongoose
* CORS

The backend provides the REST API and handles task operations and communication with MongoDB.

### 3. Database Tier

Built with:

* MongoDB 8

MongoDB stores task data using a Kubernetes PersistentVolumeClaim so that data remains available when the MongoDB pod is recreated.

---

## Technologies Used

| Category                | Technology                      |
| ----------------------- | ------------------------------- |
| Frontend                | React                           |
| Build Tool              | Vite                            |
| Backend                 | Node.js / Express               |
| Database                | MongoDB                         |
| API Client              | Axios                           |
| Containerization        | Docker                          |
| Container Orchestration | Kubernetes                      |
| Local Kubernetes        | Kind                            |
| Infrastructure as Code  | Terraform                       |
| Kubernetes Provider     | Terraform Kubernetes Provider   |
| Web Server              | Nginx                           |
| Version Control         | Git / GitHub                    |
| Operating Environment   | Docker Desktop / Windows + WSL2 |

---

## Project Structure

```text
three-tier-task-platform/
│
├── .github/
│   └── workflows/
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
│   ├── .dockerignore
│   ├── .env.example
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
│   ├── .dockerignore
│   ├── .env.example
│   ├── Dockerfile
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── k8s/
│   ├── namespace.yaml
│   ├── backend/
│   │   └── backend.yaml
│   ├── database/
│   │   └── mongodb.yaml
│   └── frontend/
│       └── frontend.yaml
│
├── terraform/
│   ├── main.tf
│   ├── outputs.tf
│   ├── variables.tf
│   ├── versions.tf
│   ├── README.md
│   └── .terraform.lock.hcl
│
├── docker-compose.yml
├── .gitignore
└── README.md
```

---

## Application Features

### Task Management

The backend exposes the following REST API endpoints:

| Method | Endpoint         | Description        |
| ------ | ---------------- | ------------------ |
| GET    | `/health`        | API health check   |
| GET    | `/api/tasks`     | Retrieve all tasks |
| POST   | `/api/tasks`     | Create a task      |
| PUT    | `/api/tasks/:id` | Update a task      |
| DELETE | `/api/tasks/:id` | Delete a task      |

Example task:

```json
{
  "title": "Learn Kubernetes",
  "completed": false
}
```

---

## Docker

Each application component is containerized separately.

### Backend

The backend uses a Node.js Alpine image and exposes port `8080`.

### Frontend

The frontend uses a multi-stage Docker build:

```text
Node.js
   │
   ├── Install dependencies
   ├── Build React application
   │
   ▼
Nginx
   │
   └── Serve production frontend
```

### MongoDB

MongoDB runs as its own container and uses a named Docker volume for local persistence.

---

## Running with Docker Compose

From the project root:

```bash
docker compose up -d --build
```

Check the containers:

```bash
docker compose ps
```

The application can then be accessed at:

```text
Frontend:
http://localhost:3000

Backend:
http://localhost:8080

Health check:
http://localhost:8080/health
```

To stop the application:

```bash
docker compose down
```

The MongoDB named volume is preserved unless it is explicitly removed.

---

## Kubernetes Deployment

The application was also deployed to a local Kubernetes cluster using **Kind**.

Create the cluster:

```bash
kind create cluster --name task-platform
```

Verify the cluster:

```bash
kubectl get nodes
```

Expected result:

```text
task-platform-control-plane   Ready   control-plane
```

---

## Deploying the Application to Kubernetes

Create the namespace:

```bash
kubectl apply -f k8s/namespace.yaml
```

Deploy MongoDB:

```bash
kubectl apply -f k8s/database/mongodb.yaml
```

Deploy the backend:

```bash
kubectl apply -f k8s/backend/backend.yaml
```

Deploy the frontend:

```bash
kubectl apply -f k8s/frontend/frontend.yaml
```

Check the resources:

```bash
kubectl get all -n task-platform
```

Check persistent storage:

```bash
kubectl get pvc -n task-platform
```

---

## Kubernetes Services

The application uses internal Kubernetes Services for communication between components.

### MongoDB

```text
mongodb:27017
```

### Backend

```text
backend:8080
```

### Frontend

```text
frontend:80
```

The backend connects to MongoDB using the Kubernetes service name:

```text
mongodb://mongodb:27017/task_platform
```

This allows Kubernetes DNS to resolve the MongoDB service internally.

---

## Health Checks

The backend deployment includes Kubernetes:

* Liveness probe
* Readiness probe

The probes use:

```text
GET /health
```

The frontend uses a TCP readiness and liveness check on port `80`.

This helps Kubernetes determine whether containers are ready to receive traffic and whether they need to be restarted.

---

## Resource Management

Kubernetes resource requests and limits were configured for the application containers.

Example:

```yaml
resources:
  requests:
    cpu: "100m"
    memory: "128Mi"
  limits:
    cpu: "500m"
    memory: "256Mi"
```

This prevents the workloads from consuming unlimited resources on the local Kubernetes cluster.

---

## Persistent Storage Test

MongoDB was configured with a Kubernetes PersistentVolumeClaim:

```text
mongodb-pvc
```

The persistence was tested by:

1. Creating a task through the application.
2. Deleting the MongoDB pod.
3. Allowing Kubernetes to recreate the MongoDB pod.
4. Checking the application again.
5. Confirming that the task was still available.

This demonstrated that the MongoDB data was stored on persistent storage rather than only inside the container filesystem.

---

## Terraform

Terraform is used to manage the Kubernetes infrastructure declaratively.

The Terraform configuration manages:

* Kubernetes namespace
* MongoDB PersistentVolumeClaim
* MongoDB Deployment
* MongoDB Service
* Backend Deployment
* Backend Service
* Frontend Deployment
* Frontend Service

Initialize Terraform:

```bash
cd terraform
terraform init
```

Format the configuration:

```bash
terraform fmt
```

Validate the configuration:

```bash
terraform validate
```

Review the infrastructure:

```bash
terraform plan
```

The final Terraform plan was verified with:

```text
No changes. Your infrastructure matches the configuration.
```

This confirms that the Terraform configuration matches the existing Kubernetes resources.

---

## Local Access

Because the Kubernetes Services are internal `ClusterIP` services, port forwarding is used for local browser access.

### Backend

```bash
kubectl port-forward service/backend 8080:8080 -n task-platform
```

### Frontend

```bash
kubectl port-forward service/frontend 3000:80 -n task-platform
```

Then open:

```text
http://localhost:3000
```

The frontend communicates with the backend through:

```text
http://localhost:8080
```

---

## What I Practiced

This project was used to practice several Cloud and DevOps concepts:

* Building a full-stack application
* REST API development
* Docker image creation
* Docker Compose
* Container networking
* Kubernetes Deployments
* Kubernetes Services
* Kubernetes Namespaces
* Kubernetes health probes
* Kubernetes resource requests and limits
* PersistentVolumeClaims
* Kubernetes pod recovery
* Kubernetes service discovery
* Kind local Kubernetes clusters
* Terraform
* Infrastructure as Code
* Git and GitHub
* Environment variables
* Multi-stage Docker builds
* Nginx
* Application troubleshooting

---

## DevOps Workflow

```text
Develop
   │
   ▼
Test Application
   │
   ▼
Build Docker Images
   │
   ▼
Run with Docker Compose
   │
   ▼
Deploy to Kubernetes
   │
   ▼
Test Kubernetes Workloads
   │
   ▼
Manage Infrastructure with Terraform
   │
   ▼
Push Changes to GitHub
```

---

## Current Environment

This project was developed and tested locally using:

* Windows
* WSL2
* Docker Desktop
* Git Bash
* Kind
* kubectl
* Terraform

The project is designed so that the infrastructure can later be adapted for a cloud Kubernetes environment such as Amazon EKS.

---

## Future Improvements

Planned improvements include:

* GitHub Actions CI/CD
* Automated Docker image builds
* Container image registry
* Kubernetes Ingress
* HTTPS/TLS
* Application monitoring
* Prometheus and Grafana
* Horizontal Pod Autoscaling
* Cloud deployment
* Automated Terraform workflows

---

## Project Status

**Status: Completed local implementation**

The three-tier application has been:

* Containerized with Docker
* Tested with Docker Compose
* Deployed to Kubernetes
* Tested with Kubernetes health checks
* Configured with persistent MongoDB storage
* Tested for pod recovery and data persistence
* Managed with Terraform
* Pushed to GitHub

---

## Author

**Emmanuel Chukwuere**

Cloud Engineering | DevOps | Linux | Docker | Kubernetes | Terraform

GitHub: [Emmanuel-Devo](https://github.com/Emmanuel-Devo)
