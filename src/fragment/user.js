exports.USERS_FRAGMENT = `
  fragment UsersParts on User {
    id
    nickname 
    isMaster
    createdAt
    updatedAt
    postCount
    avatar {
      url
    }
  }
`;

exports.USER_FRAGMENT = `
  fragment UserParts on User {
    id
    nickname 
    isMaster
    createdAt
    updatedAt
    postCount
    avatar {
      url
    }
  }
`;

exports.MY_FRAGMENT = `
  fragment myParts on User {
    id
    email
    nickname 
    isMaster
    createdAt
    updatedAt
    postCount
    avatar {
      url
    }
  }
`;
