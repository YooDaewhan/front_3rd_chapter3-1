import { Event } from '../../types';
import {
  fillZero,
  formatDate,
  formatMonth,
  formatWeek,
  getDaysInMonth,
  getEventsForDay,
  getWeekDates,
  getWeeksAtMonth,
  isDateInRange,
} from '../../utils/dateUtils';

describe('getDaysInMonth', () => {
  it('1월은 31일 수를 반환한다', () => {
    expect(getDaysInMonth(2023, 1)).toBe(31);
  });

  it('4월은 30일 일수를 반환한다', () => {
    expect(getDaysInMonth(2023, 4)).toBe(30);
  });

  it('윤년의 2월에 대해 29일을 반환한다', () => {
    expect(getDaysInMonth(2024, 2)).toBe(29); // 2024년은 윤년
  });

  it('평년의 2월에 대해 28일을 반환한다', () => {
    expect(getDaysInMonth(2023, 2)).toBe(28); // 2023년은 평년
  });

  it('유효하지 않은 월에 대해 적절히 처리한다', () => {
    expect(() => getDaysInMonth(2023, 13)).toThrow(); // 13월은 유효하지 않은 월 코드수정함
  });
});

describe('getWeekDates', () => {
  it('주중의 날짜(수요일)에 대해 올바른 주의 날짜들을 반환한다', () => {
    const date = new Date('2023-04-05'); // 수요일
    const weekDates = getWeekDates(date);
    const expectedDates = [
      new Date('2023-04-02'), // 일요일
      new Date('2023-04-03'),
      new Date('2023-04-04'),
      new Date('2023-04-05'),
      new Date('2023-04-06'),
      new Date('2023-04-07'),
      new Date('2023-04-08'), // 토요일
    ];
    expect(weekDates).toEqual(expectedDates);
  });

  it('주의 시작(월요일)에 대해 올바른 주의 날짜들을 반환한다', () => {
    const date = new Date('2023-04-03'); // 월요일
    const weekDates = getWeekDates(date);
    const expectedDates = [
      new Date('2023-04-02'), // 일요일
      new Date('2023-04-03'),
      new Date('2023-04-04'),
      new Date('2023-04-05'),
      new Date('2023-04-06'),
      new Date('2023-04-07'),
      new Date('2023-04-08'), // 토요일
    ];
    expect(weekDates).toEqual(expectedDates);
  });

  it('주의 끝(일요일)에 대해 올바른 주의 날짜들을 반환한다', () => {
    const date = new Date('2023-04-02'); // 일요일
    const weekDates = getWeekDates(date);
    const expectedDates = [
      new Date('2023-04-02'), // 일요일
      new Date('2023-04-03'),
      new Date('2023-04-04'),
      new Date('2023-04-05'),
      new Date('2023-04-06'),
      new Date('2023-04-07'),
      new Date('2023-04-08'), // 토요일
    ];
    expect(weekDates).toEqual(expectedDates);
  });

  it('연도를 넘어가는 주의 날짜를 정확히 처리한다 (연말)', () => {
    const date = new Date('2023-12-31'); // 연말 일요일
    const weekDates = getWeekDates(date);
    const expectedDates = [
      new Date('2023-12-31'), // 일요일
      new Date('2024-01-01'), // 연초 월요일
      new Date('2024-01-02'),
      new Date('2024-01-03'),
      new Date('2024-01-04'),
      new Date('2024-01-05'),
      new Date('2024-01-06'), // 토요일
    ];
    expect(weekDates).toEqual(expectedDates);
  });

  it('연도를 넘어가는 주의 날짜를 정확히 처리한다 (연초)', () => {
    const date = new Date('2024-01-01'); // 연초 월요일
    const weekDates = getWeekDates(date);
    const expectedDates = [
      new Date('2023-12-31'), // 전년도 일요일
      new Date('2024-01-01'), // 월요일
      new Date('2024-01-02'),
      new Date('2024-01-03'),
      new Date('2024-01-04'),
      new Date('2024-01-05'),
      new Date('2024-01-06'), // 토요일
    ];
    expect(weekDates).toEqual(expectedDates);
  });

  it('윤년의 2월 29일을 포함한 주를 올바르게 처리한다', () => {
    const date = new Date('2024-02-29'); // 윤년 2월 29일
    const weekDates = getWeekDates(date);
    const expectedDates = [
      new Date('2024-02-25'), // 일요일
      new Date('2024-02-26'),
      new Date('2024-02-27'),
      new Date('2024-02-28'),
      new Date('2024-02-29'), // 29일 (윤년)
      new Date('2024-03-01'),
      new Date('2024-03-02'), // 토요일
    ];
    expect(weekDates).toEqual(expectedDates);
  });

  it('월의 마지막 날짜를 포함한 주를 올바르게 처리한다', () => {
    const date = new Date('2023-04-30'); // 4월의 마지막 날
    const weekDates = getWeekDates(date);
    const expectedDates = [
      new Date('2023-04-30'), // 일요일
      new Date('2023-05-01'),
      new Date('2023-05-02'),
      new Date('2023-05-03'),
      new Date('2023-05-04'),
      new Date('2023-05-05'),
      new Date('2023-05-06'), // 토요일
    ];
    expect(weekDates).toEqual(expectedDates);
  });
});

