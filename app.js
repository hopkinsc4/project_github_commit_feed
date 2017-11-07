var http = require('http');
var fs = require('fs');
var url = require('url');
var gitHubApi = require('github');
var gitwrap = require('./gitwrap');

var port = 4000;
var host = 'localhost';
var token = 'a5b2fad6758ffd94fe061fc92f5fb754023f204d';

var server = http.createServer(function(req, res) {
    //get path
    //var path = url.parse(req.url).pathname;
    //console.log(path);

    //get url search params
    var path = url.parse(req.url, true);
    var username = path.query['user'];
    var repo = path.query['repo'];
    
    //get repo commits with gitwrap
    var commitsArr = [];
    var getCommits = gitwrap.getRepoCommits(username, token, repo, (repoCommits) => {
        var commits = JSON.stringify(repoCommits);

        var path = './data/commits.json';
        var writeData = commits;

        fs.writeFile(path, commits, 'utf8', (err) => {
            if(err) {
                throw err;
            }
        });

    });



    //stringify data/commits.json to use for replacement later
    //var commitsStr = JSON.stringify(commitsJSON, null, 2);
    fs.readFile('./public/index.html', 'utf8', function(err, data) {
        if (err) {
            res.writeHead(404);
            res.end('404 Not Found');
        } else {
            res.writeHead(200, {
                "Content-Type": "text/html"
            });
            var commitsJSON = require('./data/commits.json');
            res.write(data.replace('{{ commitFeed }}',JSON.stringify(commitsJSON, null, 2)));
            res.end();
        }
    });
});

server.listen(port, host, function() {
    console.log(`Listening at http://${host}:${port}`);
});

/*
{
  "Foobar": {
    "foobar": [
      {
        "message": "Update README.md",
        "author": {
          "name": "Foobar",
          "email": "foobar@email.com",
          "date": "2017-02-16T19:25:15Z"
        },
        "url": "https://github.com/Foobar/foobar/commit/20ad02f81024c7dc9bff6da3d8e996725203923e",
        "sha": "20ad02f81024c7dc9bff6da3d8e996725203923e"
      }
    ]
  }
}
*/