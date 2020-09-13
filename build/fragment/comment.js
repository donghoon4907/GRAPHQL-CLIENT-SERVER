"use strict";

exports.COMMENTS_FRAGMENT = "\n  fragment CommentsParts on Notice {\n    id\n    user {\n      id\n      nickname\n      avatar {\n        url\n      }\n    }\n    post {\n      id\n      commentCount\n    }\n    content\n    createdAt\n    updatedAt\n  }\n";
exports.COMMENT_FRAGMENT = "\n  fragment CommentParts on Notice {\n    id\n    user {\n      id\n      nickname\n      avatar {\n        url\n      }\n    }\n    post {\n      id\n      commentCount\n    }\n    content\n    createdAt\n    updatedAt\n  }\n";