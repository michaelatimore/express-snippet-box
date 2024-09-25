# Snippet Box API
====================

## Project Overview

This project is a simple API built using Node.js and Express.js. It provides a basic endpoint for storing and retrieving messages with an expiration.

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

4. Initialize TypeScript configuration:

```bash
npx tsc --init
```
This will generate a `tsconfig.json` file in the project directory.
This code should be replaced with the package at the following link: https://www.totaltypescript.com/tsconfig-cheat-sheet

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

1. Build the project:

```bash
npm run build
```

2. Start the project:

```bash
npm start
```

For development with auto-reloading, use the following command:

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
