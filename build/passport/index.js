"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var passport = require("passport");

var _require = require("passport-jwt"),
    Strategy = _require.Strategy,
    ExtractJwt = _require.ExtractJwt;

require("./module/env");

var _require2 = require("../../generated/prisma-client"),
    prisma = _require2.prisma;

var jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  // 헤더에서 jwt를 찾음
  secretOrKey: process.env.JWT_SECRET
};

var verifyUser = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(payload, done) {
    var user;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return prisma.user({
              id: payload.id
            });

          case 3:
            user = _context.sent;

            if (!user) {
              _context.next = 8;
              break;
            }

            return _context.abrupt("return", done(null, user));

          case 8:
            return _context.abrupt("return", done(null, false));

          case 9:
            _context.next = 14;
            break;

          case 11:
            _context.prev = 11;
            _context.t0 = _context["catch"](0);
            return _context.abrupt("return", done(_context.t0, false));

          case 14:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 11]]);
  }));

  return function verifyUser(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.authenticateJwt = function (req, res, next) {
  return passport.authenticate("jwt", {
    sessions: false
  }, function (err, user) {
    if (user) {
      req.user = user;
    }

    next();
  })(req, res, next);
};

passport.use(new Strategy(jwtOptions, verifyUser));
passport.initialize();