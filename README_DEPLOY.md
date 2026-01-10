# Guia de Publicação - Ministério Jeová Jiré

Siga este guia para colocar seu sistema online de forma gratuita e profissional em 2025.

## 1. Banco de Dados (Neon.tech)
1. Crie uma conta em [Neon.tech](https://neon.tech).
2. Crie um novo projeto chamado `eclesia-ledger`.
3. Copie a **Connection String** (algo como `postgresql://user:pass@ep-ghost-123.neon.tech/neondb`).
4. **Guarde este link**, você precisará dele no passo do Render.

## 2. Backend (Render.com)
1. Crie uma conta em [Render.com](https://render.com).
2. Clique em **"New"** > **"Web Service"**.
3. Conecte seu repositório do GitHub (onde você subiu o código).
4. Configure:
   - **Root Directory**: `api` (Isso é fundamental porque o Prisma está dentro desta pasta)
   - **Environment**: `Node`
   - **Build Command**: `npm install && npx prisma generate`
   - **Start Command**: `npm start`
5. Vá em **"Environment"** e adicione:
   - `DATABASE_URL`: (A que você copiou do Neon)
   - `NODE_ENV`: `production`
6. Após o deploy, o Render te dará uma URL (ex: `https://eclesia-api.onrender.com`). **Copie ela**.

## 3. Frontend (Vercel)
1. Crie uma conta em [Vercel.com](https://vercel.com).
2. Importe o seu repositório do GitHub.
   - **IMPORTANTE**: Eu criei um arquivo `.vercelignore` no seu projeto. Isso impede que a Vercel tente "subir" seu backend como Funções Serverless (o que causa o erro de limite de 12 funções).
3. Nas **Environment Variables**, adicione:
   - `VITE_API_URL`: `https://eclesia-api.onrender.com/api` (Sua URL do Render + `/api`)
4. Clique em **Deploy**.

## 4. Inicializar o Banco
No seu computador, use o terminal na pasta `api` para migrar os dados para o novo banco:
```bash
# No diretório /api
env DATABASE_URL="SUA_URL_DO_NEON" npx prisma migrate deploy
env DATABASE_URL="SUA_URL_DO_NEON" npm run db:seed
```

---
> [!TIP]
> **Dica de Ouro**: O Render (plano gratuito) "dorme" após 15 minutos sem uso. O primeiro acesso do dia pode demorar uns 30 segundos para carregar.
