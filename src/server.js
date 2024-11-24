import ENVIRONMENT from "./config/environment.config.js"
import express from "express"
import mongoose from "./db/config.js" // Este import es la conexion con la DB (NO BORRAR)
import cors from 'cors'
import authRouter from "./router/auth.router.js"
import statusRouter from "./router/status.router.js"
import { verifyApiKeyMiddleware } from "./middlewares/auth.middleware.js"


const app = express()

app.use(cors())
app.use(express.json({limit: '5mb'}))
app.use(verifyApiKeyMiddleware)


app.use('/api/status', statusRouter)
app.use('/api/auth', authRouter)


app.listen(ENVIRONMENT.PORT, () => {
    console.log(`El servidor se esta escuchando en http://localhost:${ENVIRONMENT.PORT}`)
})