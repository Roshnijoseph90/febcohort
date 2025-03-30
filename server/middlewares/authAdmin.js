import jwt from 'jsonwebtoken';
export const authAdmin = (req,res,next)=>{
    try{
        //collect token fron cookies
        const {token} = req.cookies;
        if(!token){
            return res.status(401).json({message:"admin not authorized"})
        }
         //decode token
        const  decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        console.log(decodedToken,"=====decoded token")
        if(!decodedToken){
            return res.status(401).json({message:"admin  not authorized"})
        }
        if(decodedToken.role!=="admin"){
            return res.status(401).json({message:"admin  not authorized"})
        }
        req.admin = decodedToken;
       
     next()

       }catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message || 'Internal server error' });
        console.log(error);
      }
}