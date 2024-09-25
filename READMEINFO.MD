1. Create a new project directory and navigate to it:
mkdir express-snippet-box
cd express-snippet-box

2. Initialize a new Node.js project:
npm init -y

3. Install the necessary dependencies:
npm install express
npm install -D typescript @types/express @types/node

4.Initialize TypeScript configuration:
npx tsc --init

5.Create a `src` directory and an `server.ts` file inside it:
mkdir src
touch src/server.ts

6.Open `src/server.ts` and add the following code:
import express;

const app: Express = express();
const port = 3000;

app.get("/", (req, res) => {
    res.json({serverMessage:"Hello World!"});
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

7.Update the `package.json` file to include build and start scripts:
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "tsc -w & nodemon dist/index.js"
  }
}

8.Install nodemon for development:
npm install -D nodemon

9.Build and run the application:
npm run build
npm start

For development with auto-reloading:
npm run dev