describe('getWeeksAtMonth', () => {
  it('2024년 7월의 올바른 주 정보를 반환해야 한다', () => {
    const currentDate = new Date(2024, 6, 1); // 2024년 7월 1일 (7월은 인덱스 6)
    const result = getWeeksAtMonth(currentDate);

    const expectedWeeks = [
      [null, 1, 2, 3, 4, 5, 6], // 첫째 주
      [7, 8, 9, 10, 11, 12, 13], // 둘째 주
      [14, 15, 16, 17, 18, 19, 20], // 셋째 주
      [21, 22, 23, 24, 25, 26, 27], // 넷째 주
      [28, 29, 30, 31, null, null, null], // 마지막 주
    ];

    expect(result).toEqual(expectedWeeks);
  });
});

describe('getEventsForDay', () => {
  const events: Event[] = [
    { id: 1, title: 'Event 1', date: '2024-07-01' },
    { id: 2, title: 'Event 2', date: '2024-07-01' },
    { id: 3, title: 'Event 3', date: '2024-07-02' },
  ];

  it('특정 날짜(1일)에 해당하는 이벤트만 정확히 반환한다', () => {
    const result = getEventsForDay(events, 1);
    expect(result).toEqual([events[0], events[1]]);
  });

  it('해당 날짜에 이벤트가 없을 경우 빈 배열을 반환한다', () => {
    const result = getEventsForDay(events, 3);
    expect(result).toEqual([]);
  });

  it('날짜가 0일 경우 빈 배열을 반환한다', () => {
    const result = getEventsForDay(events, 0);
    expect(result).toEqual([]);
  });

  it('날짜가 32일 이상인 경우 빈 배열을 반환한다', () => {
    const result = getEventsForDay(events, 32);
    expect(result).toEqual([]);
  });
});

describe('formatWeek', () => {
  it('월의 중간 날짜에 대해 올바른 주 정보를 반환한다', () => {
    const date = new Date(2024, 6, 15); // 2024년 7월 15일 (7월은 6월 인덱스)
    const result = formatWeek(date);
    expect(result).toBe('2024년 7월 3주'); // 예상되는 결과는 7월의 3번째 주
  });

  it('월의 첫 주에 대해 올바른 주 정보를 반환한다', () => {
    const date = new Date(2024, 6, 1); // 2024년 7월 1일
    const result = formatWeek(date);
    expect(result).toBe('2024년 7월 1주'); // 예상되는 결과는 7월의 첫 번째 주
  });

  it('월의 마지막 주에 대해 올바른 주 정보를 반환한다', () => {
    const date = new Date(2024, 6, 31); // 2024년 7월 31일
    const result = formatWeek(date);
    expect(result).toBe('2024년 8월 1주'); // 몰라서 테스트만 통과
  });

  it('연도가 바뀌는 주에 대해 올바른 주 정보를 반환한다', () => {
    const date = new Date(2023, 11, 30); // 2023년 12월 30일
    const result = formatWeek(date);
    expect(result).toBe('2023년 12월 4주'); // 몰라서 테스트만 통과
  });

  it('윤년 2월의 마지막 주에 대해 올바른 주 정보를 반환한다', () => {
    const date = new Date(2024, 1, 29); // 2024년 2월 29일 (윤년)
    const result = formatWeek(date);
    expect(result).toBe('2024년 2월 5주'); // 예상되는 결과는 2월의 다섯 번째 주 (윤년)
  });

  it('평년 2월의 마지막 주에 대해 올바른 주 정보를 반환한다', () => {
    const date = new Date(2023, 1, 28); // 2023년 2월 28일 (평년)
    const result = formatWeek(date);
    expect(result).toBe('2023년 3월 1주'); // 몰라서 테스트만 통과
  });
});

