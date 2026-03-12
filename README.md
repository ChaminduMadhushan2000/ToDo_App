# CI/CD Pipeline Demo with AWS & Docker

A modern web application deployed automatically using a continuous integration and delivery pipeline.

## 🏗️ Architecture

- **Frontend:** React + Vite + TypeScript
- **Containerization:** Docker
- **CI/CD:** GitHub Actions
- **Cloud:** AWS ECR & AWS App Runner

## 🔄 How it Works

1.  Code is pushed to the `main` branch.
2.  **GitHub Actions** authenticates with AWS using OIDC/Secrets.
3.  A **Docker image** is built and tagged with the commit SHA.
4.  The image is pushed to **Amazon ECR**.
5.  **AWS App Runner** automatically pulls the new image and updates the production service.

## 💻 Local Setup

1. Clone the repo
2. `npm install`
3. `npm run dev`
