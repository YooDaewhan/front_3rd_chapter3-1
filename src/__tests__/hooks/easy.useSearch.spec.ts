import { act, renderHook } from '@testing-library/react';

import { events } from '../../__mocks__/response/realEvents.json';
import { useSearch } from '../../hooks/useSearch.ts';
import { Event } from '../../types.ts';

const mockEventArr: Event[] = events;
const mockDate = new Date('2024-11-01');

it('검색어가 비어있을 때 모든 이벤트를 반환해야 한다', () => {
  const { result } = renderHook(() => useSearch(mockEventArr, mockDate, 'month'));
  expect(result.current.filteredEvents).toEqual(events);
});

it('검색어에 맞는 이벤트만 필터링해야 한다', () => {
  const { result } = renderHook(() => useSearch(mockEventArr, mockDate, 'month'));
  act(() => {
    result.current.setSearchTerm(mockEventArr[0].title);
  });
  expect(result.current.filteredEvents).toHaveLength(1);
});

it('검색어가 제목, 설명, 위치 중 하나라도 일치하면 해당 이벤트를 반환해야 한다', () => {
  const { result } = renderHook(() => useSearch(mockEventArr, mockDate, 'month'));

  act(() => {
    result.current.setSearchTerm(mockEventArr[0].title);
  });
  expect(result.current.filteredEvents).toHaveLength(1);

  act(() => {
    result.current.setSearchTerm(mockEventArr[0].description);
  });
  expect(result.current.filteredEvents).toHaveLength(1);

  act(() => {
    result.current.setSearchTerm(mockEventArr[0].location);
  });
  expect(result.current.filteredEvents).toHaveLength(1);
});

it('현재 뷰(주간/월간)에 해당하는 이벤트만 반환해야 한다', () => {
  const { result: monthResult } = renderHook(() => useSearch(mockEventArr, mockDate, 'month'));
  expect(monthResult.current.filteredEvents).toHaveLength(5);

  const { result: weekResult } = renderHook(() => useSearch(mockEventArr, mockDate, 'week'));
  expect(weekResult.current.filteredEvents).toHaveLength(0);
});

it("검색어를 '회의'에서 '점심'으로 변경하면 필터링된 결과가 즉시 업데이트되어야 한다", () => {
  const { result } = renderHook(() => useSearch(mockEventArr, new Date('2024-11-01'), 'month'));

  act(() => {
    result.current.setSearchTerm('회의');
  });
  expect(result.current.filteredEvents[0]).toEqual(events[0]);

  act(() => {
    result.current.setSearchTerm('점심');
  });
  expect(result.current.filteredEvents[0]).toEqual(events[1]);
});
