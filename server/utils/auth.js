const jwt = require('jsonwebtoken');

const secret = process.env.SECRET_KEY;
const expiration = '2h';

const authMiddleware = (req, res, next) => {
  let token = req.body.token || req.query.token || req.headers.authorization;
  console.log('token: ' + token);

  if (req.headers.authorization) {
    token = token.split(' ').pop().trim();
  }

  if (!token) {
    res.status(400).json({ message: 'Bearer Token not supplied or invalid' });
    return;
  }

  try {
    const { data } = jwt.verify(token, secret, { maxAge: expiration });
    req.user = data;
    next();
  } catch (err) {
    console.log('Invalid token');
    res.status(400).json({ message: 'Invalid token: ' + err.message });
  }

  return req;
};

const signToken = (user) => {
  const payload = {
    id: user.id,
    username: user.username,
    email: user.email,
    password: user.password,
  };
  return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
};

module.exports = { authMiddleware, signToken };
