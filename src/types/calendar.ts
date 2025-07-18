export interface CalendarEvent {
    id: string;
    attendees: string[]; // 暇人リスト
    startTime: Date;
    endTime: Date;
    createdBy: string;
    createdAt: Date;
}

// 新しい統一Event型
export interface Event {
    id: string;
    title: string;
    date: string; // YYYY-MM-DD形式
    startTime: string; // HH:mm形式
    endTime: string; // HH:mm形式
    attendees: string[];
    createdBy: string;
    createdAt: Date;
}

export interface TimeSlot {
    startTime: Date;
    endTime: Date;
}

export type ViewMode = 'month' | 'day';

export interface CalendarState {
    events: CalendarEvent[];
    selectedDate: Date;
    viewMode: ViewMode;
} 