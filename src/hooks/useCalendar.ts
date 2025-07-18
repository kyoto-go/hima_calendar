import { useState, useEffect, useCallback, useMemo } from 'react';
import { CalendarEvent, ViewMode } from '@/types/calendar';
import { saveEvents, loadEvents } from '@/utils/localStorage';
import { isSameDay } from 'date-fns';

export const useCalendar = () => {
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [viewMode, setViewMode] = useState<ViewMode>('month');
    const [isLoading, setIsLoading] = useState(true);

    // ローカルストレージからイベントを読み込み
    useEffect(() => {
        const loadedEvents = loadEvents();
        setEvents(loadedEvents);
        setIsLoading(false);
    }, []);

    // イベントが変更されたらローカルストレージに保存
    useEffect(() => {
        if (!isLoading) {
            saveEvents(events);
        }
    }, [events, isLoading]);

    // 新しいイベントを追加
    const addEvent = useCallback((eventData: Omit<CalendarEvent, 'id' | 'createdAt'>) => {
        const newEvent: CalendarEvent = {
            ...eventData,
            id: crypto.randomUUID(),
            createdAt: new Date(),
        };

        setEvents(prev => [...prev, newEvent]);
    }, []);

    // イベントに参加者を追加
    const joinEvent = useCallback((eventId: string, attendeeName: string) => {
        setEvents(prev => prev.map(event =>
            event.id === eventId
                ? { ...event, attendees: [...event.attendees, attendeeName] }
                : event
        ));
    }, []);

    // イベントを削除
    const removeEvent = useCallback((eventId: string) => {
        setEvents(prev => prev.filter(event => event.id !== eventId));
    }, []);

    // 参加者を削除
    const removeAttendee = useCallback((eventId: string, attendeeName: string) => {
        setEvents(prev => prev.map(event => {
            if (event.id === eventId) {
                const newAttendees = event.attendees.filter(name => name !== attendeeName);
                // 最後の参加者を削除した場合、イベント自体も削除
                if (newAttendees.length === 0) {
                    return null;
                }
                return { ...event, attendees: newAttendees };
            }
            return event;
        }).filter(Boolean) as CalendarEvent[]);
    }, []);

    // 特定の日のイベントを取得（メモ化）
    const getEventsForDate = useCallback((date: Date) => {
        return events.filter(event => isSameDay(event.startTime, date));
    }, [events]);

    // 選択された日のイベント（メモ化）
    const selectedDateEvents = useMemo(() => {
        return getEventsForDate(selectedDate);
    }, [getEventsForDate, selectedDate]);

    // 日付変更ハンドラー
    const changeDate = useCallback((date: Date, shouldSwitchView = false) => {
        setSelectedDate(date);
        // shouldSwitchViewがtrueの場合のみビューを切り替え（日付セルクリック時）
        if (shouldSwitchView && viewMode === 'month') {
            setViewMode('day');
        }
    }, [viewMode]);

    // ビューモード変更ハンドラー
    const changeViewMode = useCallback((mode: ViewMode) => {
        setViewMode(mode);
    }, []);

    return {
        // State
        events,
        selectedDate,
        viewMode,
        isLoading,
        selectedDateEvents,

        // Actions
        addEvent,
        joinEvent,
        removeEvent,
        removeAttendee,
        getEventsForDate,
        changeDate,
        changeViewMode,
    };
}; 