"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _require = require("../../fragment/notice"),
    NOTICE_FRAGMENT = _require.NOTICE_FRAGMENT;

module.exports = {
  Query: {
    /**
     * * 공지사항 검색
     *
     * @query
     * @author frisk
     * @param {number?} args.skip 건너뛸 목록의 수
     * @param {number?} args.first 요청 목록의 수
     * @param {string?} args.orderBy 정렬
     * @returns Notice[]
     */
    notices: function () {
      var _notices = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(_, args, _ref) {
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

      function notices(_x, _x2, _x3) {
        return _notices.apply(this, arguments);
      }

      return notices;
    }(),

    /**
     * * 공지사항 상세 조회
     *
     * @query
     * @author frisk
     * @param {string} args.id 공지사항 ID
     * @returns Notice
     */
    notice: function notice(_, args, _ref2) {
      var prisma = _ref2.prisma;
      var id = args.id;
      return prisma.notice({
        id: id
      });
    }
  },
  Mutation: {
    /**
     * * 공지사항 등록
     *
     * @mutation
     * @author frisk
     * @param {string} args.title 제목
     * @param {string} args.description 내용
     * @returns boolean
     */
    createNotice: function () {
      var _createNotice = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(_, args, _ref3) {
        var request, isAuthenticated, prisma, title, description;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                request = _ref3.request, isAuthenticated = _ref3.isAuthenticated, prisma = _ref3.prisma;
                _context2.next = 3;
                return isAuthenticated({
                  request: request
                });

              case 3:
                title = args.title, description = args.description;
                _context2.next = 6;
                return prisma.createNotice({
                  title: title,
                  description: description
                });

              case 6:
                return _context2.abrupt("return", true);

              case 7:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function createNotice(_x4, _x5, _x6) {
        return _createNotice.apply(this, arguments);
      }

      return createNotice;
    }(),

    /**
     * * 공지사항 수정
     *
     * @mutation
     * @author frisk
     * @param {string} args.id 공지사항 ID
     * @param {string} args.title 제목
     * @param {string} args.description 내용
     * @returns boolean
     */
    updateNotice: function () {
      var _updateNotice = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(_, args, _ref4) {
        var request, isAuthenticated, prisma, id, title, description, isExistNotice;
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                request = _ref4.request, isAuthenticated = _ref4.isAuthenticated, prisma = _ref4.prisma;
                _context3.next = 3;
                return isAuthenticated({
                  request: request
                });

              case 3:
                id = args.id, title = args.title, description = args.description;
                /**
                 * 공지사항 유무 확인
                 * @type {boolean}
                 */

                _context3.next = 6;
                return prisma.$exists.notice({
                  id: id
                });

              case 6:
                isExistNotice = _context3.sent;

                if (isExistNotice) {
                  _context3.next = 9;
                  break;
                }

                throw Error(JSON.stringify({
                  message: "존재하지 않는 공지사항입니다.",
                  status: 403
                }));

              case 9:
                _context3.next = 11;
                return prisma.updateNotice({
                  where: {
                    id: id
                  },
                  data: {
                    title: title,
                    description: description
                  }
                });

              case 11:
                return _context3.abrupt("return", true);

              case 12:
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

    /**
     * * 공지사항 삭제
     *
     * @mutation
     * @author frisk
     * @param {string} args.id 공지사항 ID
     * @returns boolean
     */
    deleteNotice: function () {
      var _deleteNotice = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(_, args, _ref5) {
        var request, isAuthenticated, prisma, id, isExistNotice;
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                request = _ref5.request, isAuthenticated = _ref5.isAuthenticated, prisma = _ref5.prisma;
                _context4.next = 3;
                return isAuthenticated({
                  request: request
                });

              case 3:
                id = args.id;
                /**
                 * 공지사항 유무 확인
                 * @type {boolean}
                 */

                _context4.next = 6;
                return prisma.$exists.notice({
                  id: id
                });

              case 6:
                isExistNotice = _context4.sent;

                if (isExistNotice) {
                  _context4.next = 9;
                  break;
                }

                throw Error(JSON.stringify({
                  message: "존재하지 않는 공지사항입니다.",
                  status: 403
                }));

              case 9:
                _context4.next = 11;
                return prisma.deleteNotice({
                  id: id
                });

              case 11:
                return _context4.abrupt("return", true);

              case 12:
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