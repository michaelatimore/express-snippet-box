# Snippet Box API



## Table of Contents
- [Project Overview](#project-overview)
- [Quick Start](#quick-start)
- [Project Construction](#project-construction)
  - [Server Configuration](#server-configuration)
- [Build the Project](#build-the-project)  
  - [Development with Auto-Reloading](#development-with-auto-reloading)
- [Project Structure](#project-structure)


## Project Overview

This project is a learning exercise aimed at developing a simple API using Node.js and Express.js, with TypeScript as the programming language. The API will provide basic endpoints for storing and retrieving messages with an expiration feature. The primary goal of this project is to gain hands-on experience in building APIs, understanding the Express framework, and leveraging Node.js as the underlying runtime environment.


## Quick Start
Follow these steps to get the project up and running on your local machine:

1. Ensure Node.js is installed
* Check your Node.js version:
```bash
node --version
```
If Node.js is not installed, download and install it from nodejs.org.

2. Clone the repository
* Using HTTPS:
``` bash
git clone https://github.com/michaelatimore/express-snippet-box.git
```

* Or using SSH:
``` bash
git clone git@github.com:michaelatimore/express-snippet-box.git
```

3 Navigate to the project directory
``` bash
cd express-snippet-box
```

4. Install dependencies
```bash
npm install
```

5. Build the project
bash
npm run build

6. Start the development server
``` bash
npm run dev
```
* The server should now be running at http://localhost:3000. You can access it through your web browser or use tools like Postman to interact with the API.


## Project Construction

This project was constructed by following these steps:

1. Create a new project directory and navigate to it:

```bash
mkdir express-snippet-box
cd express-snippet-box
```

2. Initialize a new node.js project:

```bash
npm init
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

* This will generate a `tsconfig.json` file in the project directory.
* The code that will be generated in the `tsconfig.json` file should be replaced with the following code:

``` json
{
  "compilerOptions": {
    "esModuleInterop": true,
    "skipLibCheck": true,
    "target": "es2022",
    "allowJs": true,
    "resolveJsonModule": true,
    "moduleDetection": "force",
    "isolatedModules": true,
    "verbatimModuleSyntax": true,
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "module": "NodeNext",
    "outDir": "dist",
    "sourceMap": true,
    "lib": ["es2022"]
  }
}
```


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

const PORT = process.env.PORT ?? 3000;

app.get("/", (req, res) => {
  res.json({ serverMessage: "Hello world!" });
});

app.listen(PORT, () => {
  if (process.env.NODE_ENV === "development") {
    console.log(`server running at http://localhost:${PORT}`);
  }
});
```
* server.ts serves as the main entry point for the application.

7. Update the `package.json` file to include build and start scripts:

```json   
  "scripts": {
    "build": "tsc",
    "dev": "nodemon"
  },
```
8. Install nodemon for development:

```bash
npm install -D nodemon
```
* Create a `nodemon.json` file in the project directory.
* Insert the following code into the `nodemon.json` file:

```json
{
  "watch": ["src"],
  "ext": ".ts,.js",
  "ignore": [],
  "exec": "tsc && set NODE_ENV=development&& node ./dist/server.js"
}
```


9. Create a .gitignore file

```bash
touch .gitignore
```

10. Add the following to the .gitignore file:
```bash
node_modules
dist
```

### Build the project:


```bash
npm run build
```

### Development with Auto-Reloading:

To start the project for development with auto-reloading, use the following command:

```bash
npm run dev
```

## Project Structure

* `src`: This directory contains the source code for the project.
* `src/server.ts`: This file contains the main application code.
* `dist`: This directory contains the compiled JavaScript code.
* `package.json`: This file contains metadata for the project, including dependencies and scripts.
* `tsconfig.json`: This file contains configuration options for the TypeScript compiler.
* `nodemon.json`: This file contains configuration options for nodemon.

