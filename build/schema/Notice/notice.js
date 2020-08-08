"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _require = require("../../fragment/notice"),
    NOTICE_FRAGMENT = _require.NOTICE_FRAGMENT;

module.exports = {
  Query: {
    // 공지 검색
    getNotices: function () {
      var _getNotices = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(_, args, _ref) {
        var prisma, _args$skip, skip, _args$first, first, _args$orderBy, orderBy;

        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                prisma = _ref.prisma;
                _args$skip = args.skip, skip = _args$skip === void 0 ? 0 : _args$skip, _args$first = args.first, first = _args$first === void 0 ? 30 : _args$first, _args$orderBy = args.orderBy, orderBy = _args$orderBy === void 0 ? "createdAt_DESC" : _args$orderBy;
                return _context.abrupt("return", prisma.notices({
                  first: first,
                  skip: skip,
                  orderBy: orderBy
                }).$fragment(NOTICE_FRAGMENT));

              case 3:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function getNotices(_x, _x2, _x3) {
        return _getNotices.apply(this, arguments);
      }

      return getNotices;
    }(),
    // 공지 상세 정보
    getNotice: function getNotice(_, args, _ref2) {
      var prisma = _ref2.prisma;
      var noticeId = args.noticeId;
      return prisma.notice({
        id: noticeId
      });
    }
  },
  Mutation: {
    // 공지 추가
    addNotice: function () {
      var _addNotice = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(_, args, _ref3) {
        var request, isAuthenticated, prisma, title, description;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                request = _ref3.request, isAuthenticated = _ref3.isAuthenticated, prisma = _ref3.prisma;
                isAuthenticated({
                  request: request
                });
                title = args.title, description = args.description;
                _context2.next = 5;
                return prisma.createNotice({
                  title: title,
                  description: description
                });

              case 5:
                return _context2.abrupt("return", true);

              case 6:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function addNotice(_x4, _x5, _x6) {
        return _addNotice.apply(this, arguments);
      }

      return addNotice;
    }(),
    // 공지 수정
    updateNotice: function () {
      var _updateNotice = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(_, args, _ref4) {
        var request, isAuthenticated, prisma, noticeId, title, description, isExistNotice;
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                request = _ref4.request, isAuthenticated = _ref4.isAuthenticated, prisma = _ref4.prisma;
                isAuthenticated({
                  request: request
                });
                noticeId = args.noticeId, title = args.title, description = args.description;
                _context3.next = 5;
                return prisma.$exists.notice({
                  id: noticeId
                });

              case 5:
                isExistNotice = _context3.sent;

                if (!isExistNotice) {
                  _context3.next = 12;
                  break;
                }

                _context3.next = 9;
                return prisma.updateNotice({
                  where: {
                    id: noticeId
                  },
                  data: {
                    title: title,
                    description: description
                  }
                });

              case 9:
                return _context3.abrupt("return", true);

              case 12:
                return _context3.abrupt("return", false);

              case 13:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      function updateNotice(_x7, _x8, _x9) {
        return _updateNotice.apply(this, arguments);
      }

      return updateNotice;
    }(),
    // 공지 삭제
    deleteNotice: function () {
      var _deleteNotice = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(_, args, _ref5) {
        var request, isAuthenticated, prisma, noticeId, isExistNotice;
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                request = _ref5.request, isAuthenticated = _ref5.isAuthenticated, prisma = _ref5.prisma;
                isAuthenticated({
                  request: request
                });
                noticeId = args.noticeId;
                _context4.next = 5;
                return prisma.$exists.notice({
                  id: noticeId
                });

              case 5:
                isExistNotice = _context4.sent;

                if (!isExistNotice) {
                  _context4.next = 12;
                  break;
                }

                _context4.next = 9;
                return prisma.deleteNotice({
                  id: noticeId
                });

              case 9:
                return _context4.abrupt("return", true);

              case 12:
                return _context4.abrupt("return", false);

              case 13:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }));

      function deleteNotice(_x10, _x11, _x12) {
        return _deleteNotice.apply(this, arguments);
      }

      return deleteNotice;
    }()
  }
};