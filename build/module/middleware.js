"use strict";

exports.isAuthenticated = function (_ref) {
  var user = _ref.request.user;

  if (!user) {
    throw Error("세션이 만료되었습니다. 로그인 페이지로 이동합니다.");
  }

  return;
};