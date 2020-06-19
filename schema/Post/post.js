const { prisma } = require("../../generated/prisma-client");
const { POST_FRAGMENT } = require("../../fragment/post");

module.exports = {
  Query: {
    // 포스트 검색
    getPosts: async (_, args) => {
      const { skip, first, searchKeyword, orderBy } = args;

      const orFilter = [];

      if (searchKeyword) {
        orFilter.push({ title_contains: searchKeyword });
        orFilter.push({ description_contains: searchKeyword });
      }
      const where = orFilter.length > 0 ? { OR: orFilter } : {};

      const posts = await prisma.posts({
        first,
        skip,
        where,
        orderBy
      });

      const count = await prisma
        .postsConnection({ where })
        .aggregate()
        .count();

      return {
        posts,
        count
      };
    },
    // 포스트 상세 정보
    getUser: (_, args) => {
      const { postId } = args;

      return prisma.post({ id: postId }).$fragment(POST_FRAGMENT);
    },
    // 피드 검색
    getFeed: async (_, __, { request, isAuthenticated }) => {
      isAuthenticated({ request });
      const { skip, first, orderBy } = args;
      const {
        user: { id }
      } = request;

      const following = await prisma.user({ id }).following();

      return prisma.posts({
        where: {
          user: {
            id_in: following.map((user) => user.id)
          }
        },
        first,
        skip,
        orderBy
      });
    }
  },
  Mutation: {
    // 포스트 추가
    addPost: async (_, args, { request, isAuthenticated }) => {
      isAuthenticated({ request });
      const { title, description, files } = args;
      const {
        user: { id }
      } = request;

      const newPost = await prisma.createPost({
        title,
        description,
        user: {
          connect: { id }
        }
      });
      files.forEach(
        async (file) =>
          await prisma.createFile({
            url: file,
            post: {
              connect: { id: newPost.id }
            }
          })
      );
      return newPost;
    },
    // 포스트 수정
    updatePost: async (_, args, { request, isAuthenticated }) => {
      isAuthenticated({ request });
      const { title, description, files, postId } = args;
      const {
        user: { id }
      } = request;

      const isExistPost = await prisma.$exists.post({
        id: PostId,
        user: {
          id
        }
      });

      if (isExistPost) {
        const updatedPost = await prisma.updatePost({
          where: { id: postId },
          data: {
            title,
            description
          }
        });
        const filterOptions = {
          post: { id: postId }
        };
        if (files.length > 0) {
          // 이전에 등록한 파일 삭제
          const isExistFile = await prisma.$exists.file(filterOptions);
          if (isExistFile) {
            await prisma.deleteManyFiles(filterOptions);
          }
          files.forEach(
            async (file) =>
              await prisma.createFile({
                url: file,
                post: {
                  connect: { id: postId }
                }
              })
          );
        }

        return updatedPost;
      } else {
        throw Error("잘못된 쩝근입니다.");
      }
    },
    // 포스트 삭제
    deletePost: async (_, args, { request, isAuthenticated }) => {
      isAuthenticated({ request });
      const { postId } = args;
      const {
        user: { id }
      } = request;

      const isExistPost = await prisma.$exists.post({
        id: PostId,
        user: {
          id
        }
      });

      if (isExistPost) {
        return prisma.deletePost({ id: postId });
      } else {
        throw Error("잘못된 쩝근입니다.");
      }
    },
    // 포스트 댓글 추가
    addComment: async (_, args, { request, isAuthenticated }) => {
      isAuthenticated({ request });
      const { content, postId } = args;
      const {
        user: { id }
      } = request;

      const newComment = await prisma.createComment({
        content,
        user: {
          connect: { id }
        },
        post: {
          connect: { id: postId }
        }
      });

      return newComment;
    },
    // 포스트 댓글 수정 및 대댓글
    updateComment: async (_, args, { request, isAuthenticated }) => {
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
    deletePost: async (_, args, { request, isAuthenticated }) => {
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
        throw Error("잘못된 쩝근입니다.");
      }
    },
    // 포스트 좋아요 / 취소
    likePost: async (_, args, { request, isAuthenticated }) => {
      isAuthenticated({ request });
      const { postId } = args;
      const {
        user: { id }
      } = request;
      // 특정 포스트의 좋아요 유무 판별
      try {
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
        const isExistLike = await prisma.$exists.like(filterOptions);
        if (isExistLike) {
          // unlike
          await prisma.deleteManyLikes(filterOptions);
          return true;
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
      } catch {
        return false;
      }
    },
    // 포스트 요청 수락 / 취소
    acceptPost: async (_, args, { request, isAuthenticated }) => {
      isAuthenticated({ request });
      const { postId } = args;
      const {
        user: { id }
      } = request;
      // 특정 포스트의 요청 유무 판별
      try {
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
        const isExistAccept = await prisma.$exists.accept(filterOptions);
        if (isExistAccept) {
          // cancel
          await prisma.deleteManyAccepts(filterOptions);
          return true;
        } else {
          // like
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
            }
          });
        }
        return true;
      } catch {
        return false;
      }
    }
  },
  // computed
  Post: {
    // 내가 좋아요 했는지 여부
    isLiked: (parent, _, { request }) => {
      const {
        user: { id }
      } = request;
      const { id: parentId } = parent;
      return prisma.$exists.like({
        AND: [
          {
            user: {
              id
            },
            post: {
              id: parentId
            }
          }
        ]
      });
    },
    // 내가 요청 했는지 여부
    isAccepted: (parent, _, { request }) => {
      const {
        user: { id }
      } = request;
      const { id: parentId } = parent;
      return prisma.$exists.accept({
        AND: [
          {
            user: {
              id
            },
            post: {
              id: parentId
            }
          }
        ]
      });
    },
    // 포스트의 좋아요 수
    likeCount: (parent) => {
      return prisma
        .likesConnection({ where: { post: { id: parent.id } } })
        .aggregate()
        .count();
    }
  }
};
