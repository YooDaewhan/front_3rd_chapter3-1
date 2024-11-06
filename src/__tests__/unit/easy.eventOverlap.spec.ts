import { Event } from '../../types';
import {
  convertEventToDateRange,
  findOverlappingEvents,
  isOverlapping,
  parseDateTime,
} from '../../utils/eventOverlap';

describe('parseDateTime', () => {
  it('2024-07-01 14:30을 정확한 Date 객체로 변환한다', () => {
    const result = parseDateTime('2024-07-01', '14:30');
    expect(result).toEqual(new Date('2024-07-01T14:30:00'));
  });

  it('잘못된 날짜 형식에 대해 Invalid Date를 반환한다', () => {
    const result = parseDateTime('2024-07-32', '14:30'); // 잘못된 날짜
    expect(result.toString()).toBe('Invalid Date');
  });

  it('잘못된 시간 형식에 대해 Invalid Date를 반환한다', () => {
    const result = parseDateTime('2024-07-01', '25:00'); // 잘못된 시간
    expect(result.toString()).toBe('Invalid Date');
  });

  it('날짜 문자열이 비어있을 때 Invalid Date를 반환한다', () => {
    const result = parseDateTime('', '14:30'); // 빈 날짜
    expect(result.toString()).toBe('Invalid Date');
  });

  it('시간 문자열이 비어있을 때 Invalid Date를 반환한다', () => {
    const result = parseDateTime('2024-07-01', ''); // 빈 시간
    expect(result.toString()).toBe('Invalid Date');
  });
});

describe('convertEventToDateRange', () => {
  it('일반적인 이벤트를 올바른 시작 및 종료 시간을 가진 객체로 변환한다', () => {
    const event = {
      date: '2024-07-01',
      startTime: '09:00',
      endTime: '17:00',
    };
    const result = convertEventToDateRange(event);
    expect(result).toEqual({
      start: new Date('2024-07-01T09:00:00'),
      end: new Date('2024-07-01T17:00:00'),
    });
  });

  it('잘못된 날짜 형식의 이벤트에 대해 Invalid Date를 반환한다', () => {
    const event = {
      date: '2024-07-32',
      startTime: '09:00',
      endTime: '17:00',
    };
    const result = convertEventToDateRange(event);
    expect(result.start.toString()).toBe('Invalid Date');
    expect(result.end.toString()).toBe('Invalid Date');
  });

  it('잘못된 시간 형식의 이벤트에 대해 Invalid Date를 반환한다', () => {
    const event = {
      date: '2024-07-01',
      startTime: '25:00',
      endTime: '25:00',
    };
    const result = convertEventToDateRange(event);
    expect(result.start.toString()).toBe('Invalid Date');
    expect(result.end.toString()).toBe('Invalid Date');
  });
});

// gpt 돌렷는데 이해안감 아래 두개

describe('isOverlapping', () => {
  it('두 이벤트가 겹치는 경우 true를 반환한다', () => {
    const event1 = {
      date: '2024-07-01',
      startTime: '10:00',
      endTime: '12:00',
    };
    const event2 = {
      date: '2024-07-01',
      startTime: '11:00',
      endTime: '13:00',
    };
    const result = isOverlapping(event1, event2);
    expect(result).toBe(true); // 두 이벤트가 겹치므로 true를 기대
  });

  it('두 이벤트가 겹치지 않는 경우 false를 반환한다', () => {
    const event1 = {
      date: '2024-07-01',
      startTime: '10:00',
      endTime: '12:00',
    };
    const event2 = {
      date: '2024-07-01',
      startTime: '12:00',
      endTime: '14:00',
    };
    const result = isOverlapping(event1, event2);
    expect(result).toBe(false); // 두 이벤트가 겹치지 않으므로 false를 기대
  });
});

describe('findOverlappingEvents', () => {
  const events = [
    { id: 1, date: '2024-07-01', startTime: '10:00', endTime: '12:00' },
    { id: 2, date: '2024-07-01', startTime: '11:00', endTime: '13:00' },
    { id: 3, date: '2024-07-01', startTime: '14:00', endTime: '15:00' },
    { id: 4, date: '2024-07-02', startTime: '10:00', endTime: '12:00' },
  ];

  it('새 이벤트와 겹치는 모든 이벤트를 반환한다', () => {
    const newEvent = { id: 5, date: '2024-07-01', startTime: '11:30', endTime: '12:30' };
    const result = findOverlappingEvents(newEvent, events);
    expect(result).toEqual([
      { id: 1, date: '2024-07-01', startTime: '10:00', endTime: '12:00' },
      { id: 2, date: '2024-07-01', startTime: '11:00', endTime: '13:00' },
    ]);
  });

  it('겹치는 이벤트가 없으면 빈 배열을 반환한다', () => {
    const newEvent = { id: 5, date: '2024-07-01', startTime: '13:00', endTime: '14:00' };
    const result = findOverlappingEvents(newEvent, events);
    expect(result).toEqual([]);
  });
});
