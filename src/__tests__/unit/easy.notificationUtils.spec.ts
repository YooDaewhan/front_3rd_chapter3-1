import { Event } from '../../types';
import { createNotificationMessage, getUpcomingEvents } from '../../utils/notificationUtils';

describe('getUpcomingEvents', () => {
  const now = new Date('2023-01-01T10:00:00');

  it('알림 시간이 정확히 도래한 이벤트를 반환한다', () => {
    const events = [{ id: '1', date: '2023-01-01', startTime: '10:05:00', notificationTime: 5 }];
    const notifiedEvents = [];

    const result = getUpcomingEvents(events, now, notifiedEvents);
    expect(result).toEqual([events[0]]);
  });

  it('이미 알림이 간 이벤트는 제외한다', () => {
    const events = [{ id: '1', date: '2023-01-01', startTime: '10:05:00', notificationTime: 5 }];
    const notifiedEvents = ['1'];

    const result = getUpcomingEvents(events, now, notifiedEvents);
    expect(result).toEqual([]);
  });

  it('알림 시간이 아직 도래하지 않은 이벤트는 반환하지 않는다', () => {
    const events = [{ id: '1', date: '2023-01-01', startTime: '10:15:00', notificationTime: 5 }];
    const notifiedEvents = [];

    const result = getUpcomingEvents(events, now, notifiedEvents);
    expect(result).toEqual([]);
  });

  it('알림 시간이 지난 이벤트는 반환하지 않는다', () => {
    const events = [{ id: '1', date: '2023-01-01', startTime: '09:55:00', notificationTime: 5 }];
    const notifiedEvents = [];

    const result = getUpcomingEvents(events, now, notifiedEvents);
    expect(result).toEqual([]);
  });
});

describe('createNotificationMessage', () => {
  it('올바른 알림 메시지를 생성해야 한다', () => {
    const event = { notificationTime: 10, title: '회의' };

    const result = createNotificationMessage(event);

    expect(result).toBe('10분 후 회의 일정이 시작됩니다.');
  });
});
