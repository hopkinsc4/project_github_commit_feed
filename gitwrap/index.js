//personal access token for github API: a5b2fad6758ffd94fe061fc92f5fb754023f204d
var GitHubApi = require('github');

module.exports = {
    getUserRepos: function(username, token, callback) {
        var github = new GitHubApi({
            headers: {
                'User-Agent': `${username}`
            }
        });
        
        // TODO: optional authentication here depending on desired endpoints. See below in README.
        github.authenticate({
            type: 'token',
            token: `${token}`
        })

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

    getRepoCommits: function(user, token, repoName, callback) {
        var github = new GitHubApi({
            headers: {
                'User-Agent': `${user}`
            }
        });
        
        // TODO: optional authentication here depending on desired endpoints. See below in README.
        github.authenticate({
            type: 'token',
            token: `${token}`
        })

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
            })
        })
        repoCommits.then((commits) => {
            callback(commits);
        })
    }
}

