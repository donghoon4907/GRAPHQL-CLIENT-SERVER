const { prisma } = require("../../generated/prisma-client");
const sendMail = require("../../module/mail");
const generateToken = require("../../module/token");
const { USER_FRAGMENT } = require("../../fragment/user");

module.exports = {
  Query: {
    // 사용자 검색
    getUsers: async (_, args) => {
      const { skip, first, nickname, orderBy } = args;

      const orFilter = [];

      if (nickname) {
        orFilter.push({ nickname_contains: nickname });
      }
      const where = orFilter.length > 0 ? { OR: orFilter } : {};

      const users = await prisma.users({
        first,
        skip,
        where,
        orderBy
      });

      const count = await prisma
        .usersConnection({ where })
        .aggregate()
        .count();

      return {
        users,
        count
      };
    },
    // 사용자 정보
    getUser: (_, args) => {
      const { userId } = args;

      return prisma.user({ id: userId }).$fragment(USER_FRAGMENT);
    },
    // 내정보
    getMyProfile: (_, __, { request, isAuthenticated }) => {
      isAuthenticated({ request });
      const {
        user: { id }
      } = request;

      return prisma.user({ id }).$fragment(USER_FRAGMENT);
    },
    // 메시지방 검색
    getMessageRooms: (_, args, { request, isAuthenticated }) => {
      isAuthenticated({ request });
      const { skip, first } = args;
      const {
        user: { id }
      } = request;

      return prisma.messageRooms({
        where: {
          participants_some: {
            id
          }
        },
        skip,
        first,
        orderBy: "updatedAt_DESC"
      });
    }
  },
  Mutation: {
    // 사용자 추가
    addUser: async (_, args) => {
      const { email, nickname, firstname, lastname, file } = args;

      try {
        const isExistEmail = await prisma.$exists.user({ email });

        if (isExistEmail) {
          return {
            success: false,
            message: "이미 등록된 이메일입니다."
          };
        }

        const newUser = await prisma.createUser({
          email,
          nickname,
          firstname,
          lastname
        });

        if (file) {
          await prisma.createFile({
            url: file,
            user: {
              connect: { id: newUser.id }
            }
          });
        }
        return {
          success: true,
          message: "회원가입이 정상처리 되었습니다."
        };
      } catch {
        return {
          success: false,
          message: "회원가입 요청 중 오류가 발생했습니다."
        };
      }
    },
    // 사용자 정보 수정
    updateUser: async (_, args, { request, isAuthenticated }) => {
      isAuthenticated({ request });
      const { nickname, file } = args;
      const {
        user: { id }
      } = request;

      const isExistUser = await prisma.$exists.user({ id });

      if (isExistUser) {
        const updatedUser = await prisma.updateUser({
          where: { id },
          data: {
            nickname
          }
        });

        if (file) {
          const filterOptions = {
            user: {
              id
            }
          };

          const isExistFile = await prisma.$exists.file(filterOptions);
          if (isExistFile) {
            await prisma.deleteManyFiles(filterOptions);
          }

          await prisma.createFile({
            url: file,
            user: {
              connect: { id }
            }
          });
        }
        return updatedUser;
      } else {
        throw Error("잘못된 접근입니다.");
      }
    },
    // 인증 요청
    requestSecret: async (_, args) => {
      const { email } = args;

      const loginSecret = Array.from({ length: 4 })
        .map((_) => {
          return Math.floor(Math.random() * 9);
        })
        .join("");

      try {
        await sendMail({ email, loginSecret });
        await prisma.updateUser({ data: { loginSecret }, where: { email } });

        return true;
      } catch {
        return false;
      }
    },
    // 인증 확인
    confirmSecret: async (_, args) => {
      const { email, secret } = args;

      const user = await prisma.user({ email });
      if (user.loginSecret === secret) {
        await prisma.updateUser({
          where: { id: user.id },
          data: {
            loginSecret: ""
          }
        });
        return generateToken(user.id);
      } else {
        throw Error("메일에 전송된 보안문자와 일치하지 않습니다.");
      }
    },
    // 팔로우
    follow: async (_, args, { request, isAuthenticated }) => {
      isAuthenticated({ request });
      const { userId } = args;
      const {
        user: { id }
      } = request;
      try {
        await prisma.updateUser({
          where: { id },
          data: {
            following: {
              connect: { id: userId }
            }
          }
        });
        return true;
      } catch {
        return false;
      }
    },
    // 언팔로우
    unfollow: async (_, args, { request, isAuthenticated }) => {
      isAuthenticated({ request });
      const { userId } = args;
      const {
        user: { id }
      } = request;
      try {
        await prisma.updateUser({
          where: { id },
          data: {
            following: {
              disconnect: { id: userId }
            }
          }
        });
        return true;
      } catch {
        return false;
      }
    },
    // 메세지 전송
    addMessage: async (_, args, { request, isAuthenticated }) => {
      isAuthenticated({ request });
      const {
        user: { id }
      } = request;
      const { content, messageRoomId, to } = args;
      // 메세지 생성 데이터
      const param = {
        content,
        from: {
          connect: {
            id
          }
        }
      };
      // 방 메세지 전송 시
      let messageRoom;
      if (messageRoomId) {
        param["room"] = {
          connect: {
            id: messageRoomId
          }
        };
        messageRoom = await prisma.messageRoom({
          id: messageRoomId
        });
        // 개인 메세지 전송 시
      } else {
        // 자신에게 보낸 메시지 제외
        if (id !== to) {
          param["to"] = {
            connect: {
              id: to
            }
          };
          messageRoom = await prisma.createMessageRoom({
            participants: {
              connect: {
                id: [id, to]
              }
            }
          });
        }
      }
      if (!messageRoom) {
        throw Error("잘못된 접근입니다.");
      }

      return prisma.createMessage(param);
    }
  },
  Subscription: {
    // 메세지 갱신
    syncMessage: {
      subscribe: (_, args) => {
        const { messageRoomId } = args;

        return prisma.$subscribe
          .message({
            AND: [
              {
                mutation_in: "CREATED"
              },
              {
                node: {
                  room: {
                    id: {
                      messageRoomId
                    }
                  }
                }
              }
            ]
          })
          .node();
      },
      resolve: (payload) => payload
    }
  },
  // computed
  User: {
    // 내가 팔로우 중인 사용자인지 여부
    isFollowing: (parent, _, { request }) => {
      const {
        user: { id }
      } = request;
      const { id: parentId } = parent;

      try {
        return prisma.$exists.user({
          AND: [{ id: parentId }, { followedBy_some: { id } }]
        });
      } catch {
        return false;
      }
    },
    // 내정보인지 여부
    isMe: (parent, _, { request }) => {
      const {
        user: { id }
      } = request;
      const { id: parentId } = parent;
      return id === parentId;
    }
  },
  MessageRoom: {
    // 최근 내 메세지
    recentMyMessage: async (parent, _, { request }) => {
      const {
        user: { id }
      } = request;
      const { id: parentId } = parent;

      const filterOptions = {
        AND: [
          {
            room: {
              id: parentId
            }
          },
          {
            from: {
              id
            }
          }
        ]
      };
      const isExistMessage = await prisma.$exist.message(filterOptions);
      if (isExistMessage) {
        return prisma.messages({
          where: filterOptions,
          first: 1,
          orderBy: "updatedAt_DESC"
        });
      } else {
        return null;
      }
    }
  }
};
