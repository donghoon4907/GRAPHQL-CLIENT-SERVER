module.exports = {
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
    deleteNotice: async (_, args, { request, isAuthenticated, prisma }) => {
      /**
       * 인증 확인
       */
      isAuthenticated({ request });

      const { id } = args;

      /**
       * 댓글 유무 확인
       * @type {Comment|null}
       */
      const findComment = await prisma.comment({ id });

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
       * 댓글의 포스트 정보
       * @type {Post}
       */
      const postOfComment = findComment.post();

      /**
       * 포스트 댓글수 감소
       */
      await prisma.updatePost({
        where: {
          id: postOfComment.id
        },
        data: {
          commentCount: postOfComment.commentCount - 1
        }
      });

      return true;
    }
  }
};
