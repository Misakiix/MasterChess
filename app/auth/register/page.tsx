'use client';

import Link from "next/link"
import { Button, IconButton, CircularProgress } from "@mui/material";
import { useState } from "react";
import { getCsrfToken, useSession, signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import GoogleIcon from '@mui/icons-material/Google';
import LinearProgress from '@mui/material/LinearProgress';

interface RegisterData {
    username: string,
    email: string,
    password: string,
    repassword: string
}


export default function Register() {

    const router = useRouter()
    const { register, handleSubmit } = useForm<RegisterData>()
    const { data: session, status } = useSession()
    const [passStrength, setPassStrength] = useState(0)
    const [loading, setLoading] = useState(false)
    
    if(status === "authenticated") {
        {
			router.push("/", { scroll: false })
		}
	}

    const checkPassStrength = (pass: string) => {
        let score = 0;

        // Critérios para atribuir pontuações
        const criteria = [
            { pattern: /[A-Z]/, points: 20 },    // Letras maiúsculas
            { pattern: /[a-z]/, points: 20 },    // Letras minúsculas
            { pattern: /\d/, points: 20 },       // Números
            { pattern: /[\W_]/, points: 20 },    // Caracteres especiais
            { pattern: /.{8,}/, points: 20 },    // Comprimento mínimo de 8 caracteres
        ];

        // Verifica cada critério e atribui pontuações
        criteria.forEach((criterion) => {
            if (criterion.pattern.test(pass)) {
                score += criterion.points;
            }
        });

        // A pontuação máxima é 100
        setPassStrength(Math.min(100, score));
    }

    const Register = async (data: RegisterData) => {
        try {
            const { username, email, password, repassword } = data;

            if(!username || !email || !password || !repassword) return

            setLoading(true)

            const response = await fetch(process.env.NEXT_PUBLIC_URL + "/api/authsystem/register", {
                method: 'POST',
                body: JSON.stringify(data)
            })

            const { message } = await response.json()

            if(message === "User created successfully.") {
                await signIn("signinauth", {
                    redirect: false,
                    username: username,
                    password: password
                })
                .then((e) => {
                    setLoading(false)
                })
            }


        } catch (err) {
            console.error(err)
        }
    }


    return (
        <main className="flex justify-center px-2 lg:min-h-[80vh]">
            <div className="flex flex-col max-w-[512px] mb-10">
                <div className="flex flex-col items-center my-8">
                    <h1 className="text-xl xs:text-2xl sm:text-3xl mt-4 font-bold">Registrar no MasterChess</h1>
                </div>
                <div className="pb-4">
                    <p className="pb-4">
                        Crie uma conta no MasterChess para garantir acesso a mais conteúdos. Tais como:
                    </p>
                    <ul className="list-disc list-inside">
                        <li className="ml-4">Ganhar conquistas</li>
                        <li className="ml-4">Partidas com rating</li>
                        <li className="ml-4">Acompanhar as aberturas e as estatísticas das aberturas</li>
                    </ul>
                </div>
                <div className="flex my-4">
                    <Button variant="text" className="flex justify-center items-center text-white text-sm md:text-xl rounded-md px-2 py-2 disabled:opacity-50 disabled:cursor-not-allowed bg-masterchess-btns hover:bg-masterchess-hover-btns w-full">
                        <GoogleIcon />
                    </Button>
                </div>
                <div className="flex justify-center items-center">
                    <div className="h-1 m-4 w-full bg-masterchess-btns rounded-md" />
                    <p className="px-4 font-semibold">ou</p>
                    <div className="h-1 m-4 w-full bg-masterchess-btns rounded-md" />
                </div>
                <div className="mt-4" />
                <form method="POST" onSubmit={handleSubmit(Register)}>
                    <div className="mb-4 flex flex-col">
                        <label htmlFor="username" className="mb-2">Nome de usuário</label>
                        <input id="username" className="rounded-md indent-2 min-h-[50px] text-black" type="text" {...register('username')} />
                    </div>
                    <div className="mb-4 flex flex-col">
                        <label htmlFor="email" className="mb-2">Email</label>
                        <input id="email" className="rounded-md indent-2 min-h-[50px] text-black" type="email" {...register('email')} />
                    </div>
                    <div className="mb-4 flex flex-col">
                        <label htmlFor="password" className="mb-2">Senha</label>
                        <input id="password" className="rounded-md indent-2 min-h-[50px] text-black" type="password" {...register('password')} onChange={(v) => { checkPassStrength(v.target.value) }} />
                        <LinearProgress variant="determinate" color={passStrength < 30 ? "error" : passStrength < 50 ? "warning" : passStrength < 100 ? "success" : undefined} value={passStrength} className="mt-4 rounded-md bg-masterchess text-white p-1" />
                    </div>
                    <div className="mb-4 flex flex-col">
                        <label htmlFor="repassword" className="mb-2">Confirme sua senha</label>
                        <input id="repassword" className="rounded-md indent-2 min-h-[50px] text-black" type="password" {...register('repassword')} />
                    </div>
                    <div className="my-4">
                        <Button variant="text" className="flex justify-center items-center text-white text-sm md:text-xl rounded-md px-2 py-2 disabled:opacity-50 disabled:cursor-not-allowed bg-masterchess-btns hover:bg-masterchess-hover-btns w-full font-bold" type="submit">
                            {loading ? <CircularProgress className="text-white w-6 h-6" /> : "Registrar"}
                        </Button>
                    </div>
                </form>
                    <div className="flex justify-center items-center">
                        <div className="h-1 m-4 w-full bg-theme rounded-md"></div>
                    </div>
                    <h2 className="text-center text-xl my-4">Já tem uma conta?</h2>
                    <div className="mb-8 w-full">
                        <Button variant="text" className="flex justify-center items-center text-white text-sm md:text-xl rounded-md px-2 py-2 disabled:opacity-50 disabled:cursor-not-allowed bg-masterchess-btns hover:bg-masterchess-hover-btns w-full font-bold">
                            <Link href={"/auth/login"}>Logar</Link>
                        </Button>
                    </div>
            </div>
        </main>
    )
}