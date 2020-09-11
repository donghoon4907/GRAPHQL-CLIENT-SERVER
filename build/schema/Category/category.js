"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

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
    categories: function () {
      var _categories = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(_, args, _ref) {
        var prisma, _args$skip, skip, _args$first, first, _args$orderBy, orderBy;

        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                prisma = _ref.prisma;
                _args$skip = args.skip, skip = _args$skip === void 0 ? 0 : _args$skip, _args$first = args.first, first = _args$first === void 0 ? 30 : _args$first, _args$orderBy = args.orderBy, orderBy = _args$orderBy === void 0 ? "useCount_DESC" : _args$orderBy;
                return _context.abrupt("return", prisma.categories({
                  first: first,
                  skip: skip,
                  orderBy: orderBy
                }));

              case 3:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function categories(_x, _x2, _x3) {
        return _categories.apply(this, arguments);
      }

      return categories;
    }()
  }
};