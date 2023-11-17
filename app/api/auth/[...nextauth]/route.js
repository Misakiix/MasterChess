import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient()

const handler = NextAuth({
    providers: [
        Credentials({
            name: 'Credentials',
            type: "credentials",
            id: "signinauth",
            async authorize(credentials) {
                const { username, password } = credentials;

                const findUser = await prisma.user.findUnique({ where: { username: username } });

                if(!findUser) return null

                await bcrypt.compare(password, findUser.password).then((e) => {
                    if(!e) return null
                })

                const user = {
                    id: findUser.id,
                    username: findUser.username,
                    bio: findUser.bio,
                    avatar: findUser.avatar,
                    rating: findUser.rating,
                    country: findUser.country,
                    createdAt: findUser.createdAt
                }

                if(user) return user

            }
        })
    ],
    callbacks: {
        jwt: async({ token, user }) => {

            if(user) {
                token.id = user.id,
                token.username = user.username,
                token.bio = user.bio
                token.avatar = user.avatar,
                token.rating = user.rating,
                token.country = user.country,
                token.createdAt = user.createdAt
            }

            return Promise.resolve(token)
            
        },
        session: async({ session, token }) => {

            if(token) {
                session.user = {
                    userID: token.id,
                    name: token.username,
                    bio: token.bio,
                    avatar: token.avatar,
                    rating: token.rating,
                    country: token.country,
                    createdAt: token.createdAt
                }
            }

            return Promise.resolve(session);

        }
    },
    secret: process.env.JWT_SECRET || "eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTY5ODc4MjkzNywiaWF0IjoxNjk4NzgyOTM3fQ.EmGqQxpjjnWt_qDwH0q0-emzceU4JEzb-BKdoHYiaPc",
    jwt: {
        secret: process.env.JWT_SECRET || "eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTY5ODc4MjkzNywiaWF0IjoxNjk4NzgyOTM3fQ.EmGqQxpjjnWt_qDwH0q0-emzceU4JEzb-BKdoHYiaPc",
        encryption: true
    },
    pages: {
        signIn: "/auth/login"
    }
})

export { handler as GET, handler as POST }