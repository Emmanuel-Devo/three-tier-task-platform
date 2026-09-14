# Terraform Infrastructure as Code (IaC) - Three-Tier Task Platform

This directory contains the Terraform configuration to provision and manage the Kubernetes resources for the **Three-Tier Task Platform** on a local **Kind (Kubernetes in Docker)** cluster.

---

## Overview

### Why Terraform?
Terraform provides declarative Infrastructure as Code (IaC) for managing the lifecycle of cloud and Kubernetes resources:
- **Declarative State Management**: Terraform tracks real-world state and generates deterministic execution plans (`terraform plan`).
- **Drift Detection**: Any manual modification made directly via `kubectl` can be detected and reconciled back to the desired state.
- **Reproducibility**: The entire application stack (Namespace, PVCs, Deployments, and Services) can be stood up or torn down with a single command.
- **Consistency**: Eliminates human error compared to applying individual YAML manifests imperatively.

### Local Kind Kubernetes Deployment
Rather than managing remote cloud infrastructure (such as AWS EKS, GKE, or AKS) and incurring cloud costs, this configuration connects directly to your local **Kind** cluster using the official **HashiCorp Kubernetes Provider** (`hashicorp/kubernetes`).

---

## Managed Kubernetes Resources

Terraform provisions the following resources within the `task-platform` namespace:

| Tier | Component | Resource Type | Description |
|---|---|---|---|
| **Core** | `task-platform` | `kubernetes_namespace` | Isolated namespace for all application workloads |
| **Database** | `mongodb-pvc` | `kubernetes_persistent_volume_claim` | 1Gi `ReadWriteOnce` volume claim for database durability |
| **Database** | `mongodb` | `kubernetes_deployment` | MongoDB 8 single-replica deployment with `/data/db` volume mount |
| **Database** | `mongodb` | `kubernetes_service` | Internal `ClusterIP` on port `27017` |
| **Backend** | `backend` | `kubernetes_deployment` | Node.js Express API with HTTP `/health` probes and resource limits |
| **Backend** | `backend` | `kubernetes_service` | Internal `ClusterIP` on port `8080` |
| **Frontend** | `frontend` | `kubernetes_deployment` | React + Vite (Nginx) with TCP socket probes and resource limits |
| **Frontend** | `frontend` | `kubernetes_service` | Internal `ClusterIP` on port `80` |

---

## Prerequisites & Required Tools

Before running Terraform, ensure the following tools are installed and accessible in your environment:
- [Terraform](https://developer.hashicorp.com/terraform/downloads) (>= 1.3.0)
- [Docker Desktop](https://www.docker.com/) / Docker Engine
- [Kind](https://kind.sigs.k8s.io/) (Kubernetes in Docker)
- [kubectl](https://kubernetes.io/docs/tasks/tools/)
- An active Kind cluster with context configured (e.g. `kind-task-platform`)

Verify connection to your Kind cluster:
```bash
kubectl cluster-info --context kind-task-platform
```

---

## Usage Workflow

All commands should be executed from within the `terraform/` directory:

```bash
cd three-tier-task-platform/terraform
```

### 1. Initialize Terraform
Initializes the working directory and downloads the required `hashicorp/kubernetes` provider plugin:
```bash
terraform init
```

### 2. Format and Validate
Format code files according to standard HCL style conventions:
```bash
terraform fmt
```

Validate configuration syntax and provider schema:
```bash
terraform validate
```

### 3. Preview Changes (Plan)
Generate an execution plan to preview what Terraform will create without altering the cluster:
```bash
terraform plan
```

To provide custom variable values (e.g. a different namespace or context):
```bash
terraform plan -var="namespace=task-platform" -var="kubeconfig_context=kind-task-platform"
```

### 4. Apply Infrastructure
Provision all Kubernetes resources in the Kind cluster:
```bash
terraform apply
```
*(Review the plan and type `yes` to confirm.)*

Or apply non-interactively in automated pipelines:
```bash
terraform apply -auto-approve
```

### 5. Verify Deployed Resources
Check that all pods and services are running in the target namespace:
```bash
kubectl get all,pvc -n task-platform
```

### 6. Destroy Infrastructure
To completely tear down all Terraform-managed resources (Deployments, Services, PVCs, and Namespace):
```bash
terraform destroy
```
*(Review the destruction plan and type `yes` to confirm.)*
