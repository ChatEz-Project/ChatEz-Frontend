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
#### Start in DEV mode:
- ```bash
      cd chatez; npm run start:dev
  ```
 - will use backend on localhost
 
#### Start in PROD mode:
- ```bash
      cd chatez; npm run start:prod
  ```
- will use backend on CloudRun


After deployment, access the application via the provided URL.

## Features

* **Real-Time Chat**: Peer-to-peer messaging with status indicators.
* **Media Sharing**: Send images, files, and more.
* **Multi-Language Support**: Built-in translation for messages.
* **Accessibility**: Text-to-speech and AI-generated summaries for easy conversation overview.
* **Env Based Config**: Will override .env file with env.prod or env.dev based on start mode.

[![Watch the Demo](https://raw.githubusercontent.com/X2Abdul/ChatEz-Frontend/main/Demo_Thumbnail.png)](https://raw.githubusercontent.com/X2Abdul/ChatEz-Frontend/main/ChatEz_Demo.mov)

