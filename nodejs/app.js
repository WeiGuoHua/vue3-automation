const querystring = require('querystring');

const handleBlogRouter = require('./src/router/blog');
const handleUserRouter = require('./src/router/user');

// 处理 post data
const getPostData = (req) => {
  const promise = new Promise((resolve, reject) => {
    if (req.method !== 'POST') {
      resolve({});
      return;
    }
    if (req.headers['content-type'] !== 'application/json') {
      resolve({});
      return;
    }
    let postData = '';
    req.on('data', (chunk) => {
      postData += chunk.toString();
    });
    req.on('end', () => {
      if (!postData) {
        resovle({});
        return;
      }
      resolve(JSON.parse(postData));
    });
  });
  return promise;
};

const serverHandle = (req, res) => {
  // 设置返回文件格式 JSON
  res.setHeader('Content-type', 'application/json');

  const url = req.url;

  // 获取path
  req.path = url.split('?')[0];

  // 解析 query
  req.query = querystring.parse(url.split('?')[1]);

  getPostData(req).then((postData) => {
    req.body = postData;

    // 处理 blog 路由
    // const blogData = handleBlogRouter(req, res);
    // if (blogData) {
    //   res.end(JSON.stringify(blogData));
    //   return;
    // }
    const blogResult = handleBlogRouter(req, res);
    if (blogResult) {
      blogResult.then((blogData) => {
        res.end(JSON.stringify(blogData));
      });
      return;
    }

    // 处理 user 路由
    const userData = handleUserRouter(req, res);
    if (userData) {
      res.end(JSON.stringify(userData));
      return;
    }

    // 未命中路由, 返回404
    res.writeHead(404, {
      'content-type': 'text/plain',
    });
    res.write('404 Not Found\n');
    res.end();
  });
};

module.exports = serverHandle;
