'use client'

import { LogOut, Plus } from "lucide-react";
import Post from "./components/post";
import NewPost from "./components/new-post";
import { useEffect, useState } from "react";
import { Post as PostViewModel} from '@/lib/model/view-model/post-view-model'
import { api } from "@/lib/api";
import Cookies from "universal-cookie";

export default function Home() {
	const cookies = new Cookies()

	const [posts, setPosts] = useState<PostViewModel[]>();
	const [newPost, setNewPost] = useState<boolean>(false)

	const scrollToTopOfDiv = (divId: string) => {
    const container = document.getElementById(divId);

    if (container) {
        container.scrollTop = 0;
        history.pushState({}, "", window.location.pathname);
    }
	};


	const fetchPosts = async () => {
		try {
			const response = await api.get('/post');

			setPosts(response.data);
		} catch (error) {
			console.error("Erro ao buscar posts:", error);
		}
	};

	useEffect(() => {
		fetchPosts();
	}, []);

	const handleLike = (postId: string, userId: string) => {
		const newPosts = posts?.map((post) => {
			if (post.id === postId) {
				if (post.likes.includes(userId)) {
					post.likes = post.likes.filter((like) => like !== userId);
				} else {
					post.likes.push(userId);
				}
			}
			return { ...post }; // Criando uma cópia do objeto post para garantir imutabilidade
		});
	
		setPosts(newPosts);
	}

	return (
		<div className="h-full relative">
			<div className="absolute left-12 top-12" >
				<h1 className='text-4xl font-black'>.com</h1>
			</div>
			<div className="absolute z-10 right-14 top-14 cursor-pointer" onClick={() => {
				cookies.remove('token_dotcom')
				window.location.reload()
			}}>
				<LogOut size={20} className="cursor-pointer"/>
			</div>
			<div id="posts" className="absolute w-full h-full flex flex-col gap-8 items-center overflow-y-auto py-12 scroll-smooth">
				<div className={`${!newPost && 'hidden'} w-2/6`}>
					{newPost && <NewPost />}
				</div>
				{
					posts ? posts.map((post) => (
						<Post key={post.id} post={post} onLike={handleLike}/>
					)) : <p>Ainda não existem posts...</p>
				}
			</div>
			<div onClick={() => {
				setNewPost(true)
				scrollToTopOfDiv('posts')
			}} className="fixed p-2 bottom-24 right-32 rounded-full bg-primary text-secondary hover:bg-primary/80 transition-colors cursor-pointer">
				<Plus size={24} />
			</div>
		</div>
	)
}