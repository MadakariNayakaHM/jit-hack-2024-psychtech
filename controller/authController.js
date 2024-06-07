const User = require("./../models/userModel");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};
const createSendToken = (user, statusCode, res) => {
    console.log(user._id);
    const token = signToken(user._id);
    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    };
    res.cookie('jwt', token, cookieOptions);
    console.log(res.cookie);

    user.password = undefined;
    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    });
};
exports.signup = async (req, res, next) => {
    console.log(req.body.name, req.body.email, req.body.password, req.body.confirmPassword, req.body.phone);
    try {
        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            confirmPassword: req.body.confirmPassword,
            phone: req.body.phone
        })
        createSendToken(newUser, 201, res);
    }
    catch (err) {
        console.log(err.message);
        res.status(404).json({
            status: "Failed",
            data: {
                error: err
            }
        })
    }
};
exports.login = async (req, res, next) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        if (!email || !password) {

            return res.status(404).json({
                status: "Failed",
            })
        }
        const user = await User.findOne({ email: email }).select("password");
        if (!user || !(await user.correctPassword(password, user.password))) {
            return res.status(404).json({
                status: "Failed",
                message: "Incorrect Email or password"
            })
        }
        createSendToken(user, 200, res);
    
    }
    catch (err) {
        res.status(404).json({
            status: "Failed",
            data: {
                error: err
            }
        })
    }
}
  
exports.protect = async (req, res, next) => {
    try {
        let token;
        if (req.cookies.jwt) {
            token = req.cookies.jwt;
            const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
            const currentuser = await User.findById(decoded.id);
            if (!currentuser) {
                return res.status(404).json({
                    status: "Failed",
                    data: {
                        message: "this token doesnt exist"
                    }
                })
            }
            // if (currentuser.ChangedPasswordAfter(decoded.iat)) {
            //     return res.status(401).json({
            //         status: "Failed",
            //         data: {
            //             message: "recently changed password"
            //         }
            //     })
            // }
            req.user = currentuser;

            res.locals.user = currentuser;
            next();
        }
        else {
            return res.status(401).json({
                status: "Failed",
                data: {
                    message: "not authorized"
                }
            })
        }
    } catch (err) {
        return res.status(401).json({
            status: "Failed",
            data: {
                message: err
            }
        })
    }
}
exports.isLoggedIn = async (req, res, next) => {
    if (req.cookies.jwt) {
        try {
            const decoded = await promisify(jwt.verify)(
                req.cookies.jwt,
                process.env.JWT_SECRET
            );
            const currentUser = await User.findById(decoded.id);
            if (!currentUser) {
                return next();
            }
            res.locals.user = currentUser;
            return next();
        } catch (err) {
            return next();
        }
    }
    next();
};
exports.restrictTo = (...roles) => {

    return (req, res, next) => {

        if (!roles.includes(req.user.role)) {
            return res.status(401).json({
                status: "Failed",
                data: {
                    message: "not authorized"
                }
            })

        }
        next();

    }
}
exports.logout = (req, res) => {
    res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });
    res.status(200).json({ status: 'success' });
};