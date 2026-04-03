#!/usr/bin/env node

const path = require("path");
const { spawn } = require("child_process");
const fs = require("fs");

// Change to server directory
const serverDir = path.join(__dirname, "..", "server");
process.chdir(serverDir);

console.log("📁 Working directory:", process.cwd());
console.log(
  "📦 package.json exists:",
  fs.existsSync(path.join(process.cwd(), "package.json")),
);

// Import and start the server
require("./src/index.js");
