const bcrypt = require("bcrypt");
const generateToken = require("../../module/token");
const {
  USER_FRAGMENT,
  MESSAGEROOM_FRAGMENT,
  MESSAGE_FRAGMENT
} = require("../../fragment/user");

module.exports = {
  Query: {
    // 사용자 검색
    getUsers: async (_, args, { prisma }) => {
      const { skip = 0, first = 30, orderBy = "nickname_ASC", nickname } = args;

      const orFilter = [];

      if (nickname) {
        orFilter.push({ nickname_contains: nickname });
      }
      const where = orFilter.length > 0 ? { OR: orFilter } : {};

      return prisma
        .users({
          first,
          skip,
          where,
          orderBy
        })
        .$fragment(USER_FRAGMENT);
    },
    // 사용자 정보
    getUser: (_, args, { prisma }) => {
      const { userId } = args;

      return prisma.user({ id: userId }).$fragment(USER_FRAGMENT);
    },
    // 내정보
    getMyProfile: (_, __, { request, isAuthenticated, prisma }) => {
      isAuthenticated({ request });
      const {
        user: { id }
      } = request;

      return prisma.user({ id }).$fragment(USER_FRAGMENT);
    },
    // 메시지방 검색
    getMessageRooms: (_, args, { request, isAuthenticated, prisma }) => {
      isAuthenticated({ request });
      const { skip, first } = args;
      const {
        user: { id }
      } = request;

      return prisma
        .messageRooms({
          where: {
            participants_some: {
              id
            }
          },
          skip,
          first,
          orderBy: "updatedAt_DESC"
        })
        .$fragment(MESSAGEROOM_FRAGMENT);
    },
    // 메시지방 상세 조회
    getMessageRoom: async (
      _,
      { roomId },
      { request, isAuthenticated, prisma }
    ) => {
      isAuthenticated({ request });
      const {
        user: { id }
      } = request;

      const isExistRoom = await prisma.messageRooms({
        where: {
          id: roomId,
          participants_some: {
            id
          }
        }
      });

      if (!isExistRoom) {
        throw Error(
          JSON.stringify({
            message: "접근할 수 없습니다",
            status: 403
          })
        );
      }

      return prisma
        .messageRoom({
          id: roomId
        })
        .$fragment(MESSAGEROOM_FRAGMENT);
    }
  },
  Mutation: {
    // 사용자 추가
    addUser: async (_, args, { prisma }) => {
      const { email, pwd, nickname, file } = args;

      const isExistEmail = await prisma.$exists.user({ email });

      if (isExistEmail) {
        throw Error(
          JSON.stringify({
            message: "이미 등록된 이메일입니다.",
            status: 403
          })
        );
      }

      const isExistNickname = await prisma.$exists.user({ nickname });

      if (isExistNickname) {
        throw Error(
          JSON.stringify({
            message: "이미 존재하는 닉네임입니다.",
            status: 403
          })
        );
      }

      const hashedPassword = await bcrypt.hash(pwd, 12);

      await prisma.createUser({
        email,
        pwd: hashedPassword,
        nickname,
        avatar: {
          create: {
            url: file
          }
        }
      });

      return true;
    },
    // 사용자 정보 수정
    updateUser: async (_, args, { request, isAuthenticated, prisma }) => {
      isAuthenticated({ request });
      const { pwd, nickname, file } = args;
      const {
        user: { id }
      } = request;

      const findUser = await prisma.user({ id });

      if (findUser) {
        const data = {};
        if (nickname) {
          if (nickname !== findUser.nickname) {
            const isExistNickname = await prisma.$exist.user({ nickname });
            if (isExistNickname) {
              throw Error(
                JSON.stringify({
                  message: "이미 존재하는 닉네임입니다.",
                  status: 403
                })
              );
            }
            data["nickname"] = nickname;
          }
        }
        if (file) {
          if (file !== findUser.avatar().url) {
            data["avatar"] = {
              create: {
                url: file
              }
            };
          }
        }
        if (pwd) {
          const hashedPassword = await bcrypt.hash(pwd, 12);
          data["pwd"] = hashedPassword;
        }

        await prisma.updateUser({
          where: { id },
          data
        });
      } else {
        throw Error(
          JSON.stringify({
            message: "존재하지 않는 사용자입니다.",
            status: 403
          })
        );
      }

      return true;
    },
    // 로그인 요청
    logIn: async (_, args, { prisma }) => {
      const { email, pwd } = args;

      const user = await prisma.user({ email });

      if (user) {
        const isCheckPwd = await bcrypt.compare(pwd, user.pwd);

        if (isCheckPwd) {
          return generateToken({ id: user.id });
        } else {
          throw Error(
            JSON.stringify({
              message: "비밀번호를 확인하세요.",
              status: 200
            })
          );
        }
      } else {
        throw Error(
          JSON.stringify({
            message: "등록되지 않은 이메일입니다.",
            status: 403
          })
        );
      }
    },
    // 팔로우
    follow: async (_, args, { request, isAuthenticated, prisma }) => {
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
    unfollow: async (_, args, { request, isAuthenticated, prisma }) => {
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
    addMessage: async (_, args, { request, isAuthenticated, prisma }) => {
      isAuthenticated({ request });
      const {
        user: { id }
      } = request;
      const { content, roomId, to } = args;
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
      let room;
      if (roomId) {
        param["room"] = {
          connect: {
            id: roomId
          }
        };
        room = await prisma.messageRoom({
          id: roomId
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
          room = await prisma.createMessageRoom({
            participants: {
              connect: {
                id: [id, to]
              }
            }
          });
        }
      }
      if (!room) {
        throw Error(
          JSON.stringify({
            message: "잘못된 접근입니다.",
            status: 403
          })
        );
      }

      await prisma.createMessage(param);

      return true;
    },
    // 알림 읽기
    readAlert: async (_, args, { request, isAuthenticated, prisma }) => {
      isAuthenticated({ request });
      const {
        user: { id }
      } = request;
      const { alertId } = args;

      const isExistAlert = await prisma.$exists.alert({
        id: alertId,
        user: { id }
      });

      if (isExistAlert) {
        await prisma.deleteAlert({ where: { id: alertId } });
        return true;
      } else {
        return false;
      }
    }
  },
  Subscription: {
    // 메세지 갱신
    syncMessage: {
      subscribe: (_, args, { prisma }) => {
        const { roomId } = args;

        return prisma.$subscribe
          .message({
            AND: [
              {
                mutation_in: "CREATED"
              },
              {
                node: {
                  room: {
                    id: roomId
                  }
                }
              }
            ]
          })
          .node();
      },
      resolve: ({ id }, _, { prisma }) =>
        prisma
          .message({
            id
          })
          .$fragment(MESSAGE_FRAGMENT)
    }
  },
  // computed
  User: {
    // 내가 팔로우 중인 사용자인지 여부
    isFollowing: (parent, _, { request, prisma }) => {
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
    recentMyMessage: async (parent, _, { request, prisma }) => {
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
