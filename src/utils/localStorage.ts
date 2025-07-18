import { CalendarEvent } from '@/types/calendar';
import { serializeDate, deserializeDate } from './dateUtils';

const STORAGE_KEY = 'hima_calendar_events';

interface SerializedEvent {
    id: string;
    attendees: string[];
    startTime: string;
    endTime: string;
    createdBy: string;
    createdAt: string;
}

export const saveEvents = (events: CalendarEvent[]): void => {
    try {
        const serializedEvents: SerializedEvent[] = events.map(event => ({
            ...event,
            startTime: serializeDate(event.startTime),
            endTime: serializeDate(event.endTime),
            createdAt: serializeDate(event.createdAt),
        }));

        localStorage.setItem(STORAGE_KEY, JSON.stringify(serializedEvents));
    } catch (error) {
        console.error('Failed to save events to localStorage:', error);
    }
};

export const loadEvents = (): CalendarEvent[] => {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        if (!data) return [];

        const serializedEvents: SerializedEvent[] = JSON.parse(data);
        return serializedEvents.map(event => ({
            ...event,
            startTime: deserializeDate(event.startTime),
            endTime: deserializeDate(event.endTime),
            createdAt: deserializeDate(event.createdAt),
        }));
    } catch (error) {
        console.error('Failed to load events from localStorage:', error);
        return [];
    }
};

export const clearEvents = (): void => {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
        console.error('Failed to clear events from localStorage:', error);
    }
}; 