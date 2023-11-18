import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

type ResponseData = {
  message: string;
};

export async function POST(req: NextRequest, res: NextResponse<ResponseData>) {
  // if(req.method === 'POST') return res.json({ message: "Invalid Request" });

  try {

    const response = await new Response(req.body).text();

    const data = await JSON.parse(response);

    const { username, email, password, repassword } = data

    if (!username || !email || !password || !repassword || password !== repassword) {
      return Response.json({ message: "Invalid Request" });
    }

    const firstCheck = await prisma.user.findUnique({ where: { username }, select: { username: true } });
    const secondCheck = await prisma.user.findUnique({ where: { email }, select: { email: true } });

    if (firstCheck) return Response.json({ message: "Username has already been chosen." });
    if (secondCheck) return Response.json({ message: "Email has already been chosen." });

    const encryptPass = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        id: uuidv4(),
        username,
        email,
        password: encryptPass,
      },
    });

    if (user) return Response.json({ message: "User created successfully." });
  } catch (error) {
    console.log(error);
    return Response.json({ message: "Internal Server Error" });
  }
}
