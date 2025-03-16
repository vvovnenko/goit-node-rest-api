import * as authServices from "../services/authServices.js";
import path from "node:path";
import fs from "node:fs/promises";

const avatarsPublicPath = 'avatars';
const avatarsPath = path.join(process.cwd(), 'public', avatarsPublicPath);

export const register = async(req, res)=> {
    const user = await authServices.registerUser(req.body);

    res.status(201).json({
        user: {
            email: user.email,
            subscription: user.subscription,
            avatarURL: user.avatarURL,
        },
    });
}

export const login = async(req, res)=> {
    const user = await authServices.loginUser(req.body);

    res.json({
        token: user.token,
        user: {
            email: user.email,
            subscription: user.subscription,
            avatarURL: user.avatarURL,
        },
    })
}

export const getCurrent = async(req, res)=> {
    const {email, subscription, avatarURL} = req.user;

    res.json({
        email,
        subscription,
        avatarURL,
    })
}

export const logout = async(req, res)=> {
    const {id} = req.user;
    await authServices.logoutUser(id);

    res.status(204).send();
}

export const updateAvatar = async(req, res) => {
    const { id: userId } = req.user;
    let avatarURL = null;
    if(req.file) {
        const { path: oldPath, filename } = req.file;
        const ext = path.extname(filename);
        const newFilename = `${userId}${ext}`;
        const newPath = path.join(avatarsPath, newFilename);
        await fs.rename(oldPath, newPath);
        avatarURL = path.join('/', avatarsPublicPath, newFilename);
    }

    const user = await authServices.updateUser(userId, { avatarURL });

    res.json({
        avatarURL: user.avatarURL,
    })
}

export const verify = async(req, res)=> {
    const {verificationToken} = req.params;
    await authServices.verifyUser(verificationToken);

    res.json({
        message: "Verification successful"
    })
}

export const resendVerify = async(req, res)=> {
    const {email} = req.body;
    await authServices.resendVerifyEmail(email);

    res.json({
        message: "Verify email send successfully"
    })
}
