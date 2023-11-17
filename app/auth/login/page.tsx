'use client'

import Link from "next/link"
import { Button, IconButton, CircularProgress } from "@mui/material";
import { useState } from "react";
import { getCsrfToken, useSession, signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import GoogleIcon from '@mui/icons-material/Google';


interface LoginData {
    username: string,
    password: string,
}

export default function Login() {
    const router = useRouter()
    const { register, handleSubmit } = useForm<LoginData>()
    const { data: session, status } = useSession()
    const [loading, setLoading] = useState(false)

    if(status === "authenticated") {
        {
			router.push("/", { scroll: false })
		}
	}

    const Login = async (data: LoginData) => {
        try {
            const { username, password } = data

            if (!username || !password) return setLoading(false)

            setLoading(true)

            await signIn("signinauth", {
                redirect: false,
                username: username,
                password: password
            })
                .then((e) => {
                    setLoading(false)
                })

        } catch (error) {
            console.error(error)
        }
    }

    return (
        <main className="flex justify-center px-2 lg:min-h-[80vh]">
            <div className="flex flex-col max-w-[512px] mb-10">
                <div className="flex flex-col items-center my-8">
                    <h1 className="text-xl xs:text-2xl sm:text-3xl mt-4 font-bold">Logar no MasterChess</h1>
                </div>
                <div className="mt-4" />
                <form method="POST" onSubmit={handleSubmit(Login)}>
                    <div className="mb-4 flex flex-col">
                        <label htmlFor="username" className="mb-2">Nome de usuário</label>
                        <input id="username" className="rounded-md indent-2 min-h-[50px] text-black" type="text" {...register('username')} />
                    </div>
                    <div className="mb-4 flex flex-col">
                        <label htmlFor="password" className="mb-2">Senha</label>
                        <input id="password" className="rounded-md indent-2 min-h-[50px] text-black" type="password" {...register('password')} />
                    </div>
                    <div className="my-4">
                        <Button variant="text" className="flex justify-center items-center text-white text-sm md:text-xl rounded-md px-2 py-2 disabled:opacity-50 disabled:cursor-not-allowed bg-masterchess-btns hover:bg-masterchess-hover-btns w-full font-bold" type="submit">
                            {loading ? <CircularProgress className="text-white w-6 h-6" /> : "Logar"}
                        </Button>
                    </div>
                </form>
                <div className="flex justify-center items-center">
                    <div className="h-1 m-4 w-full bg-masterchess-btns rounded-md" />
                    <p className="px-4 font-semibold">ou</p>
                    <div className="h-1 m-4 w-full bg-masterchess-btns rounded-md" />
                </div>
                <div className="flex my-4">
                    <Button variant="text" className="flex justify-center items-center text-white text-sm md:text-xl rounded-md px-2 py-2 disabled:opacity-50 disabled:cursor-not-allowed bg-masterchess-btns hover:bg-masterchess-hover-btns w-full">
                        <GoogleIcon />
                    </Button>
                </div>
                <div className="flex justify-center items-center">
                    <div className="h-1 m-4 w-full bg-theme rounded-md"></div>
                </div>
                <h2 className="text-center text-xl my-4">Não tem uma conta?</h2>
                <div className="mb-8 w-full">
                    <Button variant="text" className="flex justify-center items-center text-white text-sm md:text-xl rounded-md px-2 py-2 disabled:opacity-50 disabled:cursor-not-allowed bg-masterchess-btns hover:bg-masterchess-hover-btns w-full font-bold">
                        <Link href={"/auth/register"}>Registrar</Link>
                    </Button>
                </div>
            </div>
        </main>
    )

}