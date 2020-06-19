exports.POST_FRAGMENT = `
  fragment PostParts on Post {
    id
    title 
    description
    createdAt
    updatedAt 
    user {
      nickname
      file {
        url
      }
    }
    files {
      url
    }
    comments {
      id
      content
      user {
        id
        nickname
      }
      comments {
        id
        content
        user {
          id 
          nickname
        }
      }
    }
    accepts {
      user {
        id
        nickname
      }
    }
  }
`;
