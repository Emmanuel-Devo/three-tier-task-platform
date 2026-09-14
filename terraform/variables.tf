variable "kubeconfig_path" {
  description = "Path to the local kubeconfig file"
  type        = string
  default     = "~/.kube/config"
}

variable "kubeconfig_context" {
  description = "Kubernetes context to connect to local Kind cluster"
  type        = string
  default     = "kind-task-platform"
}

variable "namespace" {
  description = "Kubernetes namespace for the Three-Tier Task Platform"
  type        = string
  default     = "task-platform"
}

variable "backend_image" {
  description = "Docker image for the backend API"
  type        = string
  default     = "three-tier-task-platform-backend:latest"
}

variable "frontend_image" {
  description = "Docker image for the frontend UI"
  type        = string
  default     = "three-tier-task-platform-frontend:latest"
}

variable "mongodb_image" {
  description = "Docker image for the MongoDB database"
  type        = string
  default     = "mongo:8"
}

variable "mongo_uri" {
  description = "MongoDB connection string for the backend API"
  type        = string
  default     = "mongodb://mongodb:27017/task_platform"
}

variable "mongodb_storage_size" {
  description = "Storage request for MongoDB PersistentVolumeClaim"
  type        = string
  default     = "1Gi"
}
