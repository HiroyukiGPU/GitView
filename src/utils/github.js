// GitHub APIからリポジトリ情報を取得
export async function fetchRepoInfo(repoUrl) {
  try {
    // GitHub URLから owner/repo を抽出
    const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (!match) {
      throw new Error('Invalid GitHub URL');
    }

    const [, owner, repo] = match;
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}`;

    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch repo info');
    }

    const data = await response.json();
    return {
      name: data.name,
      fullName: data.full_name,
      description: data.description || '',
      language: data.language || '',
      stars: data.stargazers_count || 0,
      owner: data.owner.login,
      ownerAvatar: data.owner.avatar_url,
      url: data.html_url,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  } catch (error) {
    console.error('Error fetching repo info:', error);
    return null;
  }
}

// テキストからGitHub URLを抽出
export function extractGitHubUrls(text) {
  const urlRegex = /https?:\/\/github\.com\/[^\s]+/g;
  return text.match(urlRegex) || [];
}

// Trending Reposを取得（GitHub APIの制限により、実際のTrendingは取得できないため、
// 代わりに最近のStarが多いリポジトリを取得）
export async function fetchTrendingRepos(language = null, perPage = 20) {
  try {
    let url = `https://api.github.com/search/repositories?q=stars:>1000&sort=stars&order=desc&per_page=${perPage}`;
    if (language) {
      url = `https://api.github.com/search/repositories?q=language:${language}+stars:>1000&sort=stars&order=desc&per_page=${perPage}`;
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch trending repos');
    }

    const data = await response.json();
    return data.items.map(item => ({
      name: item.name,
      fullName: item.full_name,
      description: item.description || '',
      language: item.language || '',
      stars: item.stargazers_count || 0,
      owner: item.owner.login,
      ownerAvatar: item.owner.avatar_url,
      url: item.html_url,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
    }));
  } catch (error) {
    console.error('Error fetching trending repos:', error);
    return [];
  }
}

