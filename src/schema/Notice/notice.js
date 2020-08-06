const { NOTICE_FRAGMENT } = require("../../fragment/notice");

module.exports = {
  Query: {
    // 공지 검색
    getNotices: async (_, args, { prisma }) => {
      const { skip = 0, first = 30, orderBy = "createdAt_DESC" } = args;

      return prisma
        .notices({
          first,
          skip,
          orderBy
        })
        .$fragment(NOTICE_FRAGMENT);
    },
    // 공지 상세 정보
    getNotice: (_, args, { prisma }) => {
      const { noticeId } = args;

      return prisma.notice({ id: noticeId });
    }
  },
  Mutation: {
    // 공지 추가
    addNotice: async (_, args, { request, isAuthenticated, prisma }) => {
      isAuthenticated({ request });
      const { title, description } = args;

      await prisma.createNotice({
        title,
        description
      });

      return true;
    },
    // 공지 수정
    updateNotice: async (_, args, { request, isAuthenticated, prisma }) => {
      isAuthenticated({ request });
      const { noticeId, title, description } = args;

      const isExistNotice = await prisma.$exists.notice({
        id: noticeId
      });

      if (isExistNotice) {
        await prisma.updateNotice({
          where: { id: noticeId },
          data: {
            title,
            description
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
      const { noticeId } = args;

      const isExistNotice = await prisma.$exists.notice({
        id: noticeId
      });

      if (isExistNotice) {
        await prisma.deleteNotice({ id: noticeId });
        return true;
      } else {
        return false;
      }
    }
  }
};
