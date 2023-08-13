const sendJwtToClient = (user, res) => {
  const accessToken = user.generateAccessToken();

  const { JWT_COOKIE, NODE_ENV } = process.env;

  return res
    .status(200)
    .cookie("accessToken", accessToken, {
      httpOnly: true,
      expires: new Date(Date.now() + parseInt(JWT_COOKIE) * 1000 * 60),
      secure: NODE_ENV === "development" ? false : true,
    })
    .json({
      success: true,
      accessToken: accessToken,
      data: {
        name: user.name,
        email: user.email,
      },
    });
};

const isTokenIncluded = (req) => {
  return (
    req.headers.authorization && req.headers.authorization.startsWith("Bearer:")
  );
};

const getAccessTokenFromHeader = (req) => {
  const authorization = req.headers.authorization;
  const accessToken = authorization.split(" ")[1];
  return accessToken;
};

module.exports = {
  sendJwtToClient,
  isTokenIncluded,
  getAccessTokenFromHeader,
};
