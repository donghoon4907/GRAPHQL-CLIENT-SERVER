"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _require = require("../../fragment/post"),
    POST_FRAGMENT = _require.POST_FRAGMENT;

var moment = require("moment");

module.exports = {
  Query: {
    // 포스트 검색
    getPosts: function () {
      var _getPosts = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(_, args, _ref) {
        var prisma, _args$skip, skip, _args$first, first, _args$orderBy, orderBy, searchKeyword, orFilter, where;

        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                prisma = _ref.prisma;
                _args$skip = args.skip, skip = _args$skip === void 0 ? 0 : _args$skip, _args$first = args.first, first = _args$first === void 0 ? 30 : _args$first, _args$orderBy = args.orderBy, orderBy = _args$orderBy === void 0 ? "createdAt_DESC" : _args$orderBy, searchKeyword = args.searchKeyword;
                orFilter = [];

                if (searchKeyword) {
                  orFilter.push({
                    title_contains: searchKeyword
                  });
                  orFilter.push({
                    description_contains: searchKeyword
                  }); // const from = moment();
                  // from.set({ hour: 0, minute: 0, second: 0 });
                  // const to = moment();
                  // to.set({ hour: 23, minute: 59, second: 59 });
                  // const isExistSearchKeyword = await prisma.$exists.searchKeyword({
                  //   user: {
                  //     id
                  //   },
                  //   keyword: searchKeyword,
                  //   createdAt_gt: from,
                  //   createdAt_lt: to
                  // });
                  // if (!isExistSearchKeyword) {
                  //   await prisma.createSearchKeyword({
                  //     keyword: searchKeyword,
                  //     user: {
                  //       connect: {
                  //         id
                  //       }
                  //     }
                  //   });
                  // }
                }

                where = orFilter.length > 0 ? {
                  OR: orFilter // video: {
                  //   status: "complete"
                  // }

                } : {};
                return _context.abrupt("return", prisma.posts({
                  first: first,
                  skip: skip,
                  where: where,
                  orderBy: orderBy
                }).$fragment(POST_FRAGMENT));

              case 6:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function getPosts(_x, _x2, _x3) {
        return _getPosts.apply(this, arguments);
      }

      return getPosts;
    }(),
    // 포스트 상세 정보
    getPost: function getPost(_, args, _ref2) {
      var prisma = _ref2.prisma;
      var postId = args.postId;
      return prisma.post({
        id: postId
      }).$fragment(POST_FRAGMENT);
    },
    // 피드 검색
    getFeed: function () {
      var _getFeed = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(_, args, _ref3) {
        var request, isAuthenticated, prisma, _args$skip2, skip, _args$first2, first, _args$orderBy2, orderBy, id, following;

        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                request = _ref3.request, isAuthenticated = _ref3.isAuthenticated, prisma = _ref3.prisma;
                isAuthenticated({
                  request: request
                });
                _args$skip2 = args.skip, skip = _args$skip2 === void 0 ? 0 : _args$skip2, _args$first2 = args.first, first = _args$first2 === void 0 ? 30 : _args$first2, _args$orderBy2 = args.orderBy, orderBy = _args$orderBy2 === void 0 ? "createdAt_DESC" : _args$orderBy2;
                id = request.user.id;
                _context2.next = 6;
                return prisma.user({
                  id: id
                }).following();

              case 6:
                following = _context2.sent;
                return _context2.abrupt("return", prisma.posts({
                  where: {
                    user: {
                      id_in: following.map(function (user) {
                        return user.id;
                      })
                    }
                  },
                  first: first,
                  skip: skip,
                  orderBy: orderBy
                }).$fragment(POST_FRAGMENT));

              case 8:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function getFeed(_x4, _x5, _x6) {
        return _getFeed.apply(this, arguments);
      }

      return getFeed;
    }()
  },
  Mutation: {
    // 포스트 추가
    addPost: function () {
      var _addPost = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(_, args, _ref4) {
        var request, isAuthenticated, prisma, title, description, status, file, id;
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                request = _ref4.request, isAuthenticated = _ref4.isAuthenticated, prisma = _ref4.prisma;
                isAuthenticated({
                  request: request
                });
                title = args.title, description = args.description, status = args.status, file = args.file;
                id = request.user.id;
                _context3.next = 6;
                return prisma.createPost({
                  title: title,
                  description: description,
                  status: status,
                  user: {
                    connect: {
                      id: id
                    }
                  },
                  video: {
                    create: {
                      url: file,
                      status: "queue"
                    }
                  },
                  room: {
                    create: {
                      participants: {
                        connect: {
                          id: id
                        }
                      }
                    }
                  }
                });

              case 6:
                return _context3.abrupt("return", true);

              case 7:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      function addPost(_x7, _x8, _x9) {
        return _addPost.apply(this, arguments);
      }

      return addPost;
    }(),
    // 포스트 수정
    updatePost: function () {
      var _updatePost = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(_, args, _ref5) {
        var request, isAuthenticated, prisma, postId, title, description, status, isExistPost;
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                request = _ref5.request, isAuthenticated = _ref5.isAuthenticated, prisma = _ref5.prisma;
                isAuthenticated({
                  request: request
                });
                postId = args.postId, title = args.title, description = args.description, status = args.status;
                _context4.next = 5;
                return prisma.$exists.post({
                  id: postId
                });

              case 5:
                isExistPost = _context4.sent;

                if (!isExistPost) {
                  _context4.next = 12;
                  break;
                }

                _context4.next = 9;
                return prisma.updatePost({
                  where: {
                    id: postId
                  },
                  data: {
                    title: title,
                    description: description,
                    status: status
                  }
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

      function updatePost(_x10, _x11, _x12) {
        return _updatePost.apply(this, arguments);
      }

      return updatePost;
    }(),
    // 포스트 삭제
    deletePost: function () {
      var _deletePost = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(_, args, _ref6) {
        var request, isAuthenticated, prisma, postId, isExistPost;
        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                request = _ref6.request, isAuthenticated = _ref6.isAuthenticated, prisma = _ref6.prisma;
                isAuthenticated({
                  request: request
                });
                postId = args.postId;
                _context5.next = 5;
                return prisma.$exists.post({
                  id: postId
                });

              case 5:
                isExistPost = _context5.sent;

                if (!isExistPost) {
                  _context5.next = 12;
                  break;
                }

                _context5.next = 9;
                return prisma.deletePost({
                  id: postId
                });

              case 9:
                return _context5.abrupt("return", true);

              case 12:
                return _context5.abrupt("return", false);

              case 13:
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
    // 포스트 좋아요 / 취소
    likePost: function () {
      var _likePost = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(_, args, _ref7) {
        var request, isAuthenticated, prisma, postId, id, filterOptions, isExistLike;
        return _regenerator["default"].wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                request = _ref7.request, isAuthenticated = _ref7.isAuthenticated, prisma = _ref7.prisma;
                isAuthenticated({
                  request: request
                });
                postId = args.postId;
                id = request.user.id;
                filterOptions = {
                  AND: [{
                    user: {
                      id: id
                    }
                  }, {
                    post: {
                      id: postId
                    }
                  }]
                }; // 특정 포스트의 좋아요 유무 판별

                _context6.next = 7;
                return prisma.$exists.like(filterOptions);

              case 7:
                isExistLike = _context6.sent;

                if (!isExistLike) {
                  _context6.next = 13;
                  break;
                }

                _context6.next = 11;
                return prisma.deleteManyLikes(filterOptions);

              case 11:
                _context6.next = 15;
                break;

              case 13:
                _context6.next = 15;
                return prisma.createLike({
                  user: {
                    connect: {
                      id: id
                    }
                  },
                  post: {
                    connect: {
                      id: postId
                    }
                  }
                });

              case 15:
                return _context6.abrupt("return", true);

              case 16:
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
  },
  // computed
  Post: {// 내가 좋아요 했는지 여부
    // isLiked: ({ id }, _, { request: { user }, prisma }) => {
    //   return prisma.$exists.like({
    //     AND: [
    //       {
    //         user: {
    //           id: user.id
    //         },
    //         post: {
    //           id
    //         }
    //       }
    //     ]
    //   });
    // },
    // 포스트의 좋아요 수
    // likeCount: (parent, _, { prisma }) => {
    //   return prisma
    //     .likesConnection({ where: { post: { id: parent.id } } })
    //     .aggregate()
    //     .count();
    // },
    // 내가 작성한 포스트 여부
    // isMyPost: (parent, _, { request: { user }, prisma }) =>
    //   parent.user.id === user.id
  }
};