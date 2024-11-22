import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addPost, fetchPosts, fetchTags } from "../api/api";
import { useState } from "react";

const PostList = () => {
	const [page, setPage] = useState(1);
	const queryClient = useQueryClient();

	const {
		data: postsData,
		isLoading,
		isError,
		error,
	} = useQuery({
		queryKey: ["posts", { page }],
		queryFn: () => fetchPosts(page),
		staleTime: 1000 * 60 * 5
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
		onMutate: () => {
			return { id: 1 };
		},
		onSuccess: (data, variables, context) => {
			queryClient.invalidateQueries({
				queryKey: ["posts"],
				exact: true,
			});
		},
		// onError: (error, variables, context) => {},
		// onSettled: (data, error, variables, context) => {},
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

		mutate({ id: postsData?.data?.length + 1, title, tags });
		event.target.reset();
	};

	console.log(postsData);

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

			{isLoading && isPending && <p>Loading.........</p>}
			{isError && <p>{error?.message}</p>}
			{isPostError && (
				<p>
					Unable to Post <button onClick={() => reset()}>Reset</button>
				</p>
			)}

			<div className="pages">
				<button onClick={() => setPage((oldPage) => Math.max(oldPage - 1, 0))} disabled={!postsData?.prev}>Previous</button>
				<span>{page}</span>
				<button onClick={() => setPage((nextPage) => nextPage + 1)} disabled={!postsData?.next}>Next</button>
			</div>

			{postsData?.data?.map((post) => (
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
