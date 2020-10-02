const { POSTS_FRAGMENT, POST_FRAGMENT } = require("../../fragment/post");
const moment = require("moment");

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
    posts: async (_, args, { prisma }) => {
      const {
        skip = 0,
        first = 30,
        orderBy = "createdAt_DESC",
        query,
        category,
        userId
      } = args;

      /**
       * 필터 목록
       * @type {Array<object>}
       */
      const orFilter = [];
      /**
       * 검색어 조건 추가 시
       */
      if (query) {
        /**
         * 제목 및 내용 like 조건 추가
         */
        orFilter.push({ title_contains: query });
        orFilter.push({ description_contains: query });
      }
      /**
       * 카테고리 조건 추가 시
       */
      if (category) {
        orFilter.push({ category });
      }
      /**
       * 사용자 조건 추가 시
       */
      if (userId) {
        orFilter.push({ user: { id: userId } });
      }

      const where =
        orFilter.length > 0
          ? {
              OR: orFilter
            }
          : {};
      /**
       * 목록
       */
      const posts = await prisma
        .posts({
          first,
          skip,
          where,
          orderBy
        })
        .$fragment(POSTS_FRAGMENT);
      /**
       * 목록 총 갯수
       */
      const total = await prisma
        .postsConnection({
          where
        })
        .aggregate()
        .count();

      return {
        data: posts,
        total
      };
    },
    /**
     * * 게시물 상세 조회
     *
     * @query
     * @author frisk
     * @param {string} args.id 게시물 ID
     * @returns Post
     */
    post: async (_, args, { request, prisma }) => {
      const { id } = args;

      /**
       * 게시물 중복 확인
       * @type {Post|null}
       */
      const findPost = await prisma.post({ id });

      if (findPost) {
        /**
         * 사용자의 IP
         */
        const ip =
          request.headers["x-forwarded-for"] ||
          request.connection.remoteAddress ||
          request.socket.remoteAddress ||
          request.connection.socket.remoteAddress;

        /**
         * 오늘 범위값 설정
         */
        const from = moment();
        from.set({ hour: 0, minute: 0, second: 0 });
        const to = moment();
        to.set({ hour: 23, minute: 59, second: 59 });

        /**
         * 접근 내역 확인
         * @type {boolean}
         */
        const isExistHistory = await prisma.$exists.history({
          ip,
          createdAt_gt: from,
          createdAt_lt: to,
          post: {
            id
          }
        });

        if (!isExistHistory) {
          /**
           * 접근 내역 추가
           */
          await prisma.createHistory({
            ip,
            post: {
              connect: {
                id
              }
            }
          });

          /**
           * 조회수 증가
           */
          await prisma.updatePost({
            where: {
              id
            },
            data: {
              viewCount: findPost.viewCount + 1
            }
          });
        }
      } else {
        throw Error(
          JSON.stringify({
            message: "존재하지 않는 게시물입니다.",
            status: 403
          })
        );
      }

      return prisma.post({ id }).$fragment(POST_FRAGMENT);
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
     * @param {string} args.isTemp 임시저장 여부
     * @param {string[]} categories 카테고리 목록
     * @returns boolean
     */
    createPost: async (_, args, { request, isAuthenticated, prisma }) => {
      /**
       * 인증 확인
       */
      await isAuthenticated({ request });

      const {
        user: { id, postCount }
      } = request;

      const { title, description, content, category, thumbnail } = args;

      /**
       * 게시물 추가
       */
      await prisma.createPost({
        title,
        description,
        content,
        category,
        user: {
          connect: { id }
        },
        thumbnail
      });

      /**
       * 카테고리 중복 확인
       * @type {Category|null}
       */
      const findCategory = await prisma.category({ content: category });

      if (findCategory) {
        /**
         * 카테고리 사용수 + 1
         */
        await prisma.updateCategory({
          data: {
            useCount: findCategory.useCount + 1
          },
          where: {
            content: category
          }
        });
      } else {
        /**
         * 카테고리 생성
         */
        await prisma.createCategory({
          content: category,
          useCount: 1
        });
      }

      /**
       * 사용자 포스트 수 증가
       */
      await prisma.updateUser({
        where: { id },
        data: {
          postCount: postCount + 1
        }
      });

      return true;
    },
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
    updatePost: async (_, args, { request, isAuthenticated, prisma }) => {
      /**
       * 인증 확인
       */
      await isAuthenticated({ request });

      const { id, title, description, content, category, thumbnail } = args;

      /**
       * 게시물 유무 확인
       * @type {boolean}
       */
      const findPost = await prisma.post({ id });

      if (!findPost) {
        throw Error(
          JSON.stringify({
            message: "존재하지 않는 게시물입니다.",
            status: 403
          })
        );
      }

      await prisma.updatePost({
        where: { id },
        data: {
          title,
          description,
          content,
          category,
          thumbnail
        }
      });
      /**
       * 기존과 다르게 설정한 경우
       */
      if (findPost.category !== category) {
        /**
         * 카테고리 중복 확인
         * @type {Category|null}
         */
        const findCategory = await prisma.category({ content: category });

        if (findCategory) {
          /**
           * 카테고리 사용수 + 1
           */
          await prisma.updateCategory({
            data: {
              useCount: findCategory.useCount + 1
            },
            where: {
              content: category
            }
          });
        } else {
          /**
           * 카테고리 생성
           */
          await prisma.createCategory({
            content: category,
            useCount: 1
          });
        }
      }

      return true;
    },
    /**
     * * 게시물 삭제
     *
     * @mutation
     * @author frisk
     * @param {string} args.id 게시물 ID
     * @returns boolean
     */
    deletePost: async (_, args, { request, isAuthenticated, prisma }) => {
      /**
       * 인증 확인
       */
      await isAuthenticated({ request });

      const { user } = request;

      const { id } = args;

      /**
       * 게시물 유무 확인
       * @type {boolean}
       */
      const isExistPost = await prisma.$exists.post({ id });

      if (!isExistPost) {
        throw Error(
          JSON.stringify({
            message: "존재하지 않는 게시물입니다.",
            status: 403
          })
        );
      }

      await prisma.deletePost({ id });

      /**
       * 사용자 포스트 수 감소
       */
      await prisma.updateUser({
        where: { id: user.id },
        data: {
          postCount: user.postCount - 1
        }
      });

      return true;
    },
    /**
     * * 게시물 좋아요 / 좋아요 취소
     *
     * @mutation
     * @author frisk
     * @param {string} args.id 게시물 ID
     * @returns boolean
     */
    likePost: async (_, args, { request, isAuthenticated, prisma }) => {
      /**
       * 인증 확인
       */
      await isAuthenticated({ request });

      const { user } = request;

      const { id } = args;

      /**
       * 좋아요 요청 공통 옵션
       * @type {object}
       */
      const options = {
        AND: [
          {
            user: {
              id: user.id
            }
          },
          {
            post: {
              id
            }
          }
        ]
      };

      /**
       * 게시물 유무 확인
       * @type {boolean}
       */
      const findPost = await prisma.post({ id });

      if (!findPost) {
        throw Error(
          JSON.stringify({
            message: "존재하지 않는 게시물입니다.",
            status: 403
          })
        );
      }

      /**
       * 좋아요 유무 판별
       * @type {boolean}
       */
      const isExistLike = await prisma.$exists.like(options);

      if (isExistLike) {
        /**
         * 좋아요 취소
         */
        await prisma.deleteManyLikes(options);

        /**
         * 게시물 좋아요 수 감소
         */
        await prisma.updatePost({
          where: { id },
          data: {
            likeCount: findPost.likeCount - 1
          }
        });
      } else {
        /**
         * 좋아요
         */
        await prisma.createLike({
          user: {
            connect: {
              id: user.id
            }
          },
          post: {
            connect: {
              id
            }
          }
        });

        /**
         * 게시물 좋아요 수 증가
         */
        await prisma.updatePost({
          where: { id },
          data: {
            likeCount: findPost.likeCount + 1
          }
        });
      }

      return true;
    }
  }
};
