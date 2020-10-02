"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _require = require("../../fragment/post"),
    POSTS_FRAGMENT = _require.POSTS_FRAGMENT,
    POST_FRAGMENT = _require.POST_FRAGMENT;

var moment = require("moment");

module.exports = {
  Query: {
    /**
     * * 게시물 검색
     *
     * @query
     * @author frisk
     * @param {number?} args.skip 건너뛸 목록의 수
     * @param {number?} args.first 요청 목록의 수
     * @param {string?} args.orderBy 정렬
     * @param {string?} args.query 검색어
     * @returns Post[]
     */
    posts: function () {
      var _posts = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(_, args, _ref) {
        var prisma, _args$skip, skip, _args$first, first, _args$orderBy, orderBy, query, category, userId, orFilter, where, posts, total;

        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                prisma = _ref.prisma;
                _args$skip = args.skip, skip = _args$skip === void 0 ? 0 : _args$skip, _args$first = args.first, first = _args$first === void 0 ? 30 : _args$first, _args$orderBy = args.orderBy, orderBy = _args$orderBy === void 0 ? "createdAt_DESC" : _args$orderBy, query = args.query, category = args.category, userId = args.userId;
                /**
                 * 필터 목록
                 * @type {Array<object>}
                 */

                orFilter = [];
                /**
                 * 검색어 조건 추가 시
                 */

                if (query) {
                  /**
                   * 제목 및 내용 like 조건 추가
                   */
                  orFilter.push({
                    title_contains: query
                  });
                  orFilter.push({
                    description_contains: query
                  });
                }
                /**
                 * 카테고리 조건 추가 시
                 */


                if (category) {
                  orFilter.push({
                    category: category
                  });
                }
                /**
                 * 사용자 조건 추가 시
                 */


                if (userId) {
                  orFilter.push({
                    user: {
                      id: userId
                    }
                  });
                }

                where = orFilter.length > 0 ? {
                  OR: orFilter
                } : {};
                /**
                 * 목록
                 */

                _context.next = 9;
                return prisma.posts({
                  first: first,
                  skip: skip,
                  where: where,
                  orderBy: orderBy
                }).$fragment(POSTS_FRAGMENT);

              case 9:
                posts = _context.sent;
                _context.next = 12;
                return prisma.postsConnection({
                  where: where
                }).aggregate().count();

              case 12:
                total = _context.sent;
                return _context.abrupt("return", {
                  data: posts,
                  total: total
                });

              case 14:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function posts(_x, _x2, _x3) {
        return _posts.apply(this, arguments);
      }

      return posts;
    }(),

    /**
     * * 게시물 상세 조회
     *
     * @query
     * @author frisk
     * @param {string} args.id 게시물 ID
     * @returns Post
     */
    post: function () {
      var _post = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(_, args, _ref2) {
        var request, prisma, id, findPost, ip, from, to, isExistHistory;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                request = _ref2.request, prisma = _ref2.prisma;
                id = args.id;
                /**
                 * 게시물 중복 확인
                 * @type {Post|null}
                 */

                _context2.next = 4;
                return prisma.post({
                  id: id
                });

              case 4:
                findPost = _context2.sent;

                if (!findPost) {
                  _context2.next = 21;
                  break;
                }

                /**
                 * 사용자의 IP
                 */
                ip = request.headers["x-forwarded-for"] || request.connection.remoteAddress || request.socket.remoteAddress || request.connection.socket.remoteAddress;
                /**
                 * 오늘 범위값 설정
                 */

                from = moment();
                from.set({
                  hour: 0,
                  minute: 0,
                  second: 0
                });
                to = moment();
                to.set({
                  hour: 23,
                  minute: 59,
                  second: 59
                });
                /**
                 * 접근 내역 확인
                 * @type {boolean}
                 */

                _context2.next = 13;
                return prisma.$exists.history({
                  ip: ip,
                  createdAt_gt: from,
                  createdAt_lt: to,
                  post: {
                    id: id
                  }
                });

              case 13:
                isExistHistory = _context2.sent;

                if (isExistHistory) {
                  _context2.next = 19;
                  break;
                }

                _context2.next = 17;
                return prisma.createHistory({
                  ip: ip,
                  post: {
                    connect: {
                      id: id
                    }
                  }
                });

              case 17:
                _context2.next = 19;
                return prisma.updatePost({
                  where: {
                    id: id
                  },
                  data: {
                    viewCount: findPost.viewCount + 1
                  }
                });

              case 19:
                _context2.next = 22;
                break;

              case 21:
                throw Error(JSON.stringify({
                  message: "존재하지 않는 게시물입니다.",
                  status: 403
                }));

              case 22:
                return _context2.abrupt("return", prisma.post({
                  id: id
                }).$fragment(POST_FRAGMENT));

              case 23:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function post(_x4, _x5, _x6) {
        return _post.apply(this, arguments);
      }

      return post;
    }()
  },
  Mutation: {
    /**
     * * 게시물 등록
     *
     * @mutation
     * @author frisk
     * @param {string} args.title 제목
     * @param {string} args.description 내용
     * @param {string} args.isTemp 임시저장 여부
     * @param {string[]} categories 카테고리 목록
     * @returns boolean
     */
    createPost: function () {
      var _createPost = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(_, args, _ref3) {
        var request, isAuthenticated, prisma, _request$user, id, postCount, title, description, content, category, thumbnail, findCategory;

        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                request = _ref3.request, isAuthenticated = _ref3.isAuthenticated, prisma = _ref3.prisma;
                _context3.next = 3;
                return isAuthenticated({
                  request: request
                });

              case 3:
                _request$user = request.user, id = _request$user.id, postCount = _request$user.postCount;
                title = args.title, description = args.description, content = args.content, category = args.category, thumbnail = args.thumbnail;
                /**
                 * 게시물 추가
                 */

                _context3.next = 7;
                return prisma.createPost({
                  title: title,
                  description: description,
                  content: content,
                  category: category,
                  user: {
                    connect: {
                      id: id
                    }
                  },
                  thumbnail: thumbnail
                });

              case 7:
                _context3.next = 9;
                return prisma.category({
                  content: category
                });

              case 9:
                findCategory = _context3.sent;

                if (!findCategory) {
                  _context3.next = 15;
                  break;
                }

                _context3.next = 13;
                return prisma.updateCategory({
                  data: {
                    useCount: findCategory.useCount + 1
                  },
                  where: {
                    content: category
                  }
                });

              case 13:
                _context3.next = 17;
                break;

              case 15:
                _context3.next = 17;
                return prisma.createCategory({
                  content: category,
                  useCount: 1
                });

              case 17:
                _context3.next = 19;
                return prisma.updateUser({
                  where: {
                    id: id
                  },
                  data: {
                    postCount: postCount + 1
                  }
                });

              case 19:
                return _context3.abrupt("return", true);

              case 20:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      function createPost(_x7, _x8, _x9) {
        return _createPost.apply(this, arguments);
      }

      return createPost;
    }(),

    /**
     * * 게시물 수정
     *
     * @mutation
     * @author frisk
     * @param {string} args.id 게시물 ID
     * @param {string} args.title 제목
     * @param {string} args.description 내용
     * @returns boolean
     */
    updatePost: function () {
      var _updatePost = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(_, args, _ref4) {
        var request, isAuthenticated, prisma, id, title, description, content, category, thumbnail, findPost, findCategory;
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                request = _ref4.request, isAuthenticated = _ref4.isAuthenticated, prisma = _ref4.prisma;
                _context4.next = 3;
                return isAuthenticated({
                  request: request
                });

              case 3:
                id = args.id, title = args.title, description = args.description, content = args.content, category = args.category, thumbnail = args.thumbnail;
                /**
                 * 게시물 유무 확인
                 * @type {boolean}
                 */

                _context4.next = 6;
                return prisma.post({
                  id: id
                });

              case 6:
                findPost = _context4.sent;

                if (findPost) {
                  _context4.next = 9;
                  break;
                }

                throw Error(JSON.stringify({
                  message: "존재하지 않는 게시물입니다.",
                  status: 403
                }));

              case 9:
                _context4.next = 11;
                return prisma.updatePost({
                  where: {
                    id: id
                  },
                  data: {
                    title: title,
                    description: description,
                    content: content,
                    category: category,
                    thumbnail: thumbnail
                  }
                });

              case 11:
                if (!(findPost.category !== category)) {
                  _context4.next = 22;
                  break;
                }

                _context4.next = 14;
                return prisma.category({
                  content: category
                });

              case 14:
                findCategory = _context4.sent;

                if (!findCategory) {
                  _context4.next = 20;
                  break;
                }

                _context4.next = 18;
                return prisma.updateCategory({
                  data: {
                    useCount: findCategory.useCount + 1
                  },
                  where: {
                    content: category
                  }
                });

              case 18:
                _context4.next = 22;
                break;

              case 20:
                _context4.next = 22;
                return prisma.createCategory({
                  content: category,
                  useCount: 1
                });

              case 22:
                return _context4.abrupt("return", true);

              case 23:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }));

      function updatePost(_x10, _x11, _x12) {
        return _updatePost.apply(this, arguments);
      }

      return updatePost;
    }(),

    /**
     * * 게시물 삭제
     *
     * @mutation
     * @author frisk
     * @param {string} args.id 게시물 ID
     * @returns boolean
     */
    deletePost: function () {
      var _deletePost = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(_, args, _ref5) {
        var request, isAuthenticated, prisma, user, id, isExistPost;
        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                request = _ref5.request, isAuthenticated = _ref5.isAuthenticated, prisma = _ref5.prisma;
                _context5.next = 3;
                return isAuthenticated({
                  request: request
                });

              case 3:
                user = request.user;
                id = args.id;
                /**
                 * 게시물 유무 확인
                 * @type {boolean}
                 */

                _context5.next = 7;
                return prisma.$exists.post({
                  id: id
                });

              case 7:
                isExistPost = _context5.sent;

                if (isExistPost) {
                  _context5.next = 10;
                  break;
                }

                throw Error(JSON.stringify({
                  message: "존재하지 않는 게시물입니다.",
                  status: 403
                }));

              case 10:
                _context5.next = 12;
                return prisma.deletePost({
                  id: id
                });

              case 12:
                _context5.next = 14;
                return prisma.updateUser({
                  where: {
                    id: user.id
                  },
                  data: {
                    postCount: user.postCount - 1
                  }
                });

              case 14:
                return _context5.abrupt("return", true);

              case 15:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5);
      }));

      function deletePost(_x13, _x14, _x15) {
        return _deletePost.apply(this, arguments);
      }

      return deletePost;
    }(),

    /**
     * * 게시물 좋아요 / 좋아요 취소
     *
     * @mutation
     * @author frisk
     * @param {string} args.id 게시물 ID
     * @returns boolean
     */
    likePost: function () {
      var _likePost = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(_, args, _ref6) {
        var request, isAuthenticated, prisma, user, id, options, findPost, isExistLike;
        return _regenerator["default"].wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                request = _ref6.request, isAuthenticated = _ref6.isAuthenticated, prisma = _ref6.prisma;
                _context6.next = 3;
                return isAuthenticated({
                  request: request
                });

              case 3:
                user = request.user;
                id = args.id;
                /**
                 * 좋아요 요청 공통 옵션
                 * @type {object}
                 */

                options = {
                  AND: [{
                    user: {
                      id: user.id
                    }
                  }, {
                    post: {
                      id: id
                    }
                  }]
                };
                /**
                 * 게시물 유무 확인
                 * @type {boolean}
                 */

                _context6.next = 8;
                return prisma.post({
                  id: id
                });

              case 8:
                findPost = _context6.sent;

                if (findPost) {
                  _context6.next = 11;
                  break;
                }

                throw Error(JSON.stringify({
                  message: "존재하지 않는 게시물입니다.",
                  status: 403
                }));

              case 11:
                _context6.next = 13;
                return prisma.$exists.like(options);

              case 13:
                isExistLike = _context6.sent;

                if (!isExistLike) {
                  _context6.next = 21;
                  break;
                }

                _context6.next = 17;
                return prisma.deleteManyLikes(options);

              case 17:
                _context6.next = 19;
                return prisma.updatePost({
                  where: {
                    id: id
                  },
                  data: {
                    likeCount: findPost.likeCount - 1
                  }
                });

              case 19:
                _context6.next = 25;
                break;

              case 21:
                _context6.next = 23;
                return prisma.createLike({
                  user: {
                    connect: {
                      id: user.id
                    }
                  },
                  post: {
                    connect: {
                      id: id
                    }
                  }
                });

              case 23:
                _context6.next = 25;
                return prisma.updatePost({
                  where: {
                    id: id
                  },
                  data: {
                    likeCount: findPost.likeCount + 1
                  }
                });

              case 25:
                return _context6.abrupt("return", true);

              case 26:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6);
      }));

      function likePost(_x16, _x17, _x18) {
        return _likePost.apply(this, arguments);
      }

      return likePost;
    }()
  }
};