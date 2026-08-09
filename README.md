# Image Converter

Repository: [github.com/nooblk-98/Image-Converter](https://github.com/nooblk-98/Image-Converter)

Convert PNG, JPG, WEBP, GIF and HEIC images online — fast, free, and 100% client-side.
Nothing is uploaded to a server: every conversion runs in the browser via Canvas
(and `heic2any` for HEIC/HEIF), so images never leave the user's machine.

## Features

- Convert between PNG, JPG/JPEG, WEBP, GIF and HEIC/HEIF
- Batch upload, convert, and download as a ZIP
- Adjustable quality for lossy output formats (WEBP, JPG)
- Fully client-side — no uploads, no accounts

## Tech stack

- [Next.js](https://nextjs.org) 16 (App Router) + React 19
- Tailwind CSS
- `heic2any` for HEIC/HEIF decoding, `jszip` for batch downloads

## Getting started

Install dependencies and run the dev server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app. Edit `app/page.js` or
`components/ImageConverter.js` — the page hot-reloads as you edit.

Other scripts:

```bash
npm run build   # production build
npm run start   # run the production build
npm run lint    # eslint
```

## Running with Docker

A multi-stage [Dockerfile](Dockerfile) builds a minimal production image using Next.js'
standalone output.

```bash
docker build -t image-converter .
docker run -p 3000:3000 image-converter
```

Prebuilt images are published to GHCR by [`.github/workflows/release.yml`](.github/workflows/release.yml):

```bash
docker run -p 3000:3000 ghcr.io/nooblk-98/image-converter:1.0.0
```

## Deploying to Kubernetes

A Helm chart is available at [charts/helm](charts/helm) — see its
[README](charts/helm/README.md) for configuration options.

```bash
helm install image-converter ./charts/helm
```

## Project structure

```
app/                  Next.js App Router pages (layout, home page, sitemap, robots)
components/           UI components (ImageConverter, UploadArea, Navbar, Footer)
lib/                  Conversion logic, file helpers, format metadata
charts/helm/          Helm chart for Kubernetes deployment
Dockerfile            Multi-stage production image
```
