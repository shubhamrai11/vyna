const checkAllowedKeys = (allowedKeys) => (req, res, next) => {
  const unexpectedKeys = Object.keys(req.body).filter(key => !allowedKeys.includes(key));
  if (unexpectedKeys.length > 0) {
    return res.status(400).json({ status: false, message: `Unexpected keys in request body: ${unexpectedKeys.join(', ')}` });
  }
  next();
};

module.exports = checkAllowedKeys;