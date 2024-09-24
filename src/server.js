"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Import the express module from the node_modules directory.
 * The express module is used to create web applications.
 * The express function is a top-level function exported by the module.
 * The express function returns an instance of the express class.
 * The express class is used to create web applications.
 * The express class has methods and properties that can be used to create web applications.
 */
const express_1 = __importDefault(require("express"));
/**
 * Create an instance of the express class.
 * The express instance is used to create web applications.
 * The express instance has methods and properties that can be used to create web applications.
 */
const app = (0, express_1.default)();
/**
 * Define a route for the root URL ('/').
 * The route will respond with a JSON object.
 * The JSON object will contain a property called 'serverMessage' with the value 'Hello World!'.
 */
app.get("/", (req, res) => {
    res.json({ serverMessage: "Hello World!" });
});

/**
 * Start the server.
 * The server will listen on port 3000.
 * When the server is started, a message will be logged to the console.
 * The message will indicate that the server has started and is listening on port 3000.
 */
app.listen(3000, () => {
    console.log("Server started on http://localhost:3000");
});
