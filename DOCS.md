# Snippet Box API

## Table of Contents

- [Project Overview](#project-overview)
- [Requirements](#requirements)
- [Quick Start](#quick-start)
- [Project Construction](#project-construction)
  - [Server Configuration](#server-configuration)
- [Running the Project](#running-the-project)
  - [Build the Project](#build-the-project)
  - [Development with Auto-Reloading](#development-with-auto-reloading)
- [Project Structure](#project-structure)
- [Dependencies](#dependencies)

## Project Overview

This project is a learning exercise aimed at developing a simple API using Node.js and Express.js, with TypeScript as the programming language. The API will provide basic endpoints for storing and retrieving messages with an expiration feature. The primary goal of this project is to gain hands-on experience in building APIs, understanding the Express framework, and leveraging Node.js as the underlying runtime environment.
Under the guidance of a mentor, this project serves as a practical introduction to:

1. Setting up an Express.js application with TypeScript
2. Implementing RESTful API endpoints
3. Handling data storage and retrieval
4. Managing message expiration logic
5. Understanding the relationship between Node.js and Express
6. Best practices in API development
   Through this guided learning process, the project will evolve to demonstrate fundamental concepts in backend development, API design, and the use of TypeScript in a Node.js environment.

## Requirements

1. nodejs - https://nodejs.org/en/download/package-manager
2. PostgreSQL - https://www.postgresql.org/download
3. Docker - https://docs.docker.com/get-docker

## Quick Start

Follow these steps to get the project up and running on your local machine:

1. Ensure Node.js is installed

- Check your Node.js version:

```bash
node --version
```

If Node.js is not installed, download and install it from nodejs.org.

2. Clone the repository

- Using HTTPS:

```bash
git clone https://github.com/michaelatimore/express-snippet-box.git
```

- Or using SSH:

```bash
git clone git@github.com:michaelatimore/express-snippet-box.git
```

3 Navigate to the project directory

```bash
cd express-snippet-box
```

4. Install dependencies

```bash
npm install
```

- This will install all necessary dependencies, including Express.
  Build the project
  bash
  npm run build

5. Start the development server

```bash
npm run dev
```

- The server should now be running at http://localhost:3000. You can access it through your web browser or use tools like Postman to interact with the API.

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

This will start the interactive questionnaire. You'll be prompted to answer several questions about your project:

`package name`: (default is your directory name)

`version`: (default is 1.0.0)

`description`: A brief description of your project

`entry point`: (default is index.js)

`test command`

`git repository`: URL of your git repo (if applicable)

`keywords`: Keywords related to your project

`author`: Your name

`license`: (default is ISC)

For each question, you can either:

- Enter your desired value
- Press Enter to accept the default value (shown in parentheses)
- Press Enter with no input to leave the field blank

After answering all questions, npm will show you the resulting package.json contents and ask if it's okay. Type 'yes' and press Enter to confirm.

- The `package.json` file that is generated will be populated based on the answers provided.
- Scripts and dependencies relevant to your project will be added automatically.

3. Install the necessary dependencies:

```bash
npm install express
npm install -D typescript @types/express @types/node
```

- `npm install express`: Installs the Express.js framework as a dependency.
- `npm install -D typescript @types/express @types/node`: Installs TypeScript and type definitions for Express and Node.js as development dependencies.

4. Initialize TypeScript configuration:

```bash
npx tsc --init
```

- This will generate a `tsconfig.json` file in the project directory.
- The code that will be generated in the `tsconfig.json` file should be replaced with the following code:

```json
{
  "compilerOptions": {
    /* Base Options: */
    "esModuleInterop": true,
    "skipLibCheck": true,
    "target": "es2022",
    "allowJs": true,
    "resolveJsonModule": true,
    "moduleDetection": "force",
    "isolatedModules": true,
    "verbatimModuleSyntax": true,
    /* Strictness */
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    /* For transpiling with TypeScript: */
    "module": "NodeNext",
    "outDir": "dist",
    "sourceMap": true,
    /* For code not running in the DOM: */
    "lib": ["es2022"]
  }
}
```

- The comments should be removed. There are there for informational purposes only. A more detailed explanation for each option can be found at https://www.totaltypescript.com/tsconfig-cheat-sheet

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

- server.ts serves as the main entry point for the application.

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

- Create a `nodemon.json` file in the project directory.
- Insert the following code into the `nodemon.json` file:

```json
{
  "watch": ["src"],
  "ext": ".ts,.js",
  "ignore": [],
  "exec": "tsc && set NODE_ENV=development&& node ./dist/server.js"
}
```

This code will do the following:

- `watch: ["src"]`: This tells the script to monitor the "src" directory for any changes. When files in this directory are modified, the script will trigger a recompilation.
- `ext: ".ts,.js`: This specifies which file extensions the script should watch for changes. In this case, it's watching both TypeScript (.ts) and JavaScript (.js) files.
- `"ignore": []`: This array can be used to specify files or directories that should be ignored by the watch process. It's currently empty, meaning no files are being ignored.
- `"exec": "tsc && set NODE_ENV=development&& node ./dist/server.js"`: This is the command that gets executed when changes are detected. It does the following:
- `tsc`: Compiles the TypeScript files using the TypeScript compiler.
- `set NODE_ENV=development`: Sets the NODE_ENV environment variable to "development".
- `node ./dist/server.js`: Runs the compiled JavaScript file located in the "dist" directory.

9. Create a .gitignore file

```bash
touch .gitignore
```

10. Add the following to the .gitignore file:

```bash
node_modules
dist
```

## Running the Project

To run the project, follow these steps:

### Build the project:

```bash
npm run build
```

When npm run build is run for the first time, the following steps occur:

- The TypeScript compiler (tsc) is executed to compile the TypeScript files in the src directory.
- The TypeScript compiler reads the tsconfig.json file to determine the compilation options and settings.
- The dist directory is generated when the TypeScript compiler (tsc) is executed as part of the build script.
- The TypeScript compiler generates JavaScript files in the dist directory based on the TypeScript source files in the src directory. The generated JavaScript files are the compiled version of the TypeScript code.
- The .tsbuildinfo file is generated by the TypeScript compiler. This file contains information about the TypeScript build process, including the cache of the compiled JavaScript files, the TypeScript configuration, and the dependencies between TypeScript files.
- The server.js file is generated in the dist directory. This file is the compiled JavaScript code that will be executed when the server starts.
- A server.js.map file is created in the dist directory. This file contains the source map for the server.js file.
- The package.json file is updated with the build timestamp and other relevant information.
- The node_modules directory is populated with the installed dependencies specified in the package.json file.
  If there are any errors or warnings during the build process, they are displayed in the console output.

### Development with Auto-Reloading:

To start the project for development with auto-reloading, use the following command:

```bash
npm run dev
```

This will start the server and watch for changes in the `src` directory. When changes are detected, the server will automatically restart.

## Project Structure

- `src`: This directory contains the source code for the project.
- `src/server.ts`: This file contains the main application code.
- `dist`: This directory contains the compiled JavaScript code.
- `package.json`: This file contains metadata for the project, including dependencies and scripts.
- `tsconfig.json`: This file contains configuration options for the TypeScript compiler.

In this project, server.js is automatically generated from server.ts.
The server.ts file is written in TypeScript, and it is compiled to JavaScript and saved as server.js. The compilation is done using the TypeScript compiler (tsc) when the project is built.

The build script in the package.json file specifies that the TypeScript compiler should be run before the project is started. This is done using the command tsc && set NODE_ENV=development&& node ./dist/server.js.

The server.js file is then executed using the node command, which starts the server and listens on port 3000.

## Dependencies

- `express`: A popular Node.js web framework.
- `typescript`: A superset of JavaScript that adds optional static typing and other features.
- `@types/express`: Type definitions for Express.js.
- `@types/node`: Type definitions for Node.js.
- `nodemon`: A tool for automatically restarting the server when changes are detected.

Week 1: 1st task was to create the user and snippet table in an initialize.sql file.
Week 2: Install node postgres: npm install pg
Explain the syntax and purpose of this code block:
import pg from "pg";
const { Pool } = pg;
export const pool = new Pool({
connectionString: "postgresql://postgres:password@localhost:5432/postgres",
});
Explanation:

postgresql://: This prefix identifies the protocol.
user: The username for the database.
password: (Optional) Password for the user.
host: The address of the PostgreSQL server (e.g., localhost or an IP address).
port: (Optional) The port where PostgreSQL is listening. Default is 5432.
dbname: The name of the database you want to connect to.
Parameters: Additional connection options can be passed as URL parameters.

.env file:
DSN=postgres://postgres:password@localhost:5432/postgres\


created the routes for the snippets:
destructured parameter to get the element
validate all incoming data to the server
error checks

In your project, the **connection string** and the **`.env` file** play a crucial role in managing the database connection and environment-specific configurations. Let's break down how these files interact and work within your Express API.

### 1. **The `.env` File and Environment Variables**
The `.env` file is used to store sensitive and environment-specific information, such as database credentials, API keys, and configuration settings. This allows you to keep these details separate from your source code, which enhances security and flexibility.

For example, your `.env` file might contain:
```
DSN=postgres://user:password@localhost:5432/mydatabase
PORT=4000
NODE_ENV=development
```

In this case:
- **`DSN`** holds the **connection string** for connecting to your Postgres database.
- **`PORT`** specifies the port on which your Express server will run.
- **`NODE_ENV`** determines the environment (e.g., `development`, `production`) in which the application is running.

### 2. **Loading the `.env` File with `dotenv`**
You are using the `dotenv` package to load the contents of the `.env` file into your application.

```typescript
import "dotenv/config";
```

This line in both `server.ts` and `db.ts` ensures that the environment variables from the `.env` file are loaded into `process.env` before any other part of the application runs. Once loaded, these variables are accessible globally throughout your Node.js app.

### 3. **The `connectionString` in the Project**
The connection string for your PostgreSQL database is stored in the `.env` file under the `DSN` key.

In your `db.ts` file, you reference this connection string like so:

```typescript
import { connectionString } from "../constants.js";
```

In `constants.js`, the connection string is initialized:
```typescript
export const connectionString = process.env.DSN;
```

This code retrieves the `DSN` environment variable from `process.env`. If the `.env` file contains:
```
DSN=postgres://user:password@localhost:5432/mydatabase
```
then `connectionString` will contain the value:
```
postgres://user:password@localhost:5432/mydatabase
```

This value is passed into the `pg.Pool` constructor in `db.ts`:
```typescript
const { Pool } = pg;
export const pool = new Pool({
  connectionString,
});
```

Here’s what happens:
- The **`Pool`** object from the `pg` (node-postgres) library creates a pool of client connections to the Postgres database using the connection string.
- The connection string provides all the necessary information for the database connection (username, password, host, port, and database name).
- The `pool.connect()` method attempts to connect to the database. If it fails, it throws an error and logs the failure in the console.

### 4. **Connecting the App to the Database**
Your application is set up to connect to the database as soon as the server starts. The connection string, stored in the `.env` file and loaded via `dotenv`, provides the necessary credentials and configuration for this connection.

### 5. **How It All Works Together**
1. **`.env` File**: Contains the connection string (`DSN`) and other configuration settings (like `PORT`).
2. **`dotenv`**: Loads the `.env` file and makes the variables available in `process.env`.
3. **Database Connection**:
   - The connection string from `process.env.DSN` is passed to the `pg.Pool` constructor.
   - This string is used to establish a pool of client connections to your Postgres database.
4. **Express App**:
   - The app uses environment variables (like `PORT` and `NODE_ENV`) to set up the server.
   - The server starts on the port specified in the `.env` file (or defaults to `3000`).
   - Routes (e.g., `/users`, `/snippets`) are set up and the server listens for incoming HTTP requests.

### 6. **`nodemon.json` and Development Mode**
The `nodemon.json` file you provided contains the following:

```json
{
  "watch": ["src"],
  "ext": ".ts,.js",
  "ignore": [],
  "exec": "tsc && set NODE_ENV=development&& node ./dist/server.js"
}
```

- **Nodemon** is a tool that helps automatically restart your Node.js application when files are changed.
- The `nodemon.json` configuration tells Nodemon to watch the `src` directory and restart the server if any `.ts` or `.js` files change.
- The command `"set NODE_ENV=development&& node ./dist/server.js"` sets the `NODE_ENV` to `development` and runs the compiled TypeScript code from the `dist` folder.

By setting the `NODE_ENV` to `development`, the following behavior happens:
- When the app starts, if `NODE_ENV` is set to `development`, the server will log this message:
  ```typescript
  console.log(`server running at http://localhost:${PORT}`);
  ```

### Summary:
- **`.env` file**: Stores environment-specific configurations like the Postgres connection string (`DSN`).
- **`dotenv`**: Loads the `.env` file and makes its contents available via `process.env`.
- **`connectionString`**: A constant that retrieves the `DSN` environment variable and is used to configure the database connection in the `pg.Pool` object.
- **Express app**: Uses the loaded environment variables to configure the server's port and environment and establishes a database connection using the provided connection string.

This design allows the application to be easily adapted to different environments (development, testing, production) by changing the values in the `.env` file without modifying the actual code.

add the docker-compose.yaml file:


name: express-snippetbox

services:
  db:
    image: postgres
    restart: always
    shm_size: 128mb
    environment:
      POSTGRES_PASSWORD: password
    ports:
      - 5432:5432

  adminer:
    image: adminer
    restart: always
    ports:
      - 8080:8080

      The `docker-compose.yaml` file you provided is designed to set up and run your PostgreSQL database server and an Adminer database management tool in Docker containers. Let's break down what each part of the file does in the context of your project.

### Overview of Docker Compose:
- **Docker Compose** allows you to define and manage multiple Docker containers as services in a single configuration file (`docker-compose.yaml`).
- In your case, you are defining two services: one for the PostgreSQL database and one for Adminer, a lightweight database management tool.

### Explanation of the `docker-compose.yaml` file:

```yaml
name: express-snippetbox

services:
  db:
    image: postgres
    restart: always
    shm_size: 128mb
    environment:
      POSTGRES_PASSWORD: password
    ports:
      - 5432:5432

  adminer:
    image: adminer
    restart: always
    ports:
      - 8080:8080
```

#### 1. **Service: `db` (PostgreSQL Database)**

```yaml
db:
  image: postgres
  restart: always
  shm_size: 128mb
  environment:
    POSTGRES_PASSWORD: password
  ports:
    - 5432:5432
```

- **`image: postgres`**: This specifies that the service will use the official PostgreSQL Docker image. This image contains everything needed to run a PostgreSQL server.
- **`restart: always`**: This ensures that the PostgreSQL container will always restart if it crashes or if Docker is restarted. It's a way to maintain availability.
- **`shm_size: 128mb`**: This sets the size of the shared memory (`shm`) that PostgreSQL can use. It is useful for performance reasons, as PostgreSQL can require more shared memory for certain operations (especially with large databases).
- **`environment:`**: 
  - **`POSTGRES_PASSWORD: password`**: This sets an environment variable for the Postgres container, specifying the password for the default PostgreSQL `postgres` user. In this case, the password is set to `"password"`.
  - Note that this is a simplified configuration; for production, you would likely want to store passwords more securely (e.g., using Docker secrets or environment variables).
- **`ports:`**: 
  - **`5432:5432`**: This maps port `5432` on your local machine to port `5432` in the container. Port `5432` is the default port that PostgreSQL listens on, so this allows you to access the PostgreSQL database running in the container from your host machine (e.g., your Express app or database management tools like Adminer).

#### 2. **Service: `adminer` (Adminer Database Management Tool)**

```yaml
adminer:
  image: adminer
  restart: always
  ports:
    - 8080:8080
```

- **`image: adminer`**: This specifies that the service will use the official Adminer Docker image. Adminer is a lightweight, web-based database management tool, similar to phpMyAdmin, but for multiple types of databases (including PostgreSQL).
- **`restart: always`**: Similar to the `db` service, this ensures that the Adminer container will restart if it crashes.
- **`ports:`**: 
  - **`8080:8080`**: This maps port `8080` on your local machine to port `8080` in the container. This allows you to access the Adminer interface from your web browser at `http://localhost:8080`.

### What Happens When You Run This File?

1. **PostgreSQL Container (`db`)**:
   - A Docker container is created and started for PostgreSQL using the `postgres` image.
   - The container will expose port `5432`, allowing your Express app (running on your local machine or another container) to connect to the PostgreSQL database using the connection string like `postgres://user:password@localhost:5432/dbname`.
   - The environment variable `POSTGRES_PASSWORD` will set the password for the default `postgres` user, so the database can be accessed using this password.
   - PostgreSQL will store its data in a Docker volume (which isn’t shown explicitly here but happens by default unless overridden), ensuring that data persists even if the container is stopped or removed.

2. **Adminer Container (`adminer`)**:
   - Another Docker container is started using the `adminer` image.
   - The Adminer service allows you to manage your PostgreSQL database via a web interface.
   - You can visit `http://localhost:8080` in your browser to access the Adminer interface. From there, you can log in using the credentials for your PostgreSQL database (e.g., `postgres` as the user and `password` as the password).

3. **Interaction with Your Express App**:
   - Your Express app, which connects to the PostgreSQL database using a connection string stored in the `.env` file (`DSN`), will use the connection details to talk to the PostgreSQL server running inside the Docker container.
   - If your `.env` file contains something like:
     ```env
     DSN=postgres://postgres:password@localhost:5432/yourdbname
     ```
     this would allow your Express app to connect to the PostgreSQL server running in the `db` container.

### Benefits of Using Docker Compose:
- **Simplified Setup**: With Docker Compose, you don’t need to manually install PostgreSQL and Adminer on your local machine. Everything runs in isolated containers, which keeps your environment clean.
- **Portability**: You can easily share this `docker-compose.yaml` file with other developers or use it in different environments. Anyone with Docker and Docker Compose installed can spin up the same setup by running a single command.
- **Isolation**: Your PostgreSQL database runs in a Docker container, meaning it doesn’t interfere with other services or installations on your local machine.
- **Database Management with Adminer**: Adminer provides an easy-to-use web interface for managing your PostgreSQL database, running alongside your app and database.

### Running Docker Compose:
To start both services (PostgreSQL and Adminer), you would typically run the following command from the directory containing the `docker-compose.yaml` file:

```bash
docker-compose up
```

This will:
- Download the necessary Docker images (`postgres` and `adminer`) if they’re not already on your machine.
- Create and start the containers for both services.
- Once the containers are running, you can:
  - Access your PostgreSQL database through your app (on `localhost:5432`).
  - Manage your PostgreSQL database through Adminer by navigating to `http://localhost:8080`.

To stop and remove the containers, you can run:
```bash
docker-compose down
```

This will stop and clean up the containers, but any data stored in volumes (such as the database data) will persist unless you explicitly remove the volumes.

psql -h localhost -p 5432 -U postgres -d snippet_app

