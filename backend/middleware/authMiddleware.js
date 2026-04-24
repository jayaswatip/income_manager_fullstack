const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {

    let token;

    if (req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer"))
    {

        try {

            token = req.headers.authorization.split(" ")[1];

            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET
            );

            req.user = decoded.id;

            next();

        }
        catch (error)
        {
            res.status(401).json("Not authorized");
        }
    }
    else
    {
        res.status(401).json("No token provided");
    }
};

module.exports = protect;