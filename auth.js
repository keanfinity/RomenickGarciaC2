const jwt = require("jsonwebtoken");

const key = "E-CommerceAPI-Garcia";

module.exports.createAccessToken = (user) => {
    console.log(user)
    const data = {
        id: user.id,
        email: user.email,
        isAdmin: user.isAdmin
    }

    return jwt.sign(data, key, {});

}

module.exports.verify = (req, res, next) => {
    let token = req.headers.authorization;

    //if (token !== undefined) 
    if (typeof token !== "undefined") {
        token = token.slice(7, token.length);
        console.log(token);

        return jwt.verify(token, key, (err, data) => {
            if (err) {
                return res.send({ auth: "ERROR: INVALID TOKEN!" });
            } else {
                next();
            }
        });

    } else {
        res.send({ message: "ERROR: NO TOKEN DETECTED!" });
    }

    console.log(token);
}

module.exports.decode = (token) => {
    if (token !== undefined) {
        token = token.slice(7, token.length);

        return jwt.verify(token, key, (err, data) => {
            if (err) {
                return null;
            } else {
                return jwt.decode(token, { complete: true }).payload;
            }
        });
    }
}