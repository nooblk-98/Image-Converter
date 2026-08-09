# image-converter

![Version: 0.1.1](https://img.shields.io/badge/Version-0.1.1-informational) ![AppVersion: 1.0.0](https://img.shields.io/badge/AppVersion-1.0.0-informational)

A Helm chart for deploying the [Image Converter](https://github.com/nooblk-98/Image-Converter) Next.js app to Kubernetes.

The container image is built and published to GHCR by [`.github/workflows/release.yml`](https://github.com/nooblk-98/Image-Converter/blob/main/.github/workflows/release.yml) as `ghcr.io/nooblk-98/image-converter`. By default this chart deploys tag `1.0.0`.

## Prerequisites

- Kubernetes 1.19+
- Helm 3.8+

## Installing the chart

```console
helm install image-converter ./charts/helm
```

The command deploys the app with default values. See [Configuration](#configuration) for
options you can override with `--set` or a values file.

## Uninstalling the chart

```console
helm uninstall image-converter
```

## Accessing the app

The Service is always `ClusterIP`, so it's only reachable from inside the cluster.
Port-forward to reach it locally:

```console
kubectl port-forward svc/image-converter 3000:80
```

Then open http://localhost:3000.

## Configuration

| Parameter             | Description                                                  | Default                             |
| ---------------------- | -------------------------------------------------------------| ------------------------------------ |
| `replicaCount`         | Number of pod replicas                                       | `1`                                   |
| `image.repository`     | Container image repository                                   | `ghcr.io/nooblk-98/image-converter`   |
| `image.pullPolicy`     | Image pull policy                                             | `IfNotPresent`                        |
| `image.tag`             | Image tag; defaults to the chart's `appVersion` when empty    | `""` (resolves to `1.0.0`)            |
| `imagePullSecrets`      | Secrets for pulling images from a private registry            | `[]`                                   |
| `nameOverride`          | Overrides the chart name used in generated resource names     | `""`                                   |
| `fullnameOverride`      | Overrides the full generated resource name                    | `""`                                   |
| `podAnnotations`        | Annotations added to the pod template                         | `{}`                                   |
| `podLabels`             | Labels added to the pod template                              | `{}`                                   |
| `podSecurityContext`    | Security context applied to the pod                           | `{}`                                   |
| `securityContext`       | Security context applied to the container                     | `{}`                                   |
| `service.port`          | Port the Service listens on                                   | `80`                                   |
| `service.targetPort`    | Port the container listens on (must match the app's `PORT`)   | `3000`                                 |
| `resources.limits.cpu`      | CPU limit                                                  | `200m`                                 |
| `resources.limits.memory`   | Memory limit                                               | `256Mi`                                |
| `resources.requests.cpu`    | CPU request                                                | `100m`                                 |
| `resources.requests.memory` | Memory request                                             | `128Mi`                                |
| `livenessProbe`         | Liveness probe definition                                     | `httpGet` on `/` via the `http` port  |
| `readinessProbe`        | Readiness probe definition                                    | `httpGet` on `/` via the `http` port  |
| `nodeSelector`          | Node selector for pod scheduling                               | `{}`                                   |
| `tolerations`           | Tolerations for pod scheduling                                 | `[]`                                   |
| `affinity`              | Affinity rules for pod scheduling                              | `{}`                                   |

The Service type is fixed to `ClusterIP` in the chart templates and is not configurable
via `values.yaml`.

Example overriding the image tag and resource limits:

```console
helm install image-converter ./charts/helm \
  --set image.tag=1.0.0 \
  --set resources.limits.cpu=500m \
  --set resources.limits.memory=512Mi
```
