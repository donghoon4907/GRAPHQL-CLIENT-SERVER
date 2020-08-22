exports.POST_FRAGMENT = `
  fragment PostParts on Post {
    id
    title 
    description
    createdAt
    updatedAt 
    video {
      url
      url_240p
      url_320p
      url_480p
      url_720p
      url_1080p
    }
    user {
      id
      nickname
      avatar {
        url
      }
    }
    likes {
      id
      user {
        id
      }
    }
    status
    room {
      id
    }
  }
`;
