"use strict";

module.exports = {
  Query: {
    // 연관 검색어
    getSearchKeyword: function getSearchKeyword(_, args, _ref) {
      var prisma = _ref.prisma;
      var _args$skip = args.skip,
          skip = _args$skip === void 0 ? 0 : _args$skip,
          _args$first = args.first,
          first = _args$first === void 0 ? 5 : _args$first,
          _args$orderBy = args.orderBy,
          orderBy = _args$orderBy === void 0 ? "createdAt_DESC" : _args$orderBy,
          searchKeyword = args.searchKeyword;
      var orFilter = [{
        keyword_contains: searchKeyword
      }];
      var where = orFilter.length > 0 ? {
        OR: orFilter
      } : {};
      return prisma.searchKeywords({
        first: first,
        skip: skip,
        where: where,
        orderBy: orderBy
      });
    }
  }
};