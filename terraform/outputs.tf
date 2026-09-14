output "namespace" {
  description = "The Kubernetes namespace created for the application"
  value       = kubernetes_namespace.task_platform.metadata[0].name
}

output "mongodb_service_name" {
  description = "The name of the MongoDB ClusterIP service"
  value       = kubernetes_service.mongodb.metadata[0].name
}

output "mongodb_pvc_name" {
  description = "The name of the MongoDB PersistentVolumeClaim"
  value       = kubernetes_persistent_volume_claim.mongodb_pvc.metadata[0].name
}

output "backend_service_name" {
  description = "The name of the Backend API ClusterIP service"
  value       = kubernetes_service.backend.metadata[0].name
}

output "frontend_service_name" {
  description = "The name of the Frontend UI ClusterIP service"
  value       = kubernetes_service.frontend.metadata[0].name
}
