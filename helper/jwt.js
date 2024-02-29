require('dotenv/config')
const jwt = require('jsonwebtoken');
async function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);
    try {
        const decodedToken = await jwt.verify(token, process.env.JWT_TOKEN);
        req.userId = decodedToken.userId; 
        req.isAdmin = decodedToken.isAdmin; 
        next();
    } catch (err) {
        return res.sendStatus(403);
    }
}
module.exports = authenticateToken;
