const getEventCategoryUIName = (originalName: string) => {
  switch (originalName) {
    case 'Gigs':
      return '콘서트';
    case 'Theatre':
      return '연극 / 뮤지컬';
    case 'Dance':
      return '무용';
    case 'Korean-Traditional':
      return '국악';
    case 'Classic':
      return '클래식';
    case 'Party':
      return '파티 / 오프라인';
    case 'Dj':
      return '디제잉';
    default:
      return originalName;
  }
};

export const eventCategoryUtils = {
  getEventCategoryUIName,
};
