import * as authServices from "../services/authServices.js";

export const register = async(req, res)=> {
    const user = await authServices.registerUser(req.body);

    res.status(201).json({
        user: {
            email: user.email,
            subscription: user.subscription,
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
        },
    })
}

export const getCurrent = async(req, res)=> {
    const {email, subscription} = req.user;

    res.json({
        email,
        subscription,
    })
}

export const logout = async(req, res)=> {
    const {id} = req.user;
    await authServices.logoutUser(id);

    res.status(204).send();
}