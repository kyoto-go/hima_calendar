import {
    format,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    addMinutes,
    isBefore,
    isAfter,
    parseISO,
    formatISO,
} from 'date-fns';
import { ja } from 'date-fns/locale';

export const formatDate = (date: Date, formatString: string): string => {
    return format(date, formatString, { locale: ja });
};

export const getMonthDays = (date: Date): Date[] => {
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 }); // 日曜日開始
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
};

export const generateTimeSlots = (date: Date): Date[] => {
    const slots: Date[] = [];
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    // 0時から23時50分まで10分間隔で生成
    for (let i = 0; i < 144; i++) { // 24時間 * 6 (10分間隔)
        slots.push(addMinutes(startOfDay, i * 10));
    }

    return slots;
};

export const isTimeSlotAvailable = (
    startTime: Date,
    endTime: Date,
    existingEvents: Array<{ startTime: Date; endTime: Date }>
): boolean => {
    return !existingEvents.some(event =>
        (isBefore(startTime, event.endTime) && isAfter(endTime, event.startTime))
    );
};

export const formatTimeSlot = (startTime: Date, endTime: Date): string => {
    return `${format(startTime, 'HH:mm')} - ${format(endTime, 'HH:mm')}`;
};

// 時間文字列をパースして時と分の配列を返す
export const parseTime = (timeString: string): [number, number] => {
    const [hour, minute] = timeString.split(':').map(Number);
    return [hour, minute];
};

// 時と分から時間文字列をフォーマット
export const formatTime = (hour: number, minute: number): string => {
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
};

export const serializeDate = (date: Date): string => {
    return formatISO(date);
};

export const deserializeDate = (dateString: string): Date => {
    return parseISO(dateString);
}; 