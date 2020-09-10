const generateToken = require("../../module/token");
const { USERS_FRAGMENT, MY_FRAGMENT } = require("../../fragment/user");

module.exports = {
  Query: {
    /**
     * * 사용자 검색
     *
     * @query
     * @author frisk
     * @param {number?} args.skip 건너뛸 목록의 수
     * @param {number?} args.first 요청 목록의 수
     * @param {string?} args.orderBy 정렬
     * @returns User[]
     * @deprecated
     */
    users: async (_, args, { prisma }) => {
      const { skip = 0, first = 30, orderBy = "createdAt_DESC" } = args;

      return prisma
        .users({
          first,
          skip,
          orderBy
        })
        .$fragment(USERS_FRAGMENT);
    },
    /**
     * * 사용자 상세 조회
     *
     * @query
     * @author frisk
     * @param {string} args.id 사용자 ID
     * @returns User
     * @deprecated
     */
    user: (_, args, { prisma }) => {
      const { id } = args;

      return prisma.user({ id }).$fragment(USERS_FRAGMENT);
    },
    /**
     * * 본인 정보 조회
     *
     * @query
     * @author frisk
     * @returns User!
     */
    me: (_, __, { request, isAuthenticated, prisma }) => {
      /**
       * 인증 확인
       */
      isAuthenticated({ request });

      const {
        user: { id }
      } = request;

      return prisma.user({ id }).$fragment(MY_FRAGMENT);
    }
  },
  Mutation: {
    /**
     * * 회원가입
     *
     * @mutation
     * @author frisk
     * @param {string} args.email 이메일
     * @param {string} args.nickname 별칭
     * @param {string} file 업로드한 프로필 사진
     * @returns boolean
     */
    createUser: async (_, args, { prisma }) => {
      const { email, nickname, file } = args;

      /**
       * 이메일 중복 확인
       * @type {boolean}
       */
      const isExistEmail = await prisma.$exists.user({ email });

      if (isExistEmail) {
        throw Error(
          JSON.stringify({
            message: "이미 등록된 이메일입니다.",
            status: 403
          })
        );
      }

      /**
       * 별칭 중복 확인
       * @type {boolean}
       */
      const isExistNickname = await prisma.$exists.user({ nickname });

      if (isExistNickname) {
        throw Error(
          JSON.stringify({
            message: "이미 존재하는 닉네임입니다.",
            status: 403
          })
        );
      }

      /**
       * 사용자 추가
       */
      await prisma.createUser({
        email,
        nickname,
        avatar: {
          create: {
            url: file
          }
        }
      });

      return true;
    },
    /**
     * * 내 정보 수정
     *
     * @mutation
     * @author frisk
     * @param {string?} args.nickname 별칭
     * @param {string?} args.file 업로드한 프로필 사진
     * @returns boolean
     */
    updateUser: async (_, args, { request, isAuthenticated, prisma }) => {
      /**
       * 인증 확인
       */
      isAuthenticated({ request });

      const {
        user: { id }
      } = request;

      const { nickname, file } = args;

      /**
       * 사용자 유무 확인
       * @type {object|null}
       */
      const findMe = await prisma.user({ id });

      if (!findMe) {
        throw Error(
          JSON.stringify({
            message: "존재하지 않는 사용자입니다.",
            status: 403
          })
        );
      }

      /**
       * 수정할 데이터
       */
      const data = {};

      if (nickname) {
        /**
         * 수정을 원하는 별칭이 현재 설정된 별칭과 다른 경우
         */
        if (nickname !== findMe.nickname) {
          /**
           * 별칭 중복 확인
           * @type {boolean}
           */
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
        /**
         * 수정을 원하는 프로필 사진이 현재 설정된 프로필 사진과 다른 경우
         */
        if (file !== findMe.avatar().url) {
          data["avatar"] = {
            create: {
              url: file
            }
          };
        }
      }

      /**
       * 사용자 수정
       */
      await prisma.updateUser({
        where: { id },
        data
      });

      return true;
    },
    /**
     * * 로그인
     *
     * @mutation
     * @author frisk
     * @param {string} args.email 이메일
     * @returns User
     */
    logIn: async (_, args, { prisma }) => {
      const { email } = args;

      /**
       * 이메일로 사용자 조회
       */
      const user = await prisma.user({ email });

      if (!user) {
        throw Error(
          JSON.stringify({
            message: "등록되지 않은 이메일입니다.",
            status: 403
          })
        );
      }

      const { id, nickname, avatar, isMaster } = user;

      /**
       * 사용자 ID로 토큰 발급
       */
      const token = generateToken({ id });

      return {
        token,
        id,
        nickname,
        email,
        avatar,
        isMaster
      };
    }
  }
};
