import bcrypt from "bcrypt";
import { nanoid } from "nanoid";

import User from "../db/models/User.js";

import HttpError from "../helpers/HttpError.js";

import { createToken } from "../helpers/jwt.js";
import gravatar from "gravatar";
import sendEmail from "../helpers/sendEmail.js";

const {BASE_URL} = process.env;

const createVerifyEmail = (email, verificationToken) => {
    return {
        to: email,
        subject: "Verify email",
        html: `<a target="_blank" href="${BASE_URL}/auth/verify/${verificationToken}">Click verify email</a>`
    };
}

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

    const verificationToken = nanoid();

    const newUser = await User.create({...payload, password: hashPassword, avatarURL, verificationToken});

    const verifyEmail = createVerifyEmail(email, verificationToken);

    await sendEmail(verifyEmail);

    return newUser;
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

    if(!user.verify) {
        throw HttpError(401, "Email not verify");
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

export const verifyUser = async(verificationToken)=> {
    const user = await User.findOne({
        where: { verificationToken },
    });
    if(!user) {
        throw HttpError(400, "User not found");
    }

    return user.update({verificationToken: null, verify: true}, {
        returning: true,
    });
}

export const resendVerifyEmail = async(email)=> {
    const user = await User.findOne({
        where: {
            email
        }
    });
    if(!user) {
        throw HttpError(400, "User not found");
    }

    if(user.verify) {
        throw HttpError(400, "Verification has already been passed");
    }

    const verifyEmail = createVerifyEmail(email, user.verificationToken);

    return sendEmail(verifyEmail);
}
