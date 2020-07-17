"use strict";

exports.USER_FRAGMENT = "\n  fragment UserParts on User {\n    id\n    nickname \n    email\n    avatar {\n      url\n    }\n    followedBy {\n      id\n      nickname\n      email\n    }\n    following {\n      id\n      nickname\n      email\n    }\n    posts {\n      id\n      title \n      description\n      likes {\n        id\n      }\n      comments {\n        id\n      }\n    }\n    rooms {\n      id\n    }\n  }\n";
exports.MESSAGEROOM_FRAGMENT = "\n  fragment MessageRoomParts on MessageRoom {\n    id\n    participants {\n      id\n      nickname\n      email \n      avatar {\n        url\n      }\n    }\n    messages {\n      id\n      content\n      createdAt\n      updatedAt\n      from {\n        id\n        nickname\n        email \n        avatar {\n          url\n        }\n      }\n    }\n  }\n";
exports.MESSAGE_FRAGMENT = "\n  fragment MessageParts on Message {\n    id\n    content\n    createdAt\n    updatedAt\n    from {\n      id\n      nickname\n      email \n      avatar {\n        url\n      }\n    }\n  }\n";