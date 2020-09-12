exports.POSTS_FRAGMENT = `
  fragment PostsParts on Post {
    id
    title 
    description
    user {
      id
      nickname
      avatar {
        url
      }
    }
    likeCount
    likes {
      id
      user {
        id
      }
    }
    createdAt
    updatedAt 
    viewCount
    category
    commentCount
  }
`;

exports.POST_FRAGMENT = `
  fragment PostParts on Post {
    id
    title 
    description
    content
    user {
      id
      nickname
      avatar {
        url
      }
    }
    likeCount
    likes {
      id
      user {
        id
      }
    }
    createdAt
    updatedAt 
    viewCount
    category
  }
`;
