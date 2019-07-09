function boot(FOO, BAR) {
  var ul = document.getElementById('envwars');
  var li1 = document.createElement('li');
  var li2 = document.createElement('li');
  li1.appendChild(document.createTextNode('FOO:' + FOO));
  li2.appendChild(document.createTextNode('BAR:' + BAR));
  ul.appendChild(li1);
  ul.appendChild(li2);
}

function init(FOO, BAR) {
  window.onload = boot(FOO, BAR);
}

function envwars() {
  var values = {};

  values['FOO'] = process.env.FOO;
  values['BAR'] = process.env.BAR;

  return values;
}

function route_scriptjs(req, res, template_scriptjs) {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
  res.end(template_scriptjs);
  return res;
}

function route_home(req, res, template_home) {
  var body;
  var html_envwars = [];
  var js_envwars = [];

  html_envwars.push('<ul>')
  for (const [key, value] of Object.entries(envwars())) {
    html_envwars.push('<li><b>' + key + ':</b> ' + value + '</li>');
    js_envwars.push('var ' + key + ' = "' + value + '";')
  }
  html_envwars.push('</ul>')

  body = template_home;
  body = body.replace('// envwars', js_envwars.join("\n"))
  body = body.replace('<!-- envwars -->', html_envwars.join("\n"))

  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.end(body);
  return res;
}

if (typeof process === 'object') {
  const fs = require('fs');
  const http = require('http');
  const url = require('url');

  const hostname = '127.0.0.1';
  const port = 3000;

  const template_home = fs.readFileSync('index.html').toString();
  const template_scriptjs = fs.readFileSync('script.js').toString();

  const server = http.createServer((req, res) => {
    var pathname = url.parse(req.url, true).pathname;
    switch (true) {
      case pathname == '/':
        route_home(req, res, template_home);
        break;

      case pathname == '/script.js':
        route_scriptjs(req, res, template_scriptjs);
        break;
    }
  });

  server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
  });
} else {
  // do nothing for now?
}
