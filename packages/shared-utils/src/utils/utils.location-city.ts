const getLocationCityUIName = (originalName: string) => {
  switch (originalName.toLowerCase()) {
    case 'seoul':
      return '서울';
    case 'incheon':
      return '인천';
    case 'yeongjongdo':
      return '영종도';
    case 'ulsan':
      return '울산';
    case 'busan':
      return '부산';
    case 'daegu':
      return '대구';
    case 'jeju':
      return '제주';
    case 'gyeongsangbuk-do':
      return '경상북도';
    case 'gyeongsangnam-do':
      return '경상남도';
    case 'gwangju':
      return '광주';
    case 'daejeon':
      return '대전';
    case 'sejong-city':
      return '세종시';
    case 'gyeonggi-do':
      return '경기도';
    case 'gangwon-do':
      return '강원도';
    case 'chungcheongbuk-do':
      return '충청북도';
    case 'chungcheongnam-do':
      return '충청남도';
    case 'jeollabuk-do':
      return '전라북도';
    case 'jeollanam-do':
      return '전라남도';
    case 'tokyo':
      return '도쿄';
    case 'osaka':
      return '오사카';
    default:
      return originalName;
  }
};

export const locationCityUtils = {
  getLocationCityUIName,
};
