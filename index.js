// ./index.js
const http = require('http')
const handles = require('./handles')

http
  .createServer(handles.serverHandle)
  .listen(8080, () => {
    console.log('Server running at http://localhost:8080/')
  })
