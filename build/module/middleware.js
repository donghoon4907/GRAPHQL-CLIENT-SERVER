"use strict";

exports.isAuthenticated = function (_ref) {
  var user = _ref.request.user;

  if (!user) {
    throw Error(JSON.stringify({
      message: "세션이 만료되었습니다. 로그인 페이지로 이동합니다.",
      status: 401
    }));
  }

  return;
};