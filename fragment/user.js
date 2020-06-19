exports.USER_FRAGMENT = `
  fragment UserParts on User {
    id
    nickname 
    email
    file {
      url
    }
    followedBy {
      id
      nickname
      email
    }
    following {
      id
      nickname
      email
    }
    posts {
      id
      title 
      description
      likes {
        id
      }
      comments {
        id
      }
    }
    rooms {
      id
    }
  }
`;
