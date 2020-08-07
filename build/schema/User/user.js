"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var bcrypt = require("bcrypt");

var generateToken = require("../../module/token");

var _require = require("../../fragment/user"),
    USER_FRAGMENT = _require.USER_FRAGMENT,
    MESSAGEROOM_FRAGMENT = _require.MESSAGEROOM_FRAGMENT,
    MESSAGE_FRAGMENT = _require.MESSAGE_FRAGMENT;

module.exports = {
  Query: {
    // 사용자 검색
    getUsers: function () {
      var _getUsers = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(_, args, _ref) {
        var prisma, _args$skip, skip, _args$first, first, _args$orderBy, orderBy, nickname, orFilter, where;

        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                prisma = _ref.prisma;
                _args$skip = args.skip, skip = _args$skip === void 0 ? 0 : _args$skip, _args$first = args.first, first = _args$first === void 0 ? 30 : _args$first, _args$orderBy = args.orderBy, orderBy = _args$orderBy === void 0 ? "nickname_ASC" : _args$orderBy, nickname = args.nickname;
                orFilter = [];

                if (nickname) {
                  orFilter.push({
                    nickname_contains: nickname
                  });
                }

                where = orFilter.length > 0 ? {
                  OR: orFilter
                } : {};
                return _context.abrupt("return", prisma.users({
                  first: first,
                  skip: skip,
                  where: where,
                  orderBy: orderBy
                }).$fragment(USER_FRAGMENT));

              case 6:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function getUsers(_x, _x2, _x3) {
        return _getUsers.apply(this, arguments);
      }

      return getUsers;
    }(),
    // 사용자 정보
    getUser: function getUser(_, args, _ref2) {
      var prisma = _ref2.prisma;
      var userId = args.userId;
      return prisma.user({
        id: userId
      }).$fragment(USER_FRAGMENT);
    },
    // 내정보
    getMyProfile: function getMyProfile(_, __, _ref3) {
      var request = _ref3.request,
          isAuthenticated = _ref3.isAuthenticated,
          prisma = _ref3.prisma;
      isAuthenticated({
        request: request
      });
      var id = request.user.id;
      return prisma.user({
        id: id
      }).$fragment(USER_FRAGMENT);
    },
    // 메시지방 검색
    getMessageRooms: function getMessageRooms(_, args, _ref4) {
      var request = _ref4.request,
          isAuthenticated = _ref4.isAuthenticated,
          prisma = _ref4.prisma;
      isAuthenticated({
        request: request
      });
      var skip = args.skip,
          first = args.first;
      var id = request.user.id;
      return prisma.messageRooms({
        where: {
          participants_some: {
            id: id
          }
        },
        skip: skip,
        first: first,
        orderBy: "updatedAt_DESC"
      }).$fragment(MESSAGEROOM_FRAGMENT);
    },
    // 메시지방 상세 조회
    getMessageRoom: function () {
      var _getMessageRoom = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(_, _ref5, _ref6) {
        var roomId, request, isAuthenticated, prisma, id, isExistRoom;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                roomId = _ref5.roomId;
                request = _ref6.request, isAuthenticated = _ref6.isAuthenticated, prisma = _ref6.prisma;
                isAuthenticated({
                  request: request
                });
                id = request.user.id;
                _context2.next = 6;
                return prisma.messageRooms({
                  where: {
                    id: roomId,
                    participants_some: {
                      id: id
                    }
                  }
                });

              case 6:
                isExistRoom = _context2.sent;

                if (isExistRoom) {
                  _context2.next = 9;
                  break;
                }

                throw Error("접근 권한이 없습니다.");

              case 9:
                return _context2.abrupt("return", prisma.messageRoom({
                  id: roomId
                }).$fragment(MESSAGEROOM_FRAGMENT));

              case 10:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function getMessageRoom(_x4, _x5, _x6) {
        return _getMessageRoom.apply(this, arguments);
      }

      return getMessageRoom;
    }()
  },
  Mutation: {
    // 사용자 추가
    addUser: function () {
      var _addUser = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(_, args, _ref7) {
        var prisma, email, pwd, nickname, file, isExistEmail, isExistNickname, hashedPassword;
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                prisma = _ref7.prisma;
                email = args.email, pwd = args.pwd, nickname = args.nickname, file = args.file;
                _context3.next = 4;
                return prisma.$exists.user({
                  email: email
                });

              case 4:
                isExistEmail = _context3.sent;

                if (!isExistEmail) {
                  _context3.next = 7;
                  break;
                }

                throw Error("이미 등록된 이메일입니다.");

              case 7:
                _context3.next = 9;
                return prisma.$exists.user({
                  nickname: nickname
                });

              case 9:
                isExistNickname = _context3.sent;

                if (!isExistNickname) {
                  _context3.next = 12;
                  break;
                }

                throw Error("이미 존재하는 별명입니다.");

              case 12:
                _context3.next = 14;
                return bcrypt.hash(pwd, 12);

              case 14:
                hashedPassword = _context3.sent;
                _context3.next = 17;
                return prisma.createUser({
                  email: email,
                  pwd: hashedPassword,
                  nickname: nickname,
                  avatar: {
                    create: {
                      url: file
                    }
                  }
                });

              case 17:
                return _context3.abrupt("return", true);

              case 18:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      function addUser(_x7, _x8, _x9) {
        return _addUser.apply(this, arguments);
      }

      return addUser;
    }(),
    // 사용자 정보 수정
    updateUser: function () {
      var _updateUser = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(_, args, _ref8) {
        var request, isAuthenticated, prisma, nickname, file, id, isExistUser, updatedUser, filterOptions, isExistFile;
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                request = _ref8.request, isAuthenticated = _ref8.isAuthenticated, prisma = _ref8.prisma;
                isAuthenticated({
                  request: request
                });
                nickname = args.nickname, file = args.file;
                id = request.user.id;
                _context4.next = 6;
                return prisma.$exists.user({
                  id: id
                });

              case 6:
                isExistUser = _context4.sent;

                if (!isExistUser) {
                  _context4.next = 24;
                  break;
                }

                _context4.next = 10;
                return prisma.updateUser({
                  where: {
                    id: id
                  },
                  data: {
                    nickname: nickname
                  }
                });

              case 10:
                updatedUser = _context4.sent;

                if (!file) {
                  _context4.next = 21;
                  break;
                }

                filterOptions = {
                  user: {
                    id: id
                  }
                };
                _context4.next = 15;
                return prisma.$exists.file(filterOptions);

              case 15:
                isExistFile = _context4.sent;

                if (!isExistFile) {
                  _context4.next = 19;
                  break;
                }

                _context4.next = 19;
                return prisma.deleteManyFiles(filterOptions);

              case 19:
                _context4.next = 21;
                return prisma.createFile({
                  url: file,
                  user: {
                    connect: {
                      id: id
                    }
                  }
                });

              case 21:
                return _context4.abrupt("return", updatedUser);

              case 24:
                throw Error("존재하지 않는 사용자입니다.");

              case 25:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }));

      function updateUser(_x10, _x11, _x12) {
        return _updateUser.apply(this, arguments);
      }

      return updateUser;
    }(),
    // 로그인 요청
    logIn: function () {
      var _logIn = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(_, args, _ref9) {
        var prisma, email, pwd, user, isCheckPwd;
        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                prisma = _ref9.prisma;
                email = args.email, pwd = args.pwd;
                _context5.next = 4;
                return prisma.user({
                  email: email
                });

              case 4:
                user = _context5.sent;

                if (!user) {
                  _context5.next = 16;
                  break;
                }

                _context5.next = 8;
                return bcrypt.compare(pwd, user.pwd);

              case 8:
                isCheckPwd = _context5.sent;

                if (!isCheckPwd) {
                  _context5.next = 13;
                  break;
                }

                return _context5.abrupt("return", generateToken({
                  id: user.id
                }));

              case 13:
                throw Error("비밀번호를 확인하세요.");

              case 14:
                _context5.next = 17;
                break;

              case 16:
                throw Error("존재하지 않는 이메일입니다.");

              case 17:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5);
      }));

      function logIn(_x13, _x14, _x15) {
        return _logIn.apply(this, arguments);
      }

      return logIn;
    }(),
    // 팔로우
    follow: function () {
      var _follow = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(_, args, _ref10) {
        var request, isAuthenticated, prisma, userId, id;
        return _regenerator["default"].wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                request = _ref10.request, isAuthenticated = _ref10.isAuthenticated, prisma = _ref10.prisma;
                isAuthenticated({
                  request: request
                });
                userId = args.userId;
                id = request.user.id;
                _context6.prev = 4;
                _context6.next = 7;
                return prisma.updateUser({
                  where: {
                    id: id
                  },
                  data: {
                    following: {
                      connect: {
                        id: userId
                      }
                    }
                  }
                });

              case 7:
                return _context6.abrupt("return", true);

              case 10:
                _context6.prev = 10;
                _context6.t0 = _context6["catch"](4);
                return _context6.abrupt("return", false);

              case 13:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, null, [[4, 10]]);
      }));

      function follow(_x16, _x17, _x18) {
        return _follow.apply(this, arguments);
      }

      return follow;
    }(),
    // 언팔로우
    unfollow: function () {
      var _unfollow = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(_, args, _ref11) {
        var request, isAuthenticated, prisma, userId, id;
        return _regenerator["default"].wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                request = _ref11.request, isAuthenticated = _ref11.isAuthenticated, prisma = _ref11.prisma;
                isAuthenticated({
                  request: request
                });
                userId = args.userId;
                id = request.user.id;
                _context7.prev = 4;
                _context7.next = 7;
                return prisma.updateUser({
                  where: {
                    id: id
                  },
                  data: {
                    following: {
                      disconnect: {
                        id: userId
                      }
                    }
                  }
                });

              case 7:
                return _context7.abrupt("return", true);

              case 10:
                _context7.prev = 10;
                _context7.t0 = _context7["catch"](4);
                return _context7.abrupt("return", false);

              case 13:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, null, [[4, 10]]);
      }));

      function unfollow(_x19, _x20, _x21) {
        return _unfollow.apply(this, arguments);
      }

      return unfollow;
    }(),
    // 메세지 전송
    addMessage: function () {
      var _addMessage = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(_, args, _ref12) {
        var request, isAuthenticated, prisma, id, content, roomId, to, param, room;
        return _regenerator["default"].wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                request = _ref12.request, isAuthenticated = _ref12.isAuthenticated, prisma = _ref12.prisma;
                isAuthenticated({
                  request: request
                });
                id = request.user.id;
                content = args.content, roomId = args.roomId, to = args.to; // 메세지 생성 데이터

                param = {
                  content: content,
                  from: {
                    connect: {
                      id: id
                    }
                  }
                }; // 방 메세지 전송 시

                if (!roomId) {
                  _context8.next = 12;
                  break;
                }

                param["room"] = {
                  connect: {
                    id: roomId
                  }
                };
                _context8.next = 9;
                return prisma.messageRoom({
                  id: roomId
                });

              case 9:
                room = _context8.sent;
                _context8.next = 17;
                break;

              case 12:
                if (!(id !== to)) {
                  _context8.next = 17;
                  break;
                }

                param["to"] = {
                  connect: {
                    id: to
                  }
                };
                _context8.next = 16;
                return prisma.createMessageRoom({
                  participants: {
                    connect: {
                      id: [id, to]
                    }
                  }
                });

              case 16:
                room = _context8.sent;

              case 17:
                if (room) {
                  _context8.next = 19;
                  break;
                }

                throw Error("잘못된 접근입니다.");

              case 19:
                _context8.next = 21;
                return prisma.createMessage(param);

              case 21:
                return _context8.abrupt("return", true);

              case 22:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8);
      }));

      function addMessage(_x22, _x23, _x24) {
        return _addMessage.apply(this, arguments);
      }

      return addMessage;
    }(),
    // 알림 읽기
    readAlert: function () {
      var _readAlert = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9(_, args, _ref13) {
        var request, isAuthenticated, prisma, id, alertId, isExistAlert;
        return _regenerator["default"].wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                request = _ref13.request, isAuthenticated = _ref13.isAuthenticated, prisma = _ref13.prisma;
                isAuthenticated({
                  request: request
                });
                id = request.user.id;
                alertId = args.alertId;
                _context9.next = 6;
                return prisma.$exists.alert({
                  id: alertId,
                  user: {
                    id: id
                  }
                });

              case 6:
                isExistAlert = _context9.sent;

                if (!isExistAlert) {
                  _context9.next = 13;
                  break;
                }

                _context9.next = 10;
                return prisma.deleteAlert({
                  where: {
                    id: alertId
                  }
                });

              case 10:
                return _context9.abrupt("return", true);

              case 13:
                return _context9.abrupt("return", false);

              case 14:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9);
      }));

      function readAlert(_x25, _x26, _x27) {
        return _readAlert.apply(this, arguments);
      }

      return readAlert;
    }()
  },
  Subscription: {
    // 메세지 갱신
    syncMessage: {
      subscribe: function subscribe(_, args, _ref14) {
        var prisma = _ref14.prisma;
        var roomId = args.roomId;
        return prisma.$subscribe.message({
          AND: [{
            mutation_in: "CREATED"
          }, {
            node: {
              room: {
                id: roomId
              }
            }
          }]
        }).node();
      },
      resolve: function resolve(_ref15, _, _ref16) {
        var id = _ref15.id;
        var prisma = _ref16.prisma;
        return prisma.message({
          id: id
        }).$fragment(MESSAGE_FRAGMENT);
      }
    }
  },
  // computed
  User: {
    // 내가 팔로우 중인 사용자인지 여부
    isFollowing: function isFollowing(parent, _, _ref17) {
      var request = _ref17.request,
          prisma = _ref17.prisma;
      var id = request.user.id;
      var parentId = parent.id;

      try {
        return prisma.$exists.user({
          AND: [{
            id: parentId
          }, {
            followedBy_some: {
              id: id
            }
          }]
        });
      } catch (_unused3) {
        return false;
      }
    },
    // 내정보인지 여부
    isMe: function isMe(parent, _, _ref18) {
      var request = _ref18.request;
      var id = request.user.id;
      var parentId = parent.id;
      return id === parentId;
    }
  },
  MessageRoom: {
    // 최근 내 메세지
    recentMyMessage: function () {
      var _recentMyMessage = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10(parent, _, _ref19) {
        var request, prisma, id, parentId, filterOptions, isExistMessage;
        return _regenerator["default"].wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                request = _ref19.request, prisma = _ref19.prisma;
                id = request.user.id;
                parentId = parent.id;
                filterOptions = {
                  AND: [{
                    room: {
                      id: parentId
                    }
                  }, {
                    from: {
                      id: id
                    }
                  }]
                };
                _context10.next = 6;
                return prisma.$exist.message(filterOptions);

              case 6:
                isExistMessage = _context10.sent;

                if (!isExistMessage) {
                  _context10.next = 11;
                  break;
                }

                return _context10.abrupt("return", prisma.messages({
                  where: filterOptions,
                  first: 1,
                  orderBy: "updatedAt_DESC"
                }));

              case 11:
                return _context10.abrupt("return", null);

              case 12:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10);
      }));

      function recentMyMessage(_x28, _x29, _x30) {
        return _recentMyMessage.apply(this, arguments);
      }

      return recentMyMessage;
    }()
  }
};