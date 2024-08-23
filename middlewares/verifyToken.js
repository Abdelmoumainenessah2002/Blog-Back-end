const jwt = require('jsonwebtoken');

// This function is used to verify the token which is send by the client
function verifyToken(req, res, next) {
    const authToken = req.headers.authorization;
    if (authToken) {
        const token = authToken.split(" ")[1];
        try {
            const decodedPayload = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decodedPayload;
            next();
        } catch (error) {
            res.status(401).json({ message: "Invalid token, access denied" });
        }
    }
    else {
        res.status(401).json({ message: "No token provided, access denied" });
    }  
}

// verify token & admin
function verifyTokenAndAdmin(req, res, next) {
    verifyToken(req, res, () => {
        if (!req.user.isAdmin) {
            return res.status(403).json({ message: "You are not authorized to access this route, only admins" });
        }
        next();
    }
    );
}

// verify token & users himself
function verifyTokenAnd1OnlyUser(req, res, next) {
    verifyToken(req, res, () => {
        if (req.user._id !== req.params.id) {
            return res.status(403).json({ message: "You are not authorized to access this route, only user himself" });
        }
        next();  
    }
    );
}

module.exports = { verifyToken, verifyTokenAndAdmin, verifyTokenAnd1OnlyUser };