const jwt = require("jsonwebtoken");
const Admin = require("../models/admin");

module.exports = async (req, res, next) => {
  const token = req.header("Auth-Token");
  if (!token) return res.status(400).send("Access Denied");
  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    if (verified) {
      // eslint-disable-next-line no-underscore-dangle
      const user = await Admin.findById(verified._id);
      const reset = new Date(user.reset).getTime() / 1000;
      if (verified.iat >= reset) {
        req.user = verified;
        return next();
      }
    }
    return res.send({
      success: false,
      message: "Bad token",
    });
  } catch (err) {
    return res.send({
      success: false,
      message: "DB Error",
    });
  }
};
