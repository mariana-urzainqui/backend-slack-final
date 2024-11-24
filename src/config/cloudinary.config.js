import cloudinary from 'cloudinary'
import ENVIRONMENT from './environment.config.js'


cloudinary.config({
    cloud_name: ENVIRONMENT.CLOUD_NAME,
    api_key: ENVIRONMENT.CLOUD_API_KEY,
    api_secret: ENVIRONMENT.CLOUD_API_SECRET,
})

export default cloudinary