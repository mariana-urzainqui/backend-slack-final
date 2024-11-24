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
    MYSQL: {
        USERNAME: process.env.MYSQL_USERNAME,
        HOST: process.env.MYSQL_HOST,
        PASSWORD: process.env.MYSQL_PASSWORD,
        DATABASE: process.env.MYSQL_DATABASE
    },
    CLOUD_NAME: process.env.CLOUD_NAME,
    CLOUD_API_KEY: process.env.CLOUD_API_KEY,
    CLOUD_API_SECRET: process.env.CLOUD_API_SECRET
}

export default ENVIRONMENT