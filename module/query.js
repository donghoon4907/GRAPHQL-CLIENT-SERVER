const db = require("../models");

// 목록 쿼리의 조건 및 정렬 생성
exports.makeListCondition = query => {
  const {
    lastId,
    searchKeyword,
    searchType,
    sort,
    startDate,
    endDate,
    channel,
    programId
  } = query;

  let where = {};
  let order = [];
  // lastId가 0인 경우 처음데이터 로드, 아닌 경우 그 다음 데이터 로드
  if (lastId && parseInt(lastId, 10)) {
    where = {
      id: {
        [db.Sequelize.Op.lt]: parseInt(lastId, 10) // less than
      }
    };
  }
  // 날짜 필터를 설정한 경우
  if (startDate && endDate) {
    where = {
      ...where,
      createdAt: {
        [db.Sequelize.Op.between]: [startDate, endDate]
      }
    };
  }
  // 검색어를 포함한 경우 검색 조건 추가
  if (searchKeyword) {
    if (searchType) {
      where = {
        ...where,
        [db.Sequelize.Op.or]: searchType.split(",").map(v => ({
          [v]: {
            [db.Sequelize.Op.like]: `%${searchKeyword}%`
          }
        }))
      };
    } else {
      where = {
        ...where,
        [db.Sequelize.Op.or]: [
          {
            title: {
              [db.Sequelize.Op.like]: `%${searchKeyword}%`
            }
          },
          {
            description: {
              [db.Sequelize.Op.like]: `%${searchKeyword}%`
            }
          }
        ]
      };
    }
  }
  // 채널을 포함한 경우 채널 조건 추가
  if (channel) {
    where = {
      ...where,
      ChannelId: channel
    };
  }
  // 특정 프로그램 조건 추가
  if (programId) {
    where = {
      ...where,
      id: programId
    };
  }
  // 정렬을 포함한 경우 정렬 조건 추가
  if (sort) {
    order.push(sort.split(","));
  } else {
    order.push(["createdAt", "desc"]);
  }
  return {
    where,
    order
  };
};
