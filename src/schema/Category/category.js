module.exports = {
  Query: {
    /**
     * * 카테고리 검색
     *
     * @query
     * @author frisk
     * @param {number?} args.skip 건너뛸 목록의 수
     * @param {number?} args.first 요청 목록의 수
     * @param {string?} args.orderBy 정렬
     * @returns Notice[]
     */
    categories: async (_, args, { prisma }) => {
      const { skip = 0, first = 30, orderBy = "useCount_DESC" } = args;

      return prisma.categories({
        first,
        skip,
        orderBy
      });
    }
  }
};
