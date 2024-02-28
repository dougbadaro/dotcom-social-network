import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { AxiosError, isAxiosError } from "axios";
import dayjs from "dayjs";
import { FormEvent, useEffect, useState } from "react";
import Cookies from "universal-cookie";

interface LoginProps {
	onChangePage: (page: boolean) => void;
}

export default function Login({onChangePage}: LoginProps) {
	const [email, setEmail] = useState<string>()
	const [password, setPassword] = useState<string>()

	const [error, setError] = useState<string>()

	const cookies = new Cookies();

	const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		try {
			if(email && password) {
				if(password.length >= 8) {
					const response = await api.post('/login', {
						email,
						password
					})
		
					cookies.set('token_dotcom', response.data.token, { path: '/', expires: dayjs().add(7, 'day').toDate() })
					window.location.href = '/home'
				}
				else {
					setError('Senha deve ter no mínimo 8 caracteres')
				}
			} else {
				setError('Preencha todos os campos')
			}
		} catch (error) {
			if(isAxiosError(error)) {
				if(error.response && error.response.status === 401) {
					setError(error.response.data)
				}
			}
		}
	}

	useEffect(() => {
		if(error) {
			setTimeout(() => {
				setError('')
			}, 5000)
		}
	}, [error])

	return (
		<form onSubmit={(e) => handleLogin(e)} className="space-y-4">
			<div className="space-y-1">
				<Label htmlFor="email">Email:</Label>
				<Input id="email" type="email" onChange={(e) => setEmail(e.target.value)} />
			</div>
			<div className="space-y-1">
				<Label htmlFor="password">Senha:</Label>
				<Input id="password" type="password" onChange={(e) => setPassword(e.target.value)} />
			</div>
			<Button type="submit" className="w-full">Entrar</Button>
			<div className="w-full flex justify-center">
				<p className="text-sm text-muted-foreground cursor-pointer" onClick={() => onChangePage(false)}>Criar minha conta</p>
			</div>
			{error && (
				<Alert className="fixed right-8 bottom-8 w-fit p-4 border-yellow-500 text-yellow-500">
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)}
		</form>
	)
}