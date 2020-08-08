module.exports = {
  Query: {
    // 연관 검색어
    getSearchKeyword: (_, args, { prisma }) => {
      const {
        skip = 0,
        first = 5,
        orderBy = "createdAt_DESC",
        searchKeyword
      } = args;

      const orFilter = [{ keyword_contains: searchKeyword }];

      const where =
        orFilter.length > 0
          ? {
              OR: orFilter
            }
          : {};

      return prisma.searchKeywords({
        first,
        skip,
        where,
        orderBy
      });
    }
  }
};
