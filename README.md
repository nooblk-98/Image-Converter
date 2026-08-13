# Image Converter

A fast, simple, and privacy-focused online image converter built with Next.js and JavaScript.

Convert images between popular formats directly in your browser — without uploading your images to a server for supported client-side conversions.

Supported conversions depend on the browser capabilities and the image-processing libraries used by the application.

## How It Works

The converter prioritizes client-side image processing.

Instead of uploading an image to a conversion server:

User selects image
       ↓
Browser reads image
       ↓
JavaScript processes image
       ↓
Canvas / image-processing library
       ↓
Converted image Blob
       ↓
User downloads converted image

This means supported conversions can be performed directly on the user's device.

## Support

If you find this project useful, consider giving the repository a star on GitHub.
