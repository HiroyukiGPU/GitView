// GitHub APIでリポジトリを検索
export async function searchRepositories(query) {
  try {
    const response = await fetch(
      `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=20`
    );

    if (!response.ok) {
      throw new Error('Failed to search repositories');
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
    console.error('Error searching repositories:', error);
    throw error;
  }
}

