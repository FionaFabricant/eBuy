import jwt from 'jsonwebtoken';
export const generateToken=(user)=>{
    return jwt.sign(
        {
            _id:user._id,
            name:user.name,
            email:user.email,
            isAdmin:user.isAdmin,
        },
        process.env.JWT_SECRET,{
        expiresIn:'30d',
    })
};

export const isAuth=(req,res,next)=>{
    const authorization=req.headers.authorization;
    if(authorization){
        const token=authorization.slice(7,authorization.length);  
        //Bearer xxxxx
        //Authorization 字段的值通常是 "Bearer <token>" 的形式。
        //slice(7) 即从第 7 个字符开始提取字符串，从而剥离掉 "Bearer " 前缀，得到真正的 token
    
        jwt.verify(
            token,
            process.env.JWT_SECRET,
            (err,decode)=>{
                if(err){
                    res.status(401).send({message:'Invalid Token'});
                }else{
                    req.user=decode;
                    next();
                }
            }
        )
    }else{
        res.status(401).send({message:'No Token Provided'});
    }
}

export const isAdmin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
      next();
    } else {
      res.status(401).send({ message: 'Invalid Admin Token' });
    }
  };