import bcrypt from "bcrypt";

import User from "../db/models/User.js";

import HttpError from "../helpers/HttpError.js";

import { createToken } from "../helpers/jwt.js";
import gravatar from "gravatar";

export const findUser = email => User.findOne({
    where: { email },
})

export const updateUser = async (id, data)=> {
    const user = await User.findByPk(id);

    return await user.update(data, {
        returning: true,
    });
}

export const registerUser = async payload => {
    const {email, password} = payload;
    const user = await User.findOne({
        where: {
            email
        }
    });
    if(user) {
        throw HttpError(409, "Email in use");
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const avatarURL = gravatar.url(email, { protocol: 'https', s: '250' });
    return await User.create({...payload, password: hashPassword, avatarURL});
}

export const loginUser = async payload => {
    const {email, password} = payload;
    const user = await User.findOne({
        where: {
            email
        }
    });
    if(!user) {
        throw HttpError(401, "Email or password incorrect");
    }

    const paswordCompare = await bcrypt.compare(password, user.password);
    if(!paswordCompare) {
        throw HttpError(401, "Email or password incorrect");
    }

    // const token = jwt.sign({email}, JWT_SECRET, {expiresIn: "24h"});
    const token = createToken({email});
    await user.update({token}, {
        returning: true,
    });

    return user;
}

export const logoutUser = async id => {
    const user = await User.findByPk(id);
    user.token = null;
    await user.save();
}