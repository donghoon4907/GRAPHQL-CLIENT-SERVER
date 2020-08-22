const { POST_FRAGMENT } = require("../../fragment/post");
const moment = require("moment");

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

        // const from = moment();
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
              id_in: following.map(user => user.id)
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
      const {
        user: { id }
      } = request;

      await prisma.createPost({
        title,
        description,
        status,
        user: {
          connect: { id }
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
                id
              }
            }
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
    }
  },
  // computed
  Post: {
    // 내가 좋아요 했는지 여부
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
