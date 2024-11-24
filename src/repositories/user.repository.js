import User from "../models/user.model.js";
import bcrypt from "bcrypt"
import ENVIRONMENT from "../config/environment.config.js";
import jwt from 'jsonwebtoken'

class UserRepository{
    static async getById(id){
        return await User.findOne({_id: id})
        
    }   

    static async getByEmail(email){
        return await User.findOne({email})
        
    }

    static async isEmailInUse(email){
        const user = await User.findOne({email})
        return !!user
    }

    static async saveUser (user){
        return await user.save()
    }

    static async setEmailVerified(value, user_id){
        const user = await this.getById(user_id)
        if(!user){
            throw new Error('Usuario no encontrado')
        }
        user.emailVerified = value
        return await this.saveUser(user)
    }

    static async updatePassword(user, newPassword){
        const hashedPassword = await bcrypt.hash(newPassword, 10)
        user.password = hashedPassword
        return await this.saveUser(user)
    }

    static async createUser({name, email, password}){
        const hashedPassword = await bcrypt.hash(password, 10)
        const verificationToken = jwt.sign({email}, ENVIRONMENT.JWT_SECRET, {
            expiresIn: "1d"
        })
        const user = new User({
            name,
            email,
            password: hashedPassword,
            verificationToken,
            emailVerified: false
        })
        return await this.saveUser(user)
    }
}

export default UserRepository