import jwt from 'jsonwebtoken';

export const authOwner = (req, res, next) => {
    try {
        // Collect token from cookies
        const { token } = req.cookies;

        // If no token is found
        if (!token) {
            return res.status(401).json({ message: "Owner not authorized, token missing" });
        }

        // Decode token and verify it
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        console.log(decodedToken, "===== Decoded token");
        console.log(decodedToken);  // To log the decoded token and check the role

        // If token is invalid or expired
        if (!decodedToken) {
            return res.status(401).json({ message: "Owner not authorized, invalid token" });
        }
        console.log('Decoded Role:', decodedToken.role);
        // Check if role is either "owner" or "admin"
        if (decodedToken.role !== "owner" && decodedToken.role !== "admin") {
            return res.status(401).json({ message: "Owner not authorized, insufficient role" });
        }

        // Assign decoded token to req.owner for further use
        req.owner = decodedToken;

        // Proceed to the next middleware or controller
        next();

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message || 'Internal server error' });
    }
};

