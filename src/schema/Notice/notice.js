const { NOTICE_FRAGMENT } = require("../../fragment/notice");

module.exports = {
  Query: {
    /**
     * * 공지사항 검색
     *
     * @query
     * @author frisk
     * @param {number?} args.skip 건너뛸 목록의 수
     * @param {number?} args.first 요청 목록의 수
     * @param {string?} args.orderBy 정렬
     * @returns Notice[]
     */
    notices: async (_, args, { prisma }) => {
      const { skip = 0, first = 30, orderBy = "createdAt_DESC" } = args;

      return prisma
        .notices({
          first,
          skip,
          orderBy
        })
        .$fragment(NOTICE_FRAGMENT);
    },
    /**
     * * 공지사항 상세 조회
     *
     * @query
     * @author frisk
     * @param {string} args.id 공지사항 ID
     * @returns Notice
     */
    notice: (_, args, { prisma }) => {
      const { id } = args;

      return prisma.notice({ id });
    }
  },
  Mutation: {
    /**
     * * 공지사항 등록
     *
     * @mutation
     * @author frisk
     * @param {string} args.title 제목
     * @param {string} args.description 내용
     * @returns boolean
     */
    createNotice: async (_, args, { request, isAuthenticated, prisma }) => {
      /**
       * 인증 확인
       */
      isAuthenticated({ request });

      const { title, description } = args;

      await prisma.createNotice({
        title,
        description
      });

      return true;
    },
    /**
     * * 공지사항 수정
     *
     * @mutation
     * @author frisk
     * @param {string} args.id 공지사항 ID
     * @param {string} args.title 제목
     * @param {string} args.description 내용
     * @returns boolean
     */
    updateNotice: async (_, args, { request, isAuthenticated, prisma }) => {
      /**
       * 인증 확인
       */
      isAuthenticated({ request });
      const { id, title, description } = args;

      /**
       * 공지사항 유무 확인
       * @type {boolean}
       */
      const isExistNotice = await prisma.$exists.notice({ id });

      if (!isExistNotice) {
        throw Error(
          JSON.stringify({
            message: "존재하지 않는 공지사항입니다.",
            status: 403
          })
        );
      }

      await prisma.updateNotice({
        where: { id },
        data: {
          title,
          description
        }
      });

      return true;
    },
    /**
     * * 공지사항 삭제
     *
     * @mutation
     * @author frisk
     * @param {string} args.id 공지사항 ID
     * @returns boolean
     */
    deleteNotice: async (_, args, { request, isAuthenticated, prisma }) => {
      /**
       * 인증 확인
       */
      isAuthenticated({ request });

      const { id } = args;

      /**
       * 공지사항 유무 확인
       * @type {boolean}
       */
      const isExistNotice = await prisma.$exists.notice({ id });

      if (!isExistNotice) {
        throw Error(
          JSON.stringify({
            message: "존재하지 않는 공지사항입니다.",
            status: 403
          })
        );
      }

      await prisma.deleteNotice({ id });

      return true;
    }
  }
};
