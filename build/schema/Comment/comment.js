"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

module.exports = {
  Mutation: {
    /**
     * * 댓글 등록
     *
     * @mutation
     * @author frisk
     * @param {string} args.postId 게시물 ID
     * @param {string} args.content 댓글
     * @returns boolean
     */
    createComment: function () {
      var _createComment = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(_, args, _ref) {
        var request, isAuthenticated, prisma, postId, content, findPost;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                request = _ref.request, isAuthenticated = _ref.isAuthenticated, prisma = _ref.prisma;

                /**
                 * 인증 확인
                 */
                isAuthenticated({
                  request: request
                });
                postId = args.postId, content = args.content;
                /**
                 * 게시물 유무 확인
                 * @type {Post|null}
                 */

                _context.next = 5;
                return prisma.post({
                  id: postId
                });

              case 5:
                findPost = _context.sent;

                if (findPost) {
                  _context.next = 8;
                  break;
                }

                throw Error(JSON.stringify({
                  message: "존재하지 않는 게시물입니다",
                  status: 403
                }));

              case 8:
                _context.next = 10;
                return prisma.createComment({
                  content: content,
                  post: {
                    connect: {
                      id: postId
                    }
                  }
                });

              case 10:
                _context.next = 12;
                return prisma.updatePost({
                  where: {
                    id: postId
                  },
                  data: {
                    commentCount: findPost.commentCount + 1
                  }
                });

              case 12:
                return _context.abrupt("return", true);

              case 13:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function createComment(_x, _x2, _x3) {
        return _createComment.apply(this, arguments);
      }

      return createComment;
    }(),

    /**
     * * 댓글 수정
     *
     * @mutation
     * @author frisk
     * @param {string} args.id 댓글 ID
     * @param {string} args.content 댓글
     * @returns boolean
     */
    updateComment: function () {
      var _updateComment = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(_, args, _ref2) {
        var request, isAuthenticated, prisma, id, content, isExistComment;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                request = _ref2.request, isAuthenticated = _ref2.isAuthenticated, prisma = _ref2.prisma;

                /**
                 * 인증 확인
                 */
                isAuthenticated({
                  request: request
                });
                id = args.id, content = args.content;
                /**
                 * 댓글 유무 확인
                 * @type {boolean}
                 */

                _context2.next = 5;
                return prisma.$exists.comment({
                  id: id
                });

              case 5:
                isExistComment = _context2.sent;

                if (isExistComment) {
                  _context2.next = 8;
                  break;
                }

                throw Error(JSON.stringify({
                  message: "존재하지 않는 댓글입니다.",
                  status: 403
                }));

              case 8:
                _context2.next = 10;
                return prisma.updateComment({
                  where: {
                    id: id
                  },
                  data: {
                    content: content
                  }
                });

              case 10:
                return _context2.abrupt("return", true);

              case 11:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function updateComment(_x4, _x5, _x6) {
        return _updateComment.apply(this, arguments);
      }

      return updateComment;
    }(),

    /**
     * * 댓글 삭제
     *
     * @mutation
     * @author frisk
     * @param {string} args.id 댓글 ID
     * @returns boolean
     */
    deleteNotice: function () {
      var _deleteNotice = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(_, args, _ref3) {
        var request, isAuthenticated, prisma, id, findComment, postOfComment;
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                request = _ref3.request, isAuthenticated = _ref3.isAuthenticated, prisma = _ref3.prisma;

                /**
                 * 인증 확인
                 */
                isAuthenticated({
                  request: request
                });
                id = args.id;
                /**
                 * 댓글 유무 확인
                 * @type {Comment|null}
                 */

                _context3.next = 5;
                return prisma.comment({
                  id: id
                });

              case 5:
                findComment = _context3.sent;

                if (findComment) {
                  _context3.next = 8;
                  break;
                }

                throw Error(JSON.stringify({
                  message: "존재하지 않는 댓글입니다.",
                  status: 403
                }));

              case 8:
                _context3.next = 10;
                return prisma.deleteComment({
                  id: id
                });

              case 10:
                /**
                 * 댓글의 포스트 정보
                 * @type {Post}
                 */
                postOfComment = findComment.post();
                /**
                 * 포스트 댓글수 감소
                 */

                _context3.next = 13;
                return prisma.updatePost({
                  where: {
                    id: postOfComment.id
                  },
                  data: {
                    commentCount: postOfComment.commentCount - 1
                  }
                });

              case 13:
                return _context3.abrupt("return", true);

              case 14:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      function deleteNotice(_x7, _x8, _x9) {
        return _deleteNotice.apply(this, arguments);
      }

      return deleteNotice;
    }()
  }
};