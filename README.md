# Snippet Box API
====================

This project is a learning exercise aimed at developing a simple API using Node.js and Express.js, with TypeScript as the programming language. The API will provide basic endpoints for storing and retrieving messages with an expiration feature. The primary goal of this project is to gain hands-on experience in building APIs, understanding the Express framework, and leveraging Node.js as the underlying runtime environment.
Under the guidance of a mentor, this project serves as a practical introduction to:
1. Setting up an Express.js application with TypeScript
2. Implementing RESTful API endpoints
3. Handling data storage and retrieval
4. Managing message expiration logic
5. Understanding the relationship between Node.js and Express
6. Best practices in API development
Through this guided learning process, the project will evolve to demonstrate fundamental concepts in backend development, API design, and the use of TypeScript in a Node.js environment.

## Table of Contents

- [Project Overview](#project-overview)
- [Project Construction](#project-construction)
  - [Server Configuration](#server-configuration)
- [Running the Project](#running-the-project)
  - [Build the Project](#build-the-project)  
  - [Server Execution](#server-execution)
  - [Development with Auto-Reloading](#development-with-auto-reloading)
- [Project Structure](#project-structure)
- [Dependencies](#dependencies)



## Project Construction

This project was constructed by following these steps:

1. Create a new project directory and navigate to it:

```bash
mkdir express-snippet-box
cd express-snippet-box
```
2. Initialize a new Node.js project:

```bash
npm init -y
```

3. Install the necessary dependencies:

```bash
npm install express
npm install -D typescript @types/express @types/node
```
* `npm install express`: Installs the Express.js framework as a dependency.
* `npm install -D typescript @types/express @types/node`: Installs TypeScript and type definitions for Express and Node.js as development dependencies.

4. Initialize TypeScript configuration:

```bash
npx tsc --init
```
* This will generate a `tsconfig.json` file in the project directory.
* This code should be replaced with the package at the following link: https://www.totaltypescript.com/tsconfig-cheat-sheet

### Server Configuration

5. Create a `src` directory and an `server.ts` file inside it:

```bash
mkdir src
touch src/server.ts
```

6. Open `src/server.ts` and add the following code:

```typescript
import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.json({ serverMessage: "Hello World!" });
});

app.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});
```
* server.ts serves as the main entry point for the application.

7. Update the `package.json` file to include build and start scripts:

```json   
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "tsc -w & nodemon dist/index.js"
  }
```

8. Install nodemon for development:

```bash
npm install -D nodemon
```

## Running the Project

To run the project, follow these steps:

### Build the project:

```bash
npm run build
```

### Development with Auto-Reloading:

To start the project for development with auto-reloading, use the following command:

```bash
npm run dev
```

This will start the server and watch for changes in the `src` directory. When changes are detected, the server will automatically restart.

## Project Structure

* `src`: This directory contains the source code for the project.
* `src/server.ts`: This file contains the main application code.
* `dist`: This directory contains the compiled JavaScript code.
* `package.json`: This file contains metadata for the project, including dependencies and scripts.
* `tsconfig.json`: This file contains configuration options for the TypeScript compiler.

In this project, server.js is automatically generated from server.ts.
The server.ts file is written in TypeScript, and it is compiled to JavaScript and saved as server.js. The compilation is done using the TypeScript compiler (tsc) when the project is built.

The build script in the package.json file specifies that the TypeScript compiler should be run before the project is started. This is done using the command tsc && set NODE_ENV=development&& node ./dist/server.js.

The server.js file is then executed using the node command, which starts the server and listens on port 3000.

## Dependencies

* `express`: A popular Node.js web framework.
* `typescript`: A superset of JavaScript that adds optional static typing and other features.
* `@types/express`: Type definitions for Express.js.
* `@types/node`: Type definitions for Node.js.
* `nodemon`: A tool for automatically restarting the server when changes are detected.