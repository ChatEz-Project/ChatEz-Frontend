# ChatEz

ChatEz is a scalable, real-time web chat application with enhanced features, including media sharing, AI-generated message summaries, translation, and text-to-speech. Users enjoy a smooth chat experience similar to popular messaging platforms, with secure, cloud-stored conversations accessible across devices.

## Technologies Used

### Front-End
* Framework: React (TypeScript)
* UI Libraries: Material UI, Bootstrap
* Routing: React Router
* API Communication: Axios
* Authentication & Storage: Firebase Auth, Firebase Storage

### Cloud
* Platform: Google Cloud Run for scalable, stateless deployment
* Additional Services:
  * Google Cloud Translation API
  * Google Cloud Text-to-Speech
  * OpenAI API

## Setup

### Install Dependencies:
```bash
cd chatez
npm install
```

### Run the App:
```bash
cd chatez
NODE_ENV=development npm start
  - will use localhost backend
NODE_ENV=production npm start
  - will use cloud run deployed backend
```

After deployment, access the application via the provided URL.

## Features

* **Real-Time Chat**: Peer-to-peer messaging with status indicators.
* **Media Sharing**: Send images, files, and more.
* **Multi-Language Support**: Built-in translation for messages.
* **Accessibility**: Text-to-speech and AI-generated summaries for easy conversation overview.
