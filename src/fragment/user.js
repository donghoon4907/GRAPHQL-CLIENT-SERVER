exports.USERS_FRAGMENT = `
  fragment UsersParts on User {
    id
    nickname 
    email
    isMaster
    createdAt
    updatedAt
    avatar {
      url
    }
  }
`;

exports.MY_FRAGMENT = `
  fragment myParts on User {
    id
    nickname 
    email
    isMaster
    createdAt
    updatedAt
    avatar {
      url
    }
  }
`;
