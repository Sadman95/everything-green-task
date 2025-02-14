import config from "config";
import jwt from "jsonwebtoken";

const JWT_SECRET = config.jwt_secret ?? "your-secret-key";

export const signJWT = (payload: object) => {
	return jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
};

export const verifyJWT = (token: string) => {
	try {
		return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        console.log(error);
		return null;
	}
};
