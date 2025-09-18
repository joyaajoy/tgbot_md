const { Octokit } = require("@octokit/rest");

async function getFileContent(repoOwner, repoName, filePath, githubToken) {
  const octokit = new Octokit({
    auth: githubToken,
  });

  try {
    const { data } = await octokit.repos.getContent({
      owner: repoOwner,
      repo: repoName,
      path: filePath,
    });

    const fileContent = Buffer.from(data.content, 'base64').toString('utf-8');
    return fileContent;
  } catch (error) {
    return `Error: ${error}`;
  }
}

// Пример использования
const repoOwner = "joyaajoy";
const repoName = "amnezia-client";
const filePath = "README.md";
const githubToken = "YOUR_GITHUB_TOKEN"; // Замените на свой токен GitHub

getFileContent(repoOwner, repoName, filePath, githubToken)
  .then(content => console.log(content))
  .catch(error => console.error(error));