//Import and check if the token is valid or not 
const validate =(token: string) => {
    if(!token?.trim()){
        return false;
    }
    return true;
}


//checking if the user is authenticated or not
export const authMiddleware = (request: Request) => {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return false;
    }
    const token = authHeader.split(" ")[1];
    return validate(token);
}