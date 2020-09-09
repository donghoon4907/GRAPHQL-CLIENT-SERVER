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
    post: function post(_, args, _ref2) {
      var prisma = _ref2.prisma;
      var id = args.id;
      return prisma.post({
        id: id
      }).$fragment(POST_FRAGMENT);
    }
  },
  Mutation: {
    /**
     * * 게시물 등록
     *
     * @mutation
     * @author frisk
     * @param {string} args.title 제목
     * @param {string} args.description 내용
     * @param {string[]} categories 카테고리 목록
     * @returns boolean
     */
    createPost: function () {
      var _createPost = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(_, args, _ref3) {
        var request, isAuthenticated, prisma, id, title, description, categories, mapToCategories, i, content, findCategory;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                request = _ref3.request, isAuthenticated = _ref3.isAuthenticated, prisma = _ref3.prisma;

                /**
                 * 인증 확인
                 */
                isAuthenticated({
                  request: request
                });
                id = request.user.id;
                title = args.title, description = args.description, categories = args.categories;
                /**
                 * 카테고리 매핑
                 * @type {object}
                 */

                mapToCategories = {
                  /**
                   * 생성 목록: 새로운 카테고리
                   */
                  create: [],

                  /**
                   * 연결 목록: 기존 카테고리
                   */
                  connect: []
                };
                i = 0;

              case 6:
                if (!(i < categories.length)) {
                  _context2.next = 21;
                  break;
                }

                content = categories[i];
                /**
                 * 카테고리 중복 확인
                 * @type {Category|null}
                 */

                _context2.next = 10;
                return prisma.category({
                  content: content
                });

              case 10:
                findCategory = _context2.sent;

                if (!findCategory) {
                  _context2.next = 17;
                  break;
                }

                /**
                 * 연결 목록에 추가
                 */
                mapToCategories.connect.push({
                  id: findCategory.id
                });
                /**
                 * 카테고리 사용수 + 1
                 */

                _context2.next = 15;
                return prisma.updateCategory({
                  data: {
                    useCount: findCategory.useCount + 1
                  },
                  where: {
                    id: findCategory.id
                  }
                });

              case 15:
                _context2.next = 18;
                break;

              case 17:
                /**
                 * 생성 목록에 추가
                 */
                mapToCategories.create.push({
                  content: content
                });

              case 18:
                i++;
                _context2.next = 6;
                break;

              case 21:
                _context2.next = 23;
                return prisma.createPost({
                  title: title,
                  description: description,
                  categories: mapToCategories,
                  user: {
                    connect: {
                      id: id
                    }
                  }
                });

              case 23:
                return _context2.abrupt("return", true);

              case 24:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function createPost(_x4, _x5, _x6) {
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
      var _updatePost = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(_, args, _ref4) {
        var request, isAuthenticated, prisma, id, title, description, isExistPost;
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
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

                _context3.next = 5;
                return prisma.$exists.post({
                  id: id
                });

              case 5:
                isExistPost = _context3.sent;

                if (isExistPost) {
                  _context3.next = 8;
                  break;
                }

                throw Error(JSON.stringify({
                  message: "존재하지 않는 게시물입니다.",
                  status: 403
                }));

              case 8:
                _context3.next = 10;
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
                return _context3.abrupt("return", true);

              case 11:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      function updatePost(_x7, _x8, _x9) {
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
      var _deletePost = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(_, args, _ref5) {
        var request, isAuthenticated, prisma, id, isExistPost;
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                request = _ref5.request, isAuthenticated = _ref5.isAuthenticated, prisma = _ref5.prisma;

                /**
                 * 인증 확인
                 */
                isAuthenticated({
                  request: request
                });
                id = args.id;
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
                return prisma.deletePost({
                  id: id
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

      function deletePost(_x10, _x11, _x12) {
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
      var _likePost = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(_, args, _ref6) {
        var request, isAuthenticated, prisma, user, id, options, isExistLike;
        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
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
                 * 좋아요 유무 판별
                 */

                _context5.next = 7;
                return prisma.$exists.like(options);

              case 7:
                isExistLike = _context5.sent;

                if (!isExistLike) {
                  _context5.next = 13;
                  break;
                }

                _context5.next = 11;
                return prisma.deleteManyLikes(options);

              case 11:
                _context5.next = 15;
                break;

              case 13:
                _context5.next = 15;
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

              case 15:
                return _context5.abrupt("return", true);

              case 16:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5);
      }));

      function likePost(_x13, _x14, _x15) {
        return _likePost.apply(this, arguments);
      }

      return likePost;
    }()
  }
};