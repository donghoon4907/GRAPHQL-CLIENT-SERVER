//const sendMail = require("../../module/mail");
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
    // 팔로우 추천 사용자 목록
    getRecommandUsers: (_, __, { request, prisma, isAuthenticated }) => {
      isAuthenticated({ request });
      const {
        user: { id }
      } = request;

      return prisma.users({
        where: {
          id_not: id
        }
      });
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
        throw Error("접근 권한이 없습니다.");
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
      const { email, pwd, nickname, firstname, lastname, file } = args;

      const isExistEmail = await prisma.$exists.user({ email });

      if (isExistEmail) {
        throw Error("이미 등록된 이메일입니다.");
      }

      const isExistNickname = await prisma.$exists.user({ nickname });

      if (isExistNickname) {
        throw Error("이미 존재하는 별명입니다.");
      }

      const hashedPassword = await bcrypt.hash(pwd, 12);

      const newUser = await prisma.createUser({
        email,
        pwd: hashedPassword,
        nickname,
        firstname,
        lastname
      });

      if (file) {
        await prisma.createImage({
          url: file,
          user: {
            connect: { id: newUser.id }
          }
        });
      }

      return true;
    },
    // 사용자 정보 수정
    updateUser: async (_, args, { request, isAuthenticated, prisma }) => {
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
        throw Error("존재하지 않는 사용자입니다.");
      }
    },
    // 인증 요청
    requestSecret: async (_, args, { prisma }) => {
      const { email } = args;

      const loginSecret = Array.from({ length: 4 })
        .map(_ => {
          return Math.floor(Math.random() * 9);
        })
        .join("");

      //try {
      //  await sendMail({ email, loginSecret });
      //} catch (e) {
      //  console.log(e);
      //  throw new Error("이메일 전송에 실패했습니다.");
      //}
      const isExistEmail = await prisma.$exists.user({ email });
      if (!isExistEmail) {
        throw Error("가입되지 않은 이메일입니다.");
      }
      await prisma.updateUser({ data: { loginSecret }, where: { email } });

      return loginSecret;
    },
    // 인증 확인
    confirmSecret: async (_, args, { prisma }) => {
      const { email, secret } = args;

      const user = await prisma.user({ email });
      if (user.loginSecret === secret) {
        await prisma.updateUser({
          where: { id: user.id },
          data: {
            loginSecret: ""
          }
        });
        return generateToken({ id: user.id });
      } else {
        throw Error("메일에 전송된 보안문자와 일치하지 않습니다.");
      }
    },
    logIn: async (_, args, { prisma }) => {
      const { email, pwd } = args;

      const user = await prisma.user({ email });

      if (user) {
        const isCheckPwd = await bcrypt.compare(pwd, user.pwd);

        if (isCheckPwd) {
          return generateToken({ id: user.id });
        } else {
          throw Error("비밀번호를 확인하세요.");
        }
      } else {
        throw Error("존재하지 않는 이메일입니다.");
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
        throw Error("잘못된 접근입니다.");
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
