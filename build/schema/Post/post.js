"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _require = require("../../fragment/post"),
    POST_FRAGMENT = _require.POST_FRAGMENT,
    ACCEPT_FRAGMENT = _require.ACCEPT_FRAGMENT;

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
                  });
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
        var request, isAuthenticated, prisma, title, description, status, file, user, video, newPost;
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                request = _ref4.request, isAuthenticated = _ref4.isAuthenticated, prisma = _ref4.prisma;
                isAuthenticated({
                  request: request
                });
                title = args.title, description = args.description, status = args.status, file = args.file;
                user = request.user;
                _context3.next = 6;
                return prisma.createVideo({
                  url: file,
                  status: "queue"
                });

              case 6:
                video = _context3.sent;
                _context3.next = 9;
                return prisma.createPost({
                  title: title,
                  description: description,
                  status: status,
                  user: {
                    connect: {
                      id: user.id
                    }
                  },
                  video: {
                    connect: {
                      id: video.id
                    }
                  }
                });

              case 9:
                newPost = _context3.sent;
                _context3.next = 12;
                return prisma.createMessageRoom({
                  participants: {
                    connect: {
                      id: user.id
                    }
                  },
                  post: {
                    connect: {
                      id: newPost.id
                    }
                  }
                });

              case 12:
                return _context3.abrupt("return", true);

              case 13:
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
    // 포스트 댓글 추가
    addComment: function () {
      var _addComment = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(_, args, _ref7) {
        var request, isAuthenticated, prisma, content, postId, id;
        return _regenerator["default"].wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                request = _ref7.request, isAuthenticated = _ref7.isAuthenticated, prisma = _ref7.prisma;
                isAuthenticated({
                  request: request
                });
                content = args.content, postId = args.postId;
                id = request.user.id;
                _context6.next = 6;
                return prisma.createComment({
                  content: content,
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

              case 6:
                return _context6.abrupt("return", true);

              case 7:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6);
      }));

      function addComment(_x16, _x17, _x18) {
        return _addComment.apply(this, arguments);
      }

      return addComment;
    }(),
    // 포스트 댓글 수정 및 대댓글
    updateComment: function () {
      var _updateComment = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(_, args, _ref8) {
        var request, isAuthenticated, prisma, content, postId, userId, commentId, id, isExistComment, data, newComment, updatedComment;
        return _regenerator["default"].wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                request = _ref8.request, isAuthenticated = _ref8.isAuthenticated, prisma = _ref8.prisma;
                isAuthenticated({
                  request: request
                });
                content = args.content, postId = args.postId, userId = args.userId, commentId = args.commentId;
                id = request.user.id;
                _context7.next = 6;
                return prisma.$exists.comment({
                  id: commentId
                });

              case 6:
                isExistComment = _context7.sent;

                if (!isExistComment) {
                  _context7.next = 23;
                  break;
                }

                data = {};

                if (!userId) {
                  _context7.next = 16;
                  break;
                }

                _context7.next = 12;
                return prisma.createComment({
                  content: content,
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

              case 12:
                newComment = _context7.sent;
                data["comments"] = {
                  connect: {
                    id: newComment.id
                  }
                };
                _context7.next = 17;
                break;

              case 16:
                data["content"] = content;

              case 17:
                _context7.next = 19;
                return prisma.updateComment({
                  where: {
                    id: commentId
                  },
                  data: data
                });

              case 19:
                updatedComment = _context7.sent;
                return _context7.abrupt("return", updatedComment);

              case 23:
                throw Error("잘못된 접근입니다.");

              case 24:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7);
      }));

      function updateComment(_x19, _x20, _x21) {
        return _updateComment.apply(this, arguments);
      }

      return updateComment;
    }(),
    // 댓글 삭제
    deleteComment: function () {
      var _deleteComment = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(_, args, _ref9) {
        var request, isAuthenticated, prisma, commentId, id, isExistComment;
        return _regenerator["default"].wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                request = _ref9.request, isAuthenticated = _ref9.isAuthenticated, prisma = _ref9.prisma;
                isAuthenticated({
                  request: request
                });
                commentId = args.commentId;
                id = request.user.id;
                _context8.next = 6;
                return prisma.$exists.comment({
                  id: commentId,
                  user: {
                    id: id
                  }
                });

              case 6:
                isExistComment = _context8.sent;

                if (!isExistComment) {
                  _context8.next = 11;
                  break;
                }

                return _context8.abrupt("return", prisma.deleteComment({
                  id: postId
                }));

              case 11:
                throw Error("잘못된 접근입니다.");

              case 12:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8);
      }));

      function deleteComment(_x22, _x23, _x24) {
        return _deleteComment.apply(this, arguments);
      }

      return deleteComment;
    }(),
    // 포스트 좋아요 / 취소
    likePost: function () {
      var _likePost = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9(_, args, _ref10) {
        var request, isAuthenticated, prisma, postId, id, filterOptions, isExistLike;
        return _regenerator["default"].wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                request = _ref10.request, isAuthenticated = _ref10.isAuthenticated, prisma = _ref10.prisma;
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

                _context9.next = 7;
                return prisma.$exists.like(filterOptions);

              case 7:
                isExistLike = _context9.sent;

                if (!isExistLike) {
                  _context9.next = 13;
                  break;
                }

                _context9.next = 11;
                return prisma.deleteManyLikes(filterOptions);

              case 11:
                _context9.next = 15;
                break;

              case 13:
                _context9.next = 15;
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
                return _context9.abrupt("return", true);

              case 16:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9);
      }));

      function likePost(_x25, _x26, _x27) {
        return _likePost.apply(this, arguments);
      }

      return likePost;
    }(),
    // 포스트 권한 요청
    acceptPost: function () {
      var _acceptPost = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10(_, args, _ref11) {
        var request, isAuthenticated, prisma, postId, id, isExistAccept;
        return _regenerator["default"].wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                request = _ref11.request, isAuthenticated = _ref11.isAuthenticated, prisma = _ref11.prisma;
                isAuthenticated({
                  request: request
                });
                postId = args.postId;
                id = request.user.id; // 특정 포스트의 요청 유무 판별

                _context10.next = 6;
                return prisma.$exists.accept({
                  AND: [{
                    user: {
                      id: id
                    }
                  }, {
                    post: {
                      id: postId
                    }
                  }]
                });

              case 6:
                isExistAccept = _context10.sent;

                if (isExistAccept) {
                  _context10.next = 13;
                  break;
                }

                _context10.next = 10;
                return prisma.createAccept({
                  user: {
                    connect: {
                      id: id
                    }
                  },
                  post: {
                    connect: {
                      id: postId
                    }
                  },
                  status: "REQUEST"
                });

              case 10:
                return _context10.abrupt("return", true);

              case 13:
                return _context10.abrupt("return", false);

              case 14:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10);
      }));

      function acceptPost(_x28, _x29, _x30) {
        return _acceptPost.apply(this, arguments);
      }

      return acceptPost;
    }(),
    // 포스트 요청 수락 / 취소
    confirmAccept: function () {
      var _confirmAccept = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11(_, args, _ref12) {
        var request, isAuthenticated, prisma, acceptId, postId, userId, status, accept, postRoom;
        return _regenerator["default"].wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                request = _ref12.request, isAuthenticated = _ref12.isAuthenticated, prisma = _ref12.prisma;
                isAuthenticated({
                  request: request
                });
                acceptId = args.acceptId, postId = args.postId, userId = args.userId, status = args.status; // 해당 요청자의 포스트 유무 판별

                _context11.next = 5;
                return prisma.accept({
                  id: acceptId
                });

              case 5:
                accept = _context11.sent;

                if (!accept) {
                  _context11.next = 23;
                  break;
                }

                _context11.next = 9;
                return prisma.updateAccept({
                  data: {
                    status: status
                  },
                  where: {
                    id: acceptId
                  }
                });

              case 9:
                _context11.next = 11;
                return prisma.post({
                  id: postId
                }).room();

              case 11:
                postRoom = _context11.sent;

                if (!(status === "RESOLVE")) {
                  _context11.next = 17;
                  break;
                }

                _context11.next = 15;
                return prisma.updateMessageRoom({
                  data: {
                    participants: {
                      connect: {
                        id: userId
                      }
                    }
                  },
                  where: {
                    id: postRoom.id
                  }
                });

              case 15:
                _context11.next = 20;
                break;

              case 17:
                if (!(status === "REJECT" && accept.status === "RESOLVE")) {
                  _context11.next = 20;
                  break;
                }

                _context11.next = 20;
                return prisma.updateMessageRoom({
                  data: {
                    participants: {
                      disconnect: {
                        id: userId
                      }
                    }
                  },
                  where: {
                    id: postRoom.id
                  }
                });

              case 20:
                return _context11.abrupt("return", true);

              case 23:
                return _context11.abrupt("return", false);

              case 24:
              case "end":
                return _context11.stop();
            }
          }
        }, _callee11);
      }));

      function confirmAccept(_x31, _x32, _x33) {
        return _confirmAccept.apply(this, arguments);
      }

      return confirmAccept;
    }()
  },
  // computed
  Post: {
    // 내가 좋아요 했는지 여부
    isLiked: function isLiked(_ref13, _, _ref14) {
      var id = _ref13.id;
      var user = _ref14.request.user,
          prisma = _ref14.prisma;
      return prisma.$exists.like({
        AND: [{
          user: {
            id: user.id
          },
          post: {
            id: id
          }
        }]
      });
    },
    // 허용 받은 포스트 여부
    isAccepted: function isAccepted(parent, _, _ref15) {
      var user = _ref15.request.user,
          prisma = _ref15.prisma;
      return prisma.$exists.accept({
        AND: [{
          user: {
            id: user.id
          },
          post: {
            id: parent.id
          },
          status: "RESOLVE"
        }]
      });
    },
    // 포스트의 좋아요 수
    likeCount: function likeCount(parent, _, _ref16) {
      var prisma = _ref16.prisma;
      return prisma.likesConnection({
        where: {
          post: {
            id: parent.id
          }
        }
      }).aggregate().count();
    },
    // 포스트의 댓글 수
    commentCount: function commentCount(parent, _, _ref17) {
      var user = _ref17.request.user,
          prisma = _ref17.prisma;
      return prisma.commentsConnection({
        where: {
          user: {
            id: user.id
          },
          post: {
            id: parent.id
          }
        }
      }).aggregate().count();
    },
    // 포스트 작성자가 허용한 요청 수
    acceptCount: function acceptCount(parent, _, _ref18) {
      var prisma = _ref18.prisma;
      return prisma.acceptsConnection({
        where: {
          post: {
            id: parent.id
          },
          status: "RESOLVE"
        }
      }).aggregate().count();
    },
    // 허용 요청 대기 목록
    accepts: function accepts(parent, _, _ref19) {
      var prisma = _ref19.prisma;
      return prisma.post({
        id: parent.id
      }).accepts({
        where: {
          status: "REQUEST"
        }
      }).$fragment(ACCEPT_FRAGMENT);
    },
    // 내가 작성한 포스트 여부
    isMyPost: function isMyPost(parent, _, _ref20) {
      var user = _ref20.request.user,
          prisma = _ref20.prisma;
      return parent.user.id === user.id;
    }
  }
};