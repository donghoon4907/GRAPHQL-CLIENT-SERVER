"use strict";

exports.POST_FRAGMENT = "\n  fragment PostParts on Post {\n    id\n    title \n    description\n    createdAt\n    updatedAt \n    video {\n      url\n      url_240p\n      url_320p\n      url_480p\n      url_720p\n      url_1080p\n    }\n    user {\n      id\n      nickname\n      avatar {\n        url\n      }\n    }\n    likes {\n      id \n    }\n    status\n    room {\n      id\n    }\n  }\n";
exports.ACCEPT_FRAGMENT = "\n  fragment AcceptParts on Accept {\n    id\n    user {\n      id\n      nickname\n      avatar {\n        url\n      }\n    }\n  }\n";