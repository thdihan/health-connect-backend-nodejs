import jwt, { JwtPayload, Secret, SignOptions } from "jsonwebtoken";

const generateToken = (
    payload: string | object | Buffer,
    secret: string,
    expiresIn: string
) => {
    const options: SignOptions = {
        algorithm: "HS256",
        expiresIn: expiresIn as SignOptions["expiresIn"],
    };
    const token = jwt.sign(payload, secret, options);
    return token;
};

const verifyToken = (token: string, secret: Secret) => {
    let decodedData;
    try {
        decodedData = jwt.verify(token, secret) as JwtPayload;
    } catch (error) {
        throw new Error("Unauthorized");
    }

    return decodedData;
};

export const JwtHelper = {
    generateToken,
    verifyToken,
};
