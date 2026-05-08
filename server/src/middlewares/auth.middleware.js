export function authMiddleware(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  const decoded = utils.verifyJWT(token);

  if (!decoded) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  req.user = decoded;

  next();
}