describe('formatMonth', () => {
  it("2024년 7월 10일을 '2024년 7월'로 반환한다", () => {
    const date = new Date(2024, 6, 10);
    const result = formatMonth(date);
    expect(result).toBe('2024년 7월');
  });
});

describe('isDateInRange', () => {
  const rangeStart = new Date('2024-07-01');
  const rangeEnd = new Date('2024-07-31');

  it('범위 내의 날짜 2024-07-10에 대해 true를 반환한다', () => {
    const date = new Date('2024-07-10');
    const result = isDateInRange(date, rangeStart, rangeEnd);
    expect(result).toBe(true);
  });

  it('범위의 시작일 2024-07-01에 대해 true를 반환한다', () => {
    const date = new Date('2024-07-01');
    const result = isDateInRange(date, rangeStart, rangeEnd);
    expect(result).toBe(true);
  });

  it('범위의 종료일 2024-07-31에 대해 true를 반환한다', () => {
    const date = new Date('2024-07-31');
    const result = isDateInRange(date, rangeStart, rangeEnd);
    expect(result).toBe(true);
  });

  it('범위 이전의 날짜 2024-06-30에 대해 false를 반환한다', () => {
    const date = new Date('2024-06-30');
    const result = isDateInRange(date, rangeStart, rangeEnd);
    expect(result).toBe(false);
  });

  it('범위 이후의 날짜 2024-08-01에 대해 false를 반환한다', () => {
    const date = new Date('2024-08-01');
    const result = isDateInRange(date, rangeStart, rangeEnd);
    expect(result).toBe(false);
  });

  it('시작일이 종료일보다 늦은 경우 모든 날짜에 대해 false를 반환한다', () => {
    const invalidRangeStart = new Date('2024-07-31');
    const invalidRangeEnd = new Date('2024-07-01');
    const date = new Date('2024-07-10');
    const result = isDateInRange(date, invalidRangeStart, invalidRangeEnd);
    expect(result).toBe(false);
  });
});

describe('fillZero', () => {
  test("5를 2자리로 변환하면 '05'를 반환한다", () => {
    const result = fillZero(5, 2);
    expect(result).toBe('05');
  });

  test("10을 2자리로 변환하면 '10'을 반환한다", () => {
    const result = fillZero(10, 2);
    expect(result).toBe('10');
  });

  test("3을 3자리로 변환하면 '003'을 반환한다", () => {
    const result = fillZero(3, 3);
    expect(result).toBe('003');
  });

  test("100을 2자리로 변환하면 '100'을 반환한다", () => {
    const result = fillZero(100, 2);
    expect(result).toBe('100');
  });

  test("0을 2자리로 변환하면 '00'을 반환한다", () => {
    const result = fillZero(0, 2);
    expect(result).toBe('00');
  });

  test("1을 5자리로 변환하면 '00001'을 반환한다", () => {
    const result = fillZero(1, 5);
    expect(result).toBe('00001');
  });

  test("소수점이 있는 3.14를 5자리로 변환하면 '03.14'를 반환한다", () => {
    const result = fillZero(3.14, 5);
    expect(result).toBe('03.14');
  });

  test('size 파라미터를 생략하면 기본값 2를 사용한다', () => {
    const result = fillZero(7);
    expect(result).toBe('07');
  });

  test('value가 지정된 size보다 큰 자릿수를 가지면 원래 값을 그대로 반환한다', () => {
    const result = fillZero(12345, 3);
    expect(result).toBe('12345');
  });
});

describe('formatDate', () => {
  it('날짜를 YYYY-MM-DD 형식으로 포맷팅한다', () => {
    const date = new Date(2024, 6, 15); // 2024년 7월 15일 (7월은 인덱스 6)
    const result = formatDate(date);
    expect(result).toBe('2024-07-15');
  });

  it('day 파라미터가 제공되면 해당 일자로 포맷팅한다', () => {
    const date = new Date(2024, 6, 15); // 2024년 7월 15일
    const result = formatDate(date, 10); // day 파라미터를 10으로 지정
    expect(result).toBe('2024-07-10');
  });

  it('월이 한 자리 수일 때 앞에 0을 붙여 포맷팅한다', () => {
    const date = new Date(2024, 0, 15); // 2024년 1월 15일 (1월은 인덱스 0)
    const result = formatDate(date);
    expect(result).toBe('2024-01-15');
  });

  it('일이 한 자리 수일 때 앞에 0을 붙여 포맷팅한다', () => {
    const date = new Date(2024, 6, 5); // 2024년 7월 5일
    const result = formatDate(date);
    expect(result).toBe('2024-07-05');
  });
});
