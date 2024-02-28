/* eslint-disable @next/next/no-img-element */
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";
import { jwtDecode } from "jwt-decode";
import { Camera } from "lucide-react";
import { useState } from "react";
import Cookies from "universal-cookie";

export default function NewPost() {
	const cookies = new Cookies()
	const token = cookies.get('token_dotcom')
	const decoded = jwtDecode(token) as { userId: string }

	const [image, setImage] = useState<File>()
	const [caption, setCaption] = useState<string>()

	const handlePost = async () => {
		try {
			const formData = new FormData()
			formData.set('image', image as Blob)
			const response = await api.post('/upload', formData)

			await api.post('/post', {
				imageUrl: response.data.fileUrl,
				caption,
				authorId: decoded.userId
			})

			window.location.reload()
		} catch (error) {
			console.error(error)
		}
	}

	return (
		<div className="border flex flex-col justify-center rounded-xl">
			{image ? (
				<img src={URL.createObjectURL(image)} alt="background"  className="h-44 w-auto object-cover object-center rounded-t-xl"/>
			) : (
				<Label htmlFor="imagePost" className="w-full bg-primary rounded-t-xl h-44 flex flex-col gap-2 justify-center items-center hover:bg-primary/80 transition-colors cursor-pointer text-secondary">
					<Camera size={20}/>
					Insira a imagem
				</Label>
			)}
			<input id="imagePost" type="file" accept="image/*" onChange={(e) => e.target.files && setImage(e.target.files[0])} className="hidden"/>
			<Textarea placeholder="Digite aqui a legenda..." className="h-32 focus-visible:ring-0 border-t-none rounded-none border-x-0 resize-none" onChange={(e) => setCaption(e.target.value)}/>
			<div className="flex justify-end p-2">
				<Button className="bg-primary text-secondary hover:bg-primary/80 transition-colors" onClick={handlePost}>Postar</Button>
			</div>
		</div>
	)
}