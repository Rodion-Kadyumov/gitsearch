function requestUserRepos(username) {
  return Promise.resolve(fetch(`https://api.github.com/users/${username}/repos`));
}

// export requestUserRepos;