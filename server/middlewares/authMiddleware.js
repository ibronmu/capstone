const jwt = require('jsonwebtoken');

const authMiddleware = (req,res,next)=>{
const authHeader = req.headers.authorizatin    

if(!authHeader || !authHeader.startsWith('Bearer ')){
    return res.status(401).json({msg:'no token provided'});

}

const token = authHeader.split(' ')[1];
 
try {
    const decoded = jwt.verify(token,process.env.JWT_SECRETE);
    req.user = decoded;
    next();
}catch(err){
  return res.status(401).json({ msg: 'Invalid token' });
}
}

module.exports = authMiddleware;