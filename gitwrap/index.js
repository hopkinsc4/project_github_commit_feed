var GitHubApi = require('github');
var login = require('../auth/login.js');

module.exports = {
    getUserRepos: function(username, callback) {
        var github = new GitHubApi({
            headers: {
                'User-Agent': `${username}`
            }
        });

        var returnUserRepos = [];

        var userRepos = new Promise( (resolve, reject) => {
            github.repos.getForUser({
                username: `${username}`
            }, function(err, res) {
                if (err) {
                    reject(err);
                } else {
                    resolve(res.data);
                }
            })
        })
        userRepos.then((repos) => {
            repos.forEach((repo) => {
                returnUserRepos.push(repo.name);
            })
            callback(returnUserRepos);
        })
    },
    getRepoCommits: function(user, repoName, callback) {
        var github = new GitHubApi({
            headers: {
                "User-Agent": `${user}`
            }
        })
        var u = login.u();
        var p = login.p();
        github.authenticate({
            type: 'basic',
            username: `${u}`,
            password: `${p}`
        })

        var returnRepoCommits = [];

        var commitCallback = new Promise((resolve, reject) => {
            github.repos.getCommits({
                owner: `${user}`,
                author: `${user}`,
                repo: `${repoName}`
            }, (error, response) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(response);
                }
            })
            }).then((commits) => {
                var repoCommits = commits['data'];
                repoCommitsArray = [];
                repoCommits.forEach(function(rc) {

                    var message = rc.commit.message;
                    var author = rc.commit.author.name;
                    var html_url = rc.html_url;
                    var sha = rc.sha;

                    var commitInfo = {
                        "message": `${message}`,
                        "author": `${author}`,
                        "html_url": `${html_url}`,
                        "sha": `${sha}`
                    }

                    repoCommitsArray.push(commitInfo);
                })

                callback(repoCommitsArray);
            })
            .catch((error) => {
                callback(error);
            })
    }

/*
    repoCommits.forEach(function(rc) => {
        ....
    })

    {
        "commit": [
            "message": "rc.commit['message']",
            "author": "rc.commit.author.name",
            "html_url": "rc.commit['html_url']",
            "sha": "rc.commit[sha]"
        ]
    }


*/




    /*
    getRepoCommits: function(user, repoName, callback) {
        var github = new GitHubApi({
            headers: {
                'User-Agent': `${user}`
            }
        });
        
        // TODO: optional authentication here depending on desired endpoints. See below in README.

        
        var returnRepoCommits = [];
        var repoCommits = new Promise( (resolve, reject) => {
            github.repos.getCommits({
                owner: `${user}`,
                author: `${user}`,
                repo: `${repoName}`
            }, function(err, res) {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            });
        });
        repoCommits.then((commits) => {
            callback(commits);
        });
        
    }
    */
};

