import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { useState } from "react";
import Cookies from 'universal-cookie';
import dayjs from 'dayjs';
import { redirect } from "next/navigation";

interface RegisterProps {
	onChangePage: (page: boolean) => void;
}

export default function Register({onChangePage}:RegisterProps) {
	const [name, setName] = useState<string>()
	const [email, setEmail] = useState<string>()
	const [password, setPassword] = useState<string>()

	const cookies = new Cookies();

	const handleRegister = async () => {
		try {
			const response = await api.post('/register', {
				name,
				email,
				password
			})

			cookies.set('token_dotcom', response.data.token, { path: '/', expires: dayjs().add(7, 'day').toDate() })
			window.location.href = '/home'
		} catch (error) {
			console.error(error)
		}
	}

	return (
		<form onSubmit={handleRegister} className="space-y-4" >
			<div className="space-y-1">
				<Label htmlFor="name">Nome:</Label>
				<Input id="name" type="text" onChange={(e) => setName(e.target.value)}/>
			</div>
			<div className="space-y-1">
				<Label htmlFor="email">Email:</Label>
				<Input id="email" type="email" onChange={(e) => setEmail(e.target.value)} />
			</div>
			<div className="space-y-1">
				<Label htmlFor="password">Senha:</Label>
				<Input id="password" type="password" onChange={(e) => setPassword(e.target.value)} />
			</div>
			<Button className="w-full" type="submit">Registrar</Button>
			<div className="w-full flex justify-center">
				<p className="text-sm text-muted-foreground cursor-pointer w-fit" onClick={() => onChangePage(true)}>Realizar login</p>
			</div>
		</form>
	)
}