
export async function adminSignUpAuth(req,res,next){
    
    const secret = req.header("admin-secret");
    if(!secret){
        res.status(401).send("access denied. no secret provided.");
        res.body = "access denied. no secret provided.";
        return 
    }
    try {
        if (secret != process.env.adminSecret){
            res.status(401).send("access denied. wrong secret");
            res.body = "access denied. wrong secret";
            return 
        }
        next();
    } catch (error) {
        res.status(400).send("invalid token");
        res.body = "invalid token";
    }
}
