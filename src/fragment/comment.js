exports.COMMENTS_FRAGMENT = `
  fragment CommentsParts on Notice {
    id
    user {
      id
      nickname
      avatar {
        url
      }
    }
    post {
      id
      commentCount
    }
    content
    createdAt
    updatedAt
  }
`;

exports.COMMENT_FRAGMENT = `
  fragment CommentParts on Notice {
    id
    user {
      id
      nickname
      avatar {
        url
      }
    }
    post {
      id
      commentCount
    }
    content
    createdAt
    updatedAt
  }
`;
