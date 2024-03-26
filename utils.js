const  {v4: uuid4} = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

require('dotenv').config();
const SALTROUNDS = Number(process.env.SALTROUNDS);



// generate a uuid
const generateId = () => {
    const newId = uuid4();

    return newId;
}

//hash password
const hashPassword = async (password) => {
    const salt = bcrypt.genSaltSync(SALTROUNDS);
    const hash = bcrypt.hashSync(password,salt)
    return hash;
}

//compare password

const isValidPassword = async (password,secretPassword) => {
    return bcrypt.compareSync(password, secretPassword);
}


//geneate token
const genToken = (payload) => {
    const secret = process.env.JWT_SECRET
    return jwt.sign(payload,secret,{expiresIn: '1h'})
}

const verifyToken = (req,res,next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(401).json('Unauthorized')
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json('Invalid token')
    }
}


module.exports = {
    generateId,
    hashPassword,
    isValidPassword,
    genToken,
}