var GitHubApi = require('github');

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
            })
        })
        repoCommits.then((commits) => {
            callback(commits);
        })
    }
}

