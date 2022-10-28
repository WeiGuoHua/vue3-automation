const http = require('http');
const port = 9527;

const serverHandle = require('../index');

const server = http.createServer(serverHandle);
server.listen(port, () => {
  console.log(`server is running on ${port}`);
});
