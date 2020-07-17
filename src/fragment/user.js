exports.USER_FRAGMENT = `
  fragment UserParts on User {
    id
    nickname 
    email
    avatar {
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

exports.MESSAGEROOM_FRAGMENT = `
  fragment MessageRoomParts on MessageRoom {
    id
    participants {
      id
      nickname
      email 
      avatar {
        url
      }
    }
    messages {
      id
      content
      createdAt
      updatedAt
      from {
        id
        nickname
        email 
        avatar {
          url
        }
      }
    }
  }
`;

exports.MESSAGE_FRAGMENT = `
  fragment MessageParts on Message {
    id
    content
    createdAt
    updatedAt
    from {
      id
      nickname
      email 
      avatar {
        url
      }
    }
  }
`;
