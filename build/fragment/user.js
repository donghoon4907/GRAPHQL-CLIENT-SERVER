"use strict";

exports.USERS_FRAGMENT = "\n  fragment UsersParts on User {\n    id\n    nickname \n    isMaster\n    createdAt\n    updatedAt\n    postCount\n    avatar {\n      url\n    }\n  }\n";
exports.MY_FRAGMENT = "\n  fragment myParts on User {\n    id\n    nickname \n    isMaster\n    createdAt\n    updatedAt\n    postCount\n    avatar {\n      url\n    }\n  }\n";