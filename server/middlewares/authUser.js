import jwt from 'jsonwebtoken';
export const authUser = (req,res,next)=>{
    try{
        //collect token fron cookies
        const {token} = req.cookies;
        console.log('Token in cookies:', token);  
        if(!token){
            return res.status(401).json({message:"user not authorized"})
        }
       
         //decode token
        const  decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        console.log(decodedToken,"=====decoded token")
        
        if(!decodedToken){
            return res.status(401).json({message:"user not authorized"})
        }
        req.user = decodedToken;
       
     next()

    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
          return res.status(401).json({ message: "Invalid token" });
        } else if (error instanceof jwt.TokenExpiredError) {
          return res.status(401).json({ message: "Token expired" });
        } else if (error instanceof jwt.NotBeforeError) {
          return res.status(401).json({ message: "Token not active yet" });
        }
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
      }
       

    /*}catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message || 'Internal server error' });
        console.log(error);
      }*/
}