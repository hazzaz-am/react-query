import { useMutation, useQuery } from "@tanstack/react-query";
import { addPost, fetchPosts, fetchTags } from "../api/api";

const PostList = () => {
	const {
		data: postsData,
		isLoading,
		isError,
		error,
	} = useQuery({
		queryKey: ["posts"],
		queryFn: fetchPosts,
	});

	const { data: tagsData } = useQuery({
		queryKey: ["tags"],
		queryFn: fetchTags,
	});

	const {
		isError: isPostError,
		error: postError,
		isPending,
		mutate,
		reset,
	} = useMutation({
		mutationFn: addPost,
	});

	const handleSubmit = (event) => {
		event.preventDefault();
		const formData = new FormData(event.target);
		const title = formData.get("title");
		const tags = Array.from(formData.keys()).filter(
			(key) => formData.get(key) === "on"
		);

		if (!title || !tags) {
			return;
		}

		mutate({id: postsData.length + 1, title, tags });
    event.target.reset()
	};

	return (
		<div className="container">
			<form onSubmit={handleSubmit}>
				<input
					type="text"
					placeholder="Enter your post.."
					className="postbox"
					name="title"
				/>
				<div className="tags">
					{tagsData?.map((tag) => (
						<div key={tag}>
							<input type="checkbox" name={tag} id={tag} />
							<label htmlFor={tag}>{tag}</label>
						</div>
					))}
				</div>
				<button disabled={isPending}>
					{isPending ? "Posting..." : "Post"}
				</button>
			</form>

			{isLoading && <p>Loading.........</p>}
			{isError && <p>{error.message}</p>}
			{postsData?.map((post) => (
				<div className="post" key={post.id}>
					<div>{post.title}</div>
					{post?.tags?.map((tag) => (
						<span key={tag}>{tag}</span>
					))}
				</div>
			))}
		</div>
	);
};
export default PostList;
