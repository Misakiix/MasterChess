const nextConfig = {
    env: {
        NEXT_PUBLIC_URL: 'http://localhost:3000',
        JWT_SECRET: 'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTY5ODc4MjkzNywiaWF0IjoxNjk4NzgyOTM3fQ.EmGqQxpjjnWt_qDwH0q0-emzceU4JEzb-BKdoHYiaPc',
        DATABASE_URL: 'postgres://postgres.eulyxwlkddhmmnfxlypb:J10j10j10419!@aws-0-sa-east-1.pooler.supabase.com:6543/postgres'
    },
}

module.exports = nextConfig
