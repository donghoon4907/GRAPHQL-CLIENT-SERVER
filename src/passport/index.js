const passport = require("passport");
const { Strategy, ExtractJwt } = require("passport-jwt");

const { prisma } = require("../../generated/prisma-client");

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // 헤더에서 jwt를 찾음
  secretOrKey: process.env.JWT_SECRET
};

const verifyUser = async (payload, done) => {
  try {
    const user = await prisma.user({ id: payload.id });
    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  } catch (error) {
    return done(error, false);
  }
};

exports.authenticateJwt = (req, res, next) =>
  passport.authenticate("jwt", { sessions: false }, (err, user) => {
    if (user) {
      req.user = user;
    }
    next();
  })(req, res, next);

passport.use(new Strategy(jwtOptions, verifyUser));
passport.initialize();
