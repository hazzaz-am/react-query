export const fetchPosts = async () => {
  const response = await fetch("http://localhost:3000/posts?_sort=-id");

  const postsData = await response.json()
  return postsData
}

export const fetchTags = async () => {
  const response = await fetch("http://localhost:3000/tags");
  const tagsData = await response.json()
  return tagsData
}

export const addPost = async (post) => {
  const response = await fetch("http://localhost:3000/posts", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(post)
  });

  return response.json()
}