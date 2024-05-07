// Authroization middleware. It is used to check if API calls have a valid authorization token. This is to protect API endpoints against unauthorized calls.

// import Node.js module for verifying JWTs (JSON Web Tokens)
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // Read the header of API calls called "Authorization", then split the token from that header
  const token =
    req.header('Authorization') && req.header('Authorization').split(' ')[1];

  // if there is no "Authorization" header, or no token in that header, then authorization is denied and no API call is made
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  // if there is an "Authorization" header and the token is valid, then the token will be verified and decoded to contain the user's information, such as their username and role. The API call will then proceed.
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
    // if the token is not valid, then the API call will not be made.
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};
