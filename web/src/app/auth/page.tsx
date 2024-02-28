'use client'

import { Separator } from "@/components/ui/separator"
import { useState } from "react";
import Login from "./components/login";
import Register from "./components/register";

export default function Authenticate() {
	const [isLogin, setIsLogin] = useState(true)

	return (
		<div className="h-full w-full flex justify-center items-center">
			<div className="flex justify-around border w-3/5 h-3/5 p-6 rounded-xl">
				<div className="flex justify-center items-center text-center w-[49%]">
					<div>
						<h1 className='text-8xl font-black'>.com</h1>
						<h5 className='text-xs tracking-wider'>Conectando Memórias Ponto a Ponto</h5>
					</div>
				</div>
				<Separator orientation="vertical"/>
				<div className="flex justify-center items-center w-[49%]">
					{isLogin ? <Login onChangePage={setIsLogin}/> : <Register onChangePage={setIsLogin}/>}
				</div>
			</div>
		</div>
	);
}