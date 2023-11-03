const http = require("http");
const app = require("./app");
require("dotenv").config();

const PORT = process.env.PORT || 5001;

const server = http.createServer(app);
server.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
