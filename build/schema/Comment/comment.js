"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _require = require("../../fragment/comment"),
    COMMENTS_FRAGMENT = _require.COMMENTS_FRAGMENT,
    COMMENT_FRAGMENT = _require.COMMENT_FRAGMENT;

module.exports = {
  Query: {
    /**
     * * 댓글 검색
     *
     * @query
     * @author frisk
     * @param {number?} args.skip 건너뛸 목록의 수
     * @param {number?} args.first 요청 목록의 수
     * @param {string?} args.orderBy 정렬
     * @param {string?} args.postId 게시물 ID
     */
    comments: function () {
      var _comments = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(_, args, _ref) {
        var prisma, _args$skip, skip, _args$first, first, _args$orderBy, orderBy, postId, orFilter, where, comments, total;

        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                prisma = _ref.prisma;
                _args$skip = args.skip, skip = _args$skip === void 0 ? 0 : _args$skip, _args$first = args.first, first = _args$first === void 0 ? 30 : _args$first, _args$orderBy = args.orderBy, orderBy = _args$orderBy === void 0 ? "createdAt_DESC" : _args$orderBy, postId = args.postId;
                /**
                 * 필터 목록
                 * @type {Array<object>}
                 */

                orFilter = [];

                if (postId) {
                  /**
                   * 특정 게시물 조건 추가
                   */
                  orFilter.push({
                    post: {
                      id: postId
                    }
                  });
                }

                where = orFilter.length > 0 ? {
                  OR: orFilter
                } : {};
                /**
                 * 목록
                 */

                _context.next = 7;
                return prisma.comments({
                  where: where,
                  first: first,
                  skip: skip,
                  orderBy: orderBy
                }).$fragment(COMMENTS_FRAGMENT);

              case 7:
                comments = _context.sent;
                _context.next = 10;
                return prisma.commentsConnection({
                  where: where
                }).aggregate().count();

              case 10:
                total = _context.sent;
                return _context.abrupt("return", {
                  data: comments,
                  total: total
                });

              case 12:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function comments(_x, _x2, _x3) {
        return _comments.apply(this, arguments);
      }

      return comments;
    }()
  },
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
      var _createComment = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(_, args, _ref2) {
        var request, isAuthenticated, prisma, id, postId, content, findPost;
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
                id = request.user.id;
                postId = args.postId, content = args.content;
                /**
                 * 게시물 유무 확인
                 * @type {Post|null}
                 */

                _context2.next = 6;
                return prisma.post({
                  id: postId
                });

              case 6:
                findPost = _context2.sent;

                if (findPost) {
                  _context2.next = 9;
                  break;
                }

                throw Error(JSON.stringify({
                  message: "존재하지 않는 게시물입니다",
                  status: 403
                }));

              case 9:
                _context2.next = 11;
                return prisma.createComment({
                  content: content,
                  post: {
                    connect: {
                      id: postId
                    }
                  },
                  user: {
                    connect: {
                      id: id
                    }
                  }
                });

              case 11:
                _context2.next = 13;
                return prisma.updatePost({
                  where: {
                    id: postId
                  },
                  data: {
                    commentCount: findPost.commentCount + 1
                  }
                });

              case 13:
                return _context2.abrupt("return", true);

              case 14:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function createComment(_x4, _x5, _x6) {
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
      var _updateComment = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(_, args, _ref3) {
        var request, isAuthenticated, prisma, id, content, isExistComment;
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
                id = args.id, content = args.content;
                /**
                 * 댓글 유무 확인
                 * @type {boolean}
                 */

                _context3.next = 5;
                return prisma.$exists.comment({
                  id: id
                });

              case 5:
                isExistComment = _context3.sent;

                if (isExistComment) {
                  _context3.next = 8;
                  break;
                }

                throw Error(JSON.stringify({
                  message: "존재하지 않는 댓글입니다.",
                  status: 403
                }));

              case 8:
                _context3.next = 10;
                return prisma.updateComment({
                  where: {
                    id: id
                  },
                  data: {
                    content: content
                  }
                });

              case 10:
                return _context3.abrupt("return", true);

              case 11:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      function updateComment(_x7, _x8, _x9) {
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
    deleteComment: function () {
      var _deleteComment = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(_, args, _ref4) {
        var request, isAuthenticated, prisma, id, findComment;
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                request = _ref4.request, isAuthenticated = _ref4.isAuthenticated, prisma = _ref4.prisma;

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

                _context4.next = 5;
                return prisma.comment({
                  id: id
                }).$fragment(COMMENT_FRAGMENT);

              case 5:
                findComment = _context4.sent;

                if (findComment) {
                  _context4.next = 8;
                  break;
                }

                throw Error(JSON.stringify({
                  message: "존재하지 않는 댓글입니다.",
                  status: 403
                }));

              case 8:
                _context4.next = 10;
                return prisma.deleteComment({
                  id: id
                });

              case 10:
                _context4.next = 12;
                return prisma.updatePost({
                  where: {
                    id: findComment.post.id
                  },
                  data: {
                    commentCount: findComment.post.commentCount - 1
                  }
                });

              case 12:
                return _context4.abrupt("return", true);

              case 13:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }));

      function deleteComment(_x10, _x11, _x12) {
        return _deleteComment.apply(this, arguments);
      }

      return deleteComment;
    }()
  }
};