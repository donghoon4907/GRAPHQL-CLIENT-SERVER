const {
  COMMENTS_FRAGMENT,
  COMMENT_FRAGMENT
} = require("../../fragment/comment");

module.exports = {
  Query: {
    /**
     * * 댓글 검색
     *
     * @query
     * @author frisk
     * @param {number?} args.skip 건너뛸 목록의 수
     * @param {number?} args.first 요청 목록의 수
     * @param {string?} args.orderBy 정렬
     * @param {string?} args.postId 게시물 ID
     */
    comments: async (_, args, { prisma }) => {
      const { skip = 0, first = 30, orderBy = "createdAt_DESC", postId } = args;
      /**
       * 필터 목록
       * @type {Array<object>}
       */
      const orFilter = [];

      if (postId) {
        /**
         * 특정 게시물 조건 추가
         */
        orFilter.push({ post: { id: postId } });
      }

      const where =
        orFilter.length > 0
          ? {
              OR: orFilter
            }
          : {};

      const comments = await prisma
        .comments({
          where,
          first,
          skip,
          orderBy
        })
        .$fragment(COMMENTS_FRAGMENT);

      const total = await prisma
        .commentsConnection({
          where
        })
        .aggregate()
        .count();

      return {
        data: comments,
        total
      };
    }
  },
  Mutation: {
    /**
     * * 댓글 등록
     *
     * @mutation
     * @author frisk
     * @param {string} args.postId 게시물 ID
     * @param {string} args.content 댓글
     * @returns boolean
     */
    createComment: async (_, args, { request, isAuthenticated, prisma }) => {
      /**
       * 인증 확인
       */
      isAuthenticated({ request });

      const {
        user: { id }
      } = request;

      const { postId, content } = args;

      /**
       * 게시물 유무 확인
       * @type {Post|null}
       */
      const findPost = await prisma.post({ id: postId });

      if (!findPost) {
        throw Error(
          JSON.stringify({
            message: "존재하지 않는 게시물입니다",
            status: 403
          })
        );
      }

      /**
       * 댓글 추가
       */
      await prisma.createComment({
        content,
        post: {
          connect: {
            id: postId
          }
        },
        user: {
          connect: {
            id
          }
        }
      });

      /**
       * 포스트 댓글수 증가
       */
      await prisma.updatePost({
        where: {
          id: postId
        },
        data: {
          commentCount: findPost.commentCount + 1
        }
      });

      return true;
    },
    /**
     * * 댓글 수정
     *
     * @mutation
     * @author frisk
     * @param {string} args.id 댓글 ID
     * @param {string} args.content 댓글
     * @returns boolean
     */
    updateComment: async (_, args, { request, isAuthenticated, prisma }) => {
      /**
       * 인증 확인
       */
      isAuthenticated({ request });

      const { id, content } = args;

      /**
       * 댓글 유무 확인
       * @type {boolean}
       */
      const isExistComment = await prisma.$exists.comment({ id });

      if (!isExistComment) {
        throw Error(
          JSON.stringify({
            message: "존재하지 않는 댓글입니다.",
            status: 403
          })
        );
      }

      /**
       * 댓글 수정
       */
      await prisma.updateComment({
        where: { id },
        data: {
          content
        }
      });

      return true;
    },
    /**
     * * 댓글 삭제
     *
     * @mutation
     * @author frisk
     * @param {string} args.id 댓글 ID
     * @returns boolean
     */
    deleteComment: async (_, args, { request, isAuthenticated, prisma }) => {
      /**
       * 인증 확인
       */
      isAuthenticated({ request });

      const { id } = args;

      /**
       * 댓글 유무 확인
       * @type {Comment|null}
       */
      const findComment = await prisma
        .comment({ id })
        .$fragment(COMMENT_FRAGMENT);

      if (!findComment) {
        throw Error(
          JSON.stringify({
            message: "존재하지 않는 댓글입니다.",
            status: 403
          })
        );
      }

      /**
       * 댓글 삭제
       */
      await prisma.deleteComment({ id });

      /**
       * 포스트 댓글수 감소
       */
      await prisma.updatePost({
        where: {
          id: findComment.post.id
        },
        data: {
          commentCount: findComment.post.commentCount - 1
        }
      });

      return true;
    }
  }
};
