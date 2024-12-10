import dotenv from 'dotenv'

dotenv.config()

const ENVIRONMENT = {
    PORT: process.env.PORT,
    BASE_URL: process.env.BASE_URL,
    DB_URL: process.env.DB_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    GMAIL_PASS: process.env.GMAIL_PASS,
    GMAIL_USER: process.env.GMAIL_USER,
    URL_FRONT: process.env.URL_FRONT,
    API_KEY_INTERN: process.env.API_KEY_INTERN,
}

export default ENVIRONMENT