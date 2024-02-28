/* eslint-disable @next/next/no-img-element */
import { Post } from "@/lib/model/view-model/post-view-model";
import { Heart } from "lucide-react";
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/pt-br';
import dayjs from "dayjs";
import { api } from "@/lib/api";
import Cookies from "universal-cookie";
import {jwtDecode} from 'jwt-decode'
import { useState } from "react";

dayjs.extend(relativeTime);
dayjs.locale('pt-br');

interface PostProps {
	post: Post
	onLike: (postId: string, userId:string) => void
}

export default function Post({ post, onLike }: PostProps) {
	const cookies = new Cookies();
	const token = cookies.get('token_dotcom');
	const decoded = jwtDecode(token) as { userId: string };

	const [showMore, setShowMore] = useState<boolean>();

	const handleLike = async () => {
		try {
			await api.post('/like', { userId: decoded.userId, postId: post.id})
			onLike(post.id, decoded.userId);
		} catch (error) {	
			console.log(error)
		}
	}

	return (
		<div className="w-2/6 border flex flex-col justify-center rounded-xl">
			<div className="p-4 flex justify-between items-center ">
				<p className="text-sm text-primary">{post.author}</p>
				<p className="text-xs text-muted-foreground">{dayjs(post.createdAt).fromNow()}</p>
			</div>
			<img src={post.imageUrl} alt="background"  className="h-96 w-auto object-cover object-center"/>
			<div className="relative overflow-hidden">
				<p className="text-sm text-muted-foreground px-4 pt-4">{(post.caption.length > 350 && showMore) || post.caption.length <= 350 ? post.caption : post.caption.substring(0, 347) + '...'}</p>
				{!showMore && post.caption.length > 350 && <div className='absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-background to-transparent pointer-events-none'/>}
			</div>
			{!showMore && post.caption.length > 350 && (
				<div className="w-full px-8 flex justify-end">
					<p className="w-fit text-sm text-muted-foreground cursor-pointer hover:text-primary transition-colors" onClick={() => setShowMore(true)}>ver mais</p>
				</div>
			)}
			<div className="py-4 px-8 flex items-center gap-2 justify-end">
				<p className="text-sm text-muted-foreground">{post.likes.length}</p>
				<Heart size={20} className={`text-muted-foreground hover:text-red-500 hover:fill-red-500 cursor-pointer transition-colors ${post.likes.includes(decoded.userId) && "text-red-500 fill-red-500"}`} onClick={handleLike}/>
			</div>
		</div>
	)
}