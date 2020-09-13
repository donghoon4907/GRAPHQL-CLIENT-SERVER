"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var generateToken = require("../../module/token");

var _require = require("../../fragment/user"),
    USERS_FRAGMENT = _require.USERS_FRAGMENT,
    USER_FRAGMENT = _require.USER_FRAGMENT,
    MY_FRAGMENT = _require.MY_FRAGMENT;

module.exports = {
  Query: {
    /**
     * * 사용자 검색
     *
     * @query
     * @author frisk
     * @param {number?} args.skip 건너뛸 목록의 수
     * @param {number?} args.first 요청 목록의 수
     * @param {string?} args.orderBy 정렬
     * @returns User[]
     * @deprecated
     */
    users: function () {
      var _users = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(_, args, _ref) {
        var prisma, _args$skip, skip, _args$first, first, _args$orderBy, orderBy;

        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                prisma = _ref.prisma;
                _args$skip = args.skip, skip = _args$skip === void 0 ? 0 : _args$skip, _args$first = args.first, first = _args$first === void 0 ? 30 : _args$first, _args$orderBy = args.orderBy, orderBy = _args$orderBy === void 0 ? "createdAt_DESC" : _args$orderBy;
                return _context.abrupt("return", prisma.users({
                  first: first,
                  skip: skip,
                  orderBy: orderBy
                }).$fragment(USERS_FRAGMENT));

              case 3:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function users(_x, _x2, _x3) {
        return _users.apply(this, arguments);
      }

      return users;
    }(),

    /**
     * * 사용자 상세 조회
     *
     * @query
     * @author frisk
     * @param {string} args.id 사용자 ID
     * @returns User
     * @deprecated
     */
    user: function user(_, args, _ref2) {
      var prisma = _ref2.prisma;
      var id = args.id;
      return prisma.user({
        id: id
      }).$fragment(USER_FRAGMENT);
    },

    /**
     * * 본인 정보 조회
     *
     * @query
     * @author frisk
     * @returns User!
     */
    me: function me(_, __, _ref3) {
      var request = _ref3.request,
          isAuthenticated = _ref3.isAuthenticated,
          prisma = _ref3.prisma;

      /**
       * 인증 확인
       */
      isAuthenticated({
        request: request
      });
      var id = request.user.id;
      return prisma.user({
        id: id
      }).$fragment(MY_FRAGMENT);
    }
  },
  Mutation: {
    /**
     * * 회원가입
     *
     * @mutation
     * @author frisk
     * @param {string} args.email 이메일
     * @param {string} args.nickname 별칭
     * @param {string} file 업로드한 프로필 사진
     * @returns boolean
     */
    createUser: function () {
      var _createUser = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(_, args, _ref4) {
        var prisma, email, nickname, file, isExistEmail, isExistNickname;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                prisma = _ref4.prisma;
                email = args.email, nickname = args.nickname, file = args.file;
                /**
                 * 이메일 중복 확인
                 * @type {boolean}
                 */

                _context2.next = 4;
                return prisma.$exists.user({
                  email: email
                });

              case 4:
                isExistEmail = _context2.sent;

                if (!isExistEmail) {
                  _context2.next = 7;
                  break;
                }

                throw Error(JSON.stringify({
                  message: "이미 등록된 이메일입니다.",
                  status: 403
                }));

              case 7:
                _context2.next = 9;
                return prisma.$exists.user({
                  nickname: nickname
                });

              case 9:
                isExistNickname = _context2.sent;

                if (!isExistNickname) {
                  _context2.next = 12;
                  break;
                }

                throw Error(JSON.stringify({
                  message: "이미 존재하는 닉네임입니다.",
                  status: 403
                }));

              case 12:
                _context2.next = 14;
                return prisma.createUser({
                  email: email,
                  nickname: nickname,
                  avatar: {
                    create: {
                      url: file
                    }
                  }
                });

              case 14:
                return _context2.abrupt("return", true);

              case 15:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function createUser(_x4, _x5, _x6) {
        return _createUser.apply(this, arguments);
      }

      return createUser;
    }(),

    /**
     * * 내 정보 수정
     *
     * @mutation
     * @author frisk
     * @param {string?} args.nickname 별칭
     * @param {string?} args.file 업로드한 프로필 사진
     * @returns boolean
     */
    updateUser: function () {
      var _updateUser = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(_, args, _ref5) {
        var request, isAuthenticated, prisma, id, nickname, file, data, isExistNickname;
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                request = _ref5.request, isAuthenticated = _ref5.isAuthenticated, prisma = _ref5.prisma;

                /**
                 * 인증 확인
                 */
                isAuthenticated({
                  request: request
                });
                id = request.user.id;
                nickname = args.nickname, file = args.file;
                /**
                 * 수정할 데이터
                 */

                data = {};

                if (!nickname) {
                  _context3.next = 13;
                  break;
                }

                if (!(nickname !== findMe.nickname)) {
                  _context3.next = 13;
                  break;
                }

                _context3.next = 9;
                return prisma.$exist.user({
                  nickname: nickname
                });

              case 9:
                isExistNickname = _context3.sent;

                if (!isExistNickname) {
                  _context3.next = 12;
                  break;
                }

                throw Error(JSON.stringify({
                  message: "이미 존재하는 닉네임입니다.",
                  status: 403
                }));

              case 12:
                data["nickname"] = nickname;

              case 13:
                if (file) {
                  /**
                   * 수정을 원하는 프로필 사진이 현재 설정된 프로필 사진과 다른 경우
                   */
                  if (file !== findMe.avatar().url) {
                    data["avatar"] = {
                      create: {
                        url: file
                      }
                    };
                  }
                }
                /**
                 * 사용자 수정
                 */


                _context3.next = 16;
                return prisma.updateUser({
                  where: {
                    id: id
                  },
                  data: data
                });

              case 16:
                return _context3.abrupt("return", true);

              case 17:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      function updateUser(_x7, _x8, _x9) {
        return _updateUser.apply(this, arguments);
      }

      return updateUser;
    }(),

    /**
     * * 로그인
     *
     * @mutation
     * @author frisk
     * @param {string} args.email 이메일
     * @returns User
     */
    logIn: function () {
      var _logIn = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(_, args, _ref6) {
        var prisma, email, user, id, nickname, avatar, isMaster, token;
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                prisma = _ref6.prisma;
                email = args.email;
                /**
                 * 이메일로 사용자 조회
                 */

                _context4.next = 4;
                return prisma.user({
                  email: email
                }).$fragment(MY_FRAGMENT);

              case 4:
                user = _context4.sent;

                if (user) {
                  _context4.next = 7;
                  break;
                }

                throw Error(JSON.stringify({
                  message: "등록되지 않은 이메일입니다.",
                  status: 403
                }));

              case 7:
                id = user.id, nickname = user.nickname, avatar = user.avatar, isMaster = user.isMaster;
                /**
                 * 사용자 ID로 토큰 발급
                 */

                token = generateToken({
                  id: id
                });
                return _context4.abrupt("return", {
                  token: token,
                  id: id,
                  nickname: nickname,
                  email: email,
                  avatar: avatar,
                  isMaster: isMaster
                });

              case 10:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }));

      function logIn(_x10, _x11, _x12) {
        return _logIn.apply(this, arguments);
      }

      return logIn;
    }()
  }
};