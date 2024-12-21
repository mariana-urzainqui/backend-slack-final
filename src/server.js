import ENVIRONMENT from "./config/environment.config.js"
import express from "express"
import mongoose from "./db/config.js" // Este import es la conexion con la DB (NO BORRAR)
import cors from 'cors'
import authRouter from "./router/auth.router.js"
import statusRouter from "./router/status.router.js"
import { verifyApiKeyMiddleware } from "./middlewares/auth.middleware.js"
import workspaceRouter from "./router/workspace.router.js"
import channelRouter from "./router/channel.router.js"
import messageRouter from "./router/message.router.js"
import memberRouter from "./router/member.router.js"


const app = express()

const cors = require('cors');

app.use(cors({
    origin: ['https://frontend-slack-final.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}))
app.use(express.json({ limit: '5mb' }))
app.use(verifyApiKeyMiddleware)


app.use('/api/status', statusRouter)
app.use('/api/auth', authRouter)
app.use('/api/workspace', workspaceRouter)
app.use('/api/channel', channelRouter)
app.use('/api/message', messageRouter)
app.use('/api/workspace', memberRouter)

app.listen(ENVIRONMENT.PORT, () => {
    console.log(`El servidor se esta escuchando en http://localhost:${ENVIRONMENT.PORT}`)
})