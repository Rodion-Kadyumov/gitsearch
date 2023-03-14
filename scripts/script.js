const formRepo = document.querySelector(".search__input");
const inputRepo = formRepo.querySelector(".search-repo");
const btnRepo = formRepo.querySelector(".search-btn");
const repoList = document.querySelector(".search__result");
const gitHubForm = document.getElementById('gitHubForm');
const enter = 'Enter';

function requestUserRepos(username) {
  return Promise.resolve(fetch(`https://api.github.com/users/${username}/repos`));
}

gitHubForm.addEventListener('submit', (e) => {

  e.preventDefault();
  let usernameInput = document.getElementById('usernameInput');
  let gitHubUsername = usernameInput.value;
  requestUserRepos(gitHubUsername)
    .then(response => response.json())
    .then(data => {
    for (let i in data) {
      let ul = document.getElementById('userRepos');
      let li = document.createElement('li');
      li.classList.add('list-group-item')
      li.innerHTML = (`
      <p><strong>Repo:</strong> ${data[i].name}</p>
      <p><strong>Description:</strong> ${data[i].description}</p>
      <p><strong>URL:</strong> <a href="${data[i].html_url}">${data[i].html_url}</a></p>
      `);
      ul.appendChild(li);
    }
  })
})

const listElement = (blockData) => {
  const { full_name, description, stargazers_count, forks_count, language, size
  } = blockData;
  const [author, repoName] = full_name.split("/");
  const liRepo = document.createElement("li");
  liRepo.classList.add("repo");
  liRepo.innerHTML = `
    <div class="repo__wrap">
      <div>
        <p><strong>Можно посмотеть тут:</strong> <a
        href="https://github.com/${full_name}"
        target="_blank"
        >${repoName}</a>
        </p>
        <p><strong>Автор:</strong> ${author}</p>
        <p><strong>Описание:</strong> ${description}</p
        >
      </div>
      <div>
        <div>
          <div>
            <p><strong>Количество звёзд:</strong> ${stargazers_count}</p>
          </div>
          <div>  
            <p><strong>Fork:</strong> ${forks_count}</p>
          </div>
        </div>
        <p><strong>Язык написания:</strong> ${language}</p>
        <p><strong>Размер:</strong> ${size}</p>
      </div>
    </div>
  `;
  repoList.append(liRepo);
};

const searchRepo = async (query) => {
  const queryString = "q=" + encodeURIComponent(query);
  const response = await fetch(
    `https://api.github.com/search/repositories?${queryString}`
  );
  if (response.ok) {
    const result = await response.json();
    return result.items.length < 10 ? result.items : result.items.slice(0, 9);
  } return;
};

formRepo.addEventListener("submit", async (e) => {
  e.preventDefault();
  repoList.innerHTML = "";
  const query = inputRepo.value;
  if (!query) {
    return;
  }
  const repos = await searchRepo(query);
  if (!repos.length) {
    repoList.innerHTML = `<h2>Такого реппозитория нет</h2>`;
    return;
  }
  for (let blockData of repos) {
    listElement(blockData);
  }
});

formRepo.addEventListener("keypress", (e) => {
  if (e.code === enter) {
    e.preventDefault();
    btnRepo.click();
  }
});