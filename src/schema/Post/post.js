const { POST_FRAGMENT, ACCEPT_FRAGMENT } = require("../../fragment/post");

module.exports = {
  Query: {
    // 포스트 검색
    getPosts: async (_, args, { prisma }) => {
      const {
        skip = 0,
        first = 30,
        orderBy = "createdAt_DESC",
        searchKeyword
      } = args;

      const orFilter = [];

      if (searchKeyword) {
        orFilter.push({ title_contains: searchKeyword });
        orFilter.push({ description_contains: searchKeyword });
      }
      const where =
        orFilter.length > 0
          ? {
              OR: orFilter
              // video: {
              //   status: "complete"
              // }
            }
          : {};

      return prisma
        .posts({
          first,
          skip,
          where,
          orderBy
        })
        .$fragment(POST_FRAGMENT);
    },
    // 포스트 상세 정보
    getPost: (_, args, { prisma }) => {
      const { postId } = args;

      return prisma.post({ id: postId }).$fragment(POST_FRAGMENT);
    },
    // 피드 검색
    getFeed: async (_, args, { request, isAuthenticated, prisma }) => {
      isAuthenticated({ request });
      const { skip = 0, first = 30, orderBy = "createdAt_DESC" } = args;
      const {
        user: { id }
      } = request;
      const following = await prisma.user({ id }).following();

      return prisma
        .posts({
          where: {
            user: {
              id_in: following.map((user) => user.id)
            },
            video: {
              status: "complete"
            }
          },
          first,
          skip,
          orderBy
        })
        .$fragment(POST_FRAGMENT);
    }
  },
  Mutation: {
    // 포스트 추가
    addPost: async (_, args, { request, isAuthenticated, prisma }) => {
      isAuthenticated({ request });
      const { title, description, status, file } = args;
      const { user } = request;

      const video = await prisma.createVideo({
        url: file,
        status: "queue"
      });

      const newPost = await prisma.createPost({
        title,
        description,
        status,
        user: {
          connect: { id: user.id }
        },
        video: {
          connect: { id: video.id }
        }
      });

      await prisma.createMessageRoom({
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
      return true;
    },
    // 포스트 수정
    updatePost: async (_, args, { request, isAuthenticated, prisma }) => {
      isAuthenticated({ request });
      const { postId, title, description, status } = args;

      const isExistPost = await prisma.$exists.post({
        id: postId
      });

      if (isExistPost) {
        await prisma.updatePost({
          where: { id: postId },
          data: {
            title,
            description,
            status
          }
        });
        return true;
      } else {
        return false;
      }
    },
    // 포스트 삭제
    deletePost: async (_, args, { request, isAuthenticated, prisma }) => {
      isAuthenticated({ request });
      const { postId } = args;

      const isExistPost = await prisma.$exists.post({
        id: postId
      });

      if (isExistPost) {
        await prisma.deletePost({ id: postId });
        return true;
      } else {
        return false;
      }
    },
    // 포스트 댓글 추가
    addComment: async (_, args, { request, isAuthenticated, prisma }) => {
      isAuthenticated({ request });
      const { content, postId } = args;
      const {
        user: { id }
      } = request;

      await prisma.createComment({
        content,
        user: {
          connect: { id }
        },
        post: {
          connect: { id: postId }
        }
      });

      return true;
    },
    // 포스트 댓글 수정 및 대댓글
    updateComment: async (_, args, { request, isAuthenticated, prisma }) => {
      isAuthenticated({ request });
      const { content, postId, userId, commentId } = args;
      const {
        user: { id }
      } = request;

      const isExistComment = await prisma.$exists.comment({ id: commentId });

      if (isExistComment) {
        const data = {};

        if (userId) {
          const newComment = await prisma.createComment({
            content,
            user: {
              connect: { id }
            },
            post: {
              connect: { id: postId }
            }
          });
          data["comments"] = {
            connect: { id: newComment.id }
          };
        } else {
          data["content"] = content;
        }

        const updatedComment = await prisma.updateComment({
          where: { id: commentId },
          data
        });

        return updatedComment;
      } else {
        throw Error("잘못된 접근입니다.");
      }
    },
    // 댓글 삭제
    deleteComment: async (_, args, { request, isAuthenticated, prisma }) => {
      isAuthenticated({ request });
      const { commentId } = args;
      const {
        user: { id }
      } = request;

      const isExistComment = await prisma.$exists.comment({
        id: commentId,
        user: {
          id
        }
      });

      if (isExistComment) {
        return prisma.deleteComment({ id: postId });
      } else {
        throw Error("잘못된 접근입니다.");
      }
    },
    // 포스트 좋아요 / 취소
    likePost: async (_, args, { request, isAuthenticated, prisma }) => {
      isAuthenticated({ request });
      const { postId } = args;
      const {
        user: { id }
      } = request;

      const filterOptions = {
        AND: [
          {
            user: {
              id
            }
          },
          {
            post: {
              id: postId
            }
          }
        ]
      };
      // 특정 포스트의 좋아요 유무 판별
      const isExistLike = await prisma.$exists.like(filterOptions);

      if (isExistLike) {
        // unlike
        await prisma.deleteManyLikes(filterOptions);
      } else {
        // like
        await prisma.createLike({
          user: {
            connect: {
              id
            }
          },
          post: {
            connect: {
              id: postId
            }
          }
        });
      }

      return true;
    },
    // 포스트 권한 요청
    acceptPost: async (_, args, { request, isAuthenticated, prisma }) => {
      isAuthenticated({ request });
      const { postId } = args;
      const {
        user: { id }
      } = request;
      // 특정 포스트의 요청 유무 판별
      const isExistAccept = await prisma.$exists.accept({
        AND: [
          {
            user: {
              id
            }
          },
          {
            post: {
              id: postId
            }
          }
        ]
      });
      if (!isExistAccept) {
        await prisma.createAccept({
          user: {
            connect: {
              id
            }
          },
          post: {
            connect: {
              id: postId
            }
          },
          status: "REQUEST"
        });

        return true;
      } else {
        return false;
      }
    },
    // 포스트 요청 수락 / 취소
    confirmAccept: async (_, args, { request, isAuthenticated, prisma }) => {
      isAuthenticated({ request });
      const { acceptId, postId, userId, status } = args;

      // 해당 요청자의 포스트 유무 판별
      const accept = await prisma.accept({
        id: acceptId
      });

      if (accept) {
        await prisma.updateAccept({
          data: {
            status
          },
          where: {
            id: acceptId
          }
        });

        const postRoom = await prisma.post({ id: postId }).room();

        if (status === "RESOLVE") {
          await prisma.updateMessageRoom({
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
        } else if (status === "REJECT" && accept.status === "RESOLVE") {
          await prisma.updateMessageRoom({
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
        }

        return true;
      } else {
        return false;
      }
    }
  },
  // computed
  Post: {
    // 내가 좋아요 했는지 여부
    isLiked: ({ id }, _, { request: { user }, prisma }) => {
      return prisma.$exists.like({
        AND: [
          {
            user: {
              id: user.id
            },
            post: {
              id
            }
          }
        ]
      });
    },
    // 허용 받은 포스트 여부
    isAccepted: (parent, _, { request: { user }, prisma }) => {
      return prisma.$exists.accept({
        AND: [
          {
            user: {
              id: user.id
            },
            post: {
              id: parent.id
            },
            status: "RESOLVE"
          }
        ]
      });
    },
    // 포스트의 좋아요 수
    likeCount: (parent, _, { prisma }) => {
      return prisma
        .likesConnection({ where: { post: { id: parent.id } } })
        .aggregate()
        .count();
    },
    // 포스트의 댓글 수
    commentCount: (parent, _, { request: { user }, prisma }) => {
      return prisma
        .commentsConnection({
          where: {
            user: {
              id: user.id
            },
            post: {
              id: parent.id
            }
          }
        })
        .aggregate()
        .count();
    },
    // 포스트 작성자가 허용한 요청 수
    acceptCount: (parent, _, { prisma }) => {
      return prisma
        .acceptsConnection({
          where: {
            post: {
              id: parent.id
            },
            status: "RESOLVE"
          }
        })
        .aggregate()
        .count();
    },
    // 허용 요청 대기 목록
    accepts: (parent, _, { prisma }) => {
      return prisma
        .post({ id: parent.id })
        .accepts({ where: { status: "REQUEST" } })
        .$fragment(ACCEPT_FRAGMENT);
    },
    // 내가 작성한 포스트 여부
    isMyPost: (parent, _, { request: { user }, prisma }) =>
      parent.user.id === user.id
  }
};
