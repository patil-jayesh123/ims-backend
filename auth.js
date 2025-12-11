const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({ message: "Access Denied! No Token Provided" });
  }

  try {
    const decoded = jwt.verify(token.split(" ")[1], "jayu");
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(400).json({ message: "Invalid Token" });
  }
};
