import jwt from "jsonwebtoken";
const auth = (req, res, next) => {
    const authHeader = req.header("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
        return res
            .status(401)
            .json({ message: "Access denied. No token provided." });
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.auth = { user: decoded };
        next();
    }
    catch (err) {
        console.log(err);
        res.status(401).json({ message: "Invalid or expired token." });
    }
};
export default auth;
