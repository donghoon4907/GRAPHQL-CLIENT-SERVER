"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _require = require("../../fragment/post"),
    POSTS_FRAGMENT = _require.POSTS_FRAGMENT,
    POST_FRAGMENT = _require.POST_FRAGMENT;

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
        var prisma, _args$skip, skip, _args$first, first, _args$orderBy, orderBy, query, orFilter, where;

        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                prisma = _ref.prisma;
                _args$skip = args.skip, skip = _args$skip === void 0 ? 0 : _args$skip, _args$first = args.first, first = _args$first === void 0 ? 30 : _args$first, _args$orderBy = args.orderBy, orderBy = _args$orderBy === void 0 ? "createdAt_DESC" : _args$orderBy, query = args.query;
                /**
                 * 필터 목록
                 * @type {Array<object>}
                 */

                orFilter = [];

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

                where = orFilter.length > 0 ? {
                  OR: orFilter,

                  /**
                   * 임시저장이 아닌 게시물 대상
                   */
                  isTemp: false
                } : {};
                return _context.abrupt("return", prisma.posts({
                  first: first,
                  skip: skip,
                  where: where,
                  orderBy: orderBy
                }).$fragment(POSTS_FRAGMENT));

              case 6:
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
        var prisma, id, findPost, ip, from, to, isExistHistory;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                prisma = _ref2.prisma;
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
                  _context2.next = 19;
                  break;
                }

                /**
                 * 사용자의 IP
                 */
                ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
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
                  createdAt_lt: to
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
                return _context2.abrupt("return", prisma.post({
                  id: id
                }).$fragment(POST_FRAGMENT));

              case 20:
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
        var request, isAuthenticated, prisma, id, title, description, content, categories, newPost, i, category, findCategory, findUser;
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
                id = request.user.id;
                title = args.title, description = args.description, content = args.content, categories = args.categories;
                /**
                 * 게시물 추가
                 */

                _context3.next = 6;
                return prisma.createPost({
                  title: title,
                  description: description,
                  content: content,
                  user: {
                    connect: {
                      id: id
                    }
                  }
                });

              case 6:
                newPost = _context3.sent;
                i = 0;

              case 8:
                if (!(i < categories.length)) {
                  _context3.next = 23;
                  break;
                }

                category = categories[i].content;
                /**
                 * 카테고리 중복 확인
                 * @type {Category|null}
                 */

                _context3.next = 12;
                return prisma.category({
                  content: category
                });

              case 12:
                findCategory = _context3.sent;

                if (!findCategory) {
                  _context3.next = 18;
                  break;
                }

                _context3.next = 16;
                return prisma.updateCategory({
                  data: {
                    useCount: findCategory.useCount + 1,
                    post: {
                      connect: {
                        id: newPost.id
                      }
                    }
                  },
                  where: {
                    content: category
                  }
                });

              case 16:
                _context3.next = 20;
                break;

              case 18:
                _context3.next = 20;
                return prisma.createCategory({
                  content: category,
                  post: {
                    connect: {
                      id: newPost.id
                    }
                  }
                });

              case 20:
                i++;
                _context3.next = 8;
                break;

              case 23:
                _context3.next = 25;
                return prisma.user({
                  id: id
                });

              case 25:
                findUser = _context3.sent;

                if (!findUser) {
                  _context3.next = 29;
                  break;
                }

                _context3.next = 29;
                return prisma.updateUser({
                  where: {
                    id: id
                  },
                  data: {
                    postCount: findUser.postCount + 1
                  }
                });

              case 29:
                return _context3.abrupt("return", true);

              case 30:
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
        var request, isAuthenticated, prisma, id, title, description, isExistPost;
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
                id = args.id, title = args.title, description = args.description;
                /**
                 * 게시물 유무 확인
                 * @type {boolean}
                 */

                _context4.next = 5;
                return prisma.$exists.post({
                  id: id
                });

              case 5:
                isExistPost = _context4.sent;

                if (isExistPost) {
                  _context4.next = 8;
                  break;
                }

                throw Error(JSON.stringify({
                  message: "존재하지 않는 게시물입니다.",
                  status: 403
                }));

              case 8:
                _context4.next = 10;
                return prisma.updatePost({
                  where: {
                    id: id
                  },
                  data: {
                    title: title,
                    description: description
                  }
                });

              case 10:
                return _context4.abrupt("return", true);

              case 11:
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
        var request, isAuthenticated, prisma, user, id, isExistPost, findUser;
        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                request = _ref5.request, isAuthenticated = _ref5.isAuthenticated, prisma = _ref5.prisma;

                /**
                 * 인증 확인
                 */
                isAuthenticated({
                  request: request
                });
                user = request.user;
                id = args.id;
                /**
                 * 게시물 유무 확인
                 * @type {boolean}
                 */

                _context5.next = 6;
                return prisma.$exists.post({
                  id: id
                });

              case 6:
                isExistPost = _context5.sent;

                if (isExistPost) {
                  _context5.next = 9;
                  break;
                }

                throw Error(JSON.stringify({
                  message: "존재하지 않는 게시물입니다.",
                  status: 403
                }));

              case 9:
                _context5.next = 11;
                return prisma.deletePost({
                  id: id
                });

              case 11:
                _context5.next = 13;
                return prisma.user({
                  id: user.id
                });

              case 13:
                findUser = _context5.sent;

                if (!findUser) {
                  _context5.next = 17;
                  break;
                }

                _context5.next = 17;
                return prisma.updateUser({
                  where: {
                    id: user.id
                  },
                  data: {
                    postCount: findUser.postCount - 1
                  }
                });

              case 17:
                return _context5.abrupt("return", true);

              case 18:
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

                /**
                 * 인증 확인
                 */
                isAuthenticated({
                  request: request
                });
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

                _context6.next = 7;
                return prisma.post({
                  id: id
                });

              case 7:
                findPost = _context6.sent;

                if (findPost) {
                  _context6.next = 10;
                  break;
                }

                throw Error(JSON.stringify({
                  message: "존재하지 않는 게시물입니다.",
                  status: 403
                }));

              case 10:
                _context6.next = 12;
                return prisma.$exists.like(options);

              case 12:
                isExistLike = _context6.sent;

                if (!isExistLike) {
                  _context6.next = 20;
                  break;
                }

                _context6.next = 16;
                return prisma.deleteManyLikes(options);

              case 16:
                _context6.next = 18;
                return prisma.updatePost({
                  where: {
                    id: id
                  },
                  data: {
                    likeCount: findPost.likeCount - 1
                  }
                });

              case 18:
                _context6.next = 24;
                break;

              case 20:
                _context6.next = 22;
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

              case 22:
                _context6.next = 24;
                return prisma.updatePost({
                  where: {
                    id: id
                  },
                  data: {
                    likeCount: findPost.likeCount + 1
                  }
                });

              case 24:
                return _context6.abrupt("return", true);

              case 25:
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