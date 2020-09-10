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

exports.MY_FRAGMENT = `
  fragment myParts on User {
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
