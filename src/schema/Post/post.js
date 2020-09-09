const { POSTS_FRAGMENT, POST_FRAGMENT } = require("../../fragment/post");

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
      const { skip = 0, first = 30, orderBy = "createdAt_DESC", query } = args;

      /**
       * 필터 목록
       * @type {Array<object>}
       */
      const orFilter = [];

      if (query) {
        /**
         * 제목 및 내용 like 조건 추가
         */
        orFilter.push({ title_contains: query });
        orFilter.push({ description_contains: query });
      }

      const where =
        orFilter.length > 0
          ? {
              OR: orFilter,
              /**
               * 임시저장이 아닌 게시물 대상
               */
              isTemp: false
            }
          : {};

      return prisma
        .posts({
          first,
          skip,
          where,
          orderBy
        })
        .$fragment(POSTS_FRAGMENT);
    },
    /**
     * * 게시물 상세 조회
     *
     * @query
     * @author frisk
     * @param {string} args.id 게시물 ID
     * @returns Post
     */
    post: (_, args, { prisma }) => {
      const { id } = args;

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
     * @param {string[]} categories 카테고리 목록
     * @returns boolean
     */
    createPost: async (_, args, { request, isAuthenticated, prisma }) => {
      /**
       * 인증 확인
       */
      isAuthenticated({ request });

      const {
        user: { id }
      } = request;

      const { title, description, categories } = args;

      /**
       * 카테고리 매핑
       * @type {object}
       */
      const mapToCategories = {
        /**
         * 생성 목록: 새로운 카테고리
         */
        create: [],
        /**
         * 연결 목록: 기존 카테고리
         */
        connect: []
      };

      for (let i = 0; i < categories.length; i++) {
        const content = categories[i];

        /**
         * 카테고리 중복 확인
         * @type {Category|null}
         */
        const findCategory = await prisma.category({ content });

        if (findCategory) {
          /**
           * 연결 목록에 추가
           */
          mapToCategories.connect.push({
            id: findCategory.id
          });
          /**
           * 카테고리 사용수 + 1
           */
          await prisma.updateCategory({
            data: {
              useCount: findCategory.useCount + 1
            },
            where: {
              id: findCategory.id
            }
          });
        } else {
          /**
           * 생성 목록에 추가
           */
          mapToCategories.create.push({
            content
          });
        }
      }

      await prisma.createPost({
        title,
        description,
        categories: mapToCategories,
        user: {
          connect: { id }
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
      isAuthenticated({ request });

      const { id, title, description } = args;

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

      await prisma.updatePost({
        where: { id },
        data: {
          title,
          description
        }
      });

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
      isAuthenticated({ request });

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
      isAuthenticated({ request });

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
       * 좋아요 유무 판별
       */
      const isExistLike = await prisma.$exists.like(options);

      if (isExistLike) {
        /**
         * 좋아요 취소
         */
        await prisma.deleteManyLikes(options);
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
      }

      return true;
    }
  }
};
