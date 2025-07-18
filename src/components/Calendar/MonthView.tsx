import React, { memo, useCallback } from 'react';
import { isSameMonth, isSameDay, isToday } from 'date-fns';
import { CalendarEvent } from '@/types/calendar';
import { getMonthDays } from '@/utils/dateUtils';
import { EventCard } from './EventCard';
import clsx from 'clsx';

interface MonthViewProps {
    selectedDate: Date;
    events: CalendarEvent[];
    onDateSelect: (date: Date, shouldSwitchView?: boolean) => void;
    onJoinEvent: (eventId: string, attendeeName: string) => void;
    onRemoveEvent: (eventId: string) => void;
    onEventClick?: (event: CalendarEvent) => void;
}

interface DayCellProps {
    date: Date;
    isCurrentMonth: boolean;
    isSelected: boolean;
    isToday: boolean;
    events: CalendarEvent[];
    onDateSelect: (date: Date, shouldSwitchView?: boolean) => void;
    onJoinEvent: (eventId: string, attendeeName: string) => void;
    onRemoveEvent: (eventId: string) => void;
    onEventClick?: (event: CalendarEvent) => void;
}

const DayCell = memo<DayCellProps>(({
    date,
    isCurrentMonth,
    isSelected,
    isToday: isTodayDate,
    events,
    onDateSelect,
    onJoinEvent,
    onRemoveEvent,
    onEventClick,
}) => {
    const handleDateClick = useCallback((e: React.MouseEvent) => {
        // イベントカードからのクリックでない場合のみ日付選択
        if ((e.target as HTMLElement).closest('.event-card-wrapper')) {
            return;
        }
        onDateSelect(date, true);
    }, [date, onDateSelect]);

    const dayEvents = events.filter(event => {
        const eventDate = new Date(event.startTime);
        return isSameDay(eventDate, date);
    });

    const displayedEvents = dayEvents.slice(0, 2); // 最大2件まで表示
    const remainingCount = dayEvents.length - displayedEvents.length;

    return (
        <div
            onClick={handleDateClick}
            className={clsx(
                'min-h-[80px] sm:min-h-[100px] lg:min-h-[120px] p-1 sm:p-2 cursor-pointer transition-all duration-300 transform hover:scale-[1.02] animate-slideInUp day-cell',
                {
                    'opacity-40 bg-retro-teal-100 border-retro-teal-300': !isCurrentMonth,
                    'shadow-lg bg-retro-orange-200 border-2 border-retro-orange-500': isSelected && isCurrentMonth,
                    'hover:shadow-md': !isSelected && isCurrentMonth && !isTodayDate,
                    'shadow-md bg-retro-mustard-200 border-2 border-retro-mustard-500': isTodayDate && !isSelected,
                    'bg-retro-ivory-100 border-retro-teal-300': isCurrentMonth && !isSelected && !isTodayDate,
                }
            )}
        >
            <div className="h-full flex flex-col">
                <div className="flex items-center justify-between mb-1 sm:mb-2">
                    <span
                        className={clsx('text-xs sm:text-sm font-semibold', {
                            'opacity-50 text-retro-teal-500': !isCurrentMonth,
                            'text-retro-brown-800': isSelected && isCurrentMonth,
                            'text-retro-brown-800': isTodayDate && !isSelected,
                            'text-retro-brown-700': isCurrentMonth && !isSelected && !isTodayDate,
                        })}
                    >
                        {date.getDate()}
                    </span>
                    {dayEvents.length > 0 && (
                        <span className="text-xs px-1 sm:px-2 py-0.5 sm:py-1 rounded-full font-medium animate-pulse-gentle bg-retro-orange-500 text-retro-white">
                            <span className="hidden sm:inline">😴 </span>{dayEvents.length}
                        </span>
                    )}
                </div>

                <div className="flex-1 space-y-0.5 sm:space-y-1 overflow-hidden">
                    {displayedEvents.slice(0, 1).map((event) => (
                        <div key={event.id} className="event-card-wrapper">
                            <EventCard
                                event={event}
                                onJoinEvent={onJoinEvent}
                                onRemoveEvent={onRemoveEvent}
                                onDetailClick={onEventClick}
                                compact
                            />
                        </div>
                    ))}

                    {dayEvents.length > 1 && (
                        <div className="text-xs text-center py-0.5 sm:py-1 rounded animate-scaleIn bg-retro-mustard-300 text-retro-brown-800">
                            他 {dayEvents.length - 1} 件
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
});

DayCell.displayName = 'DayCell';

export const MonthView = memo<MonthViewProps>(({
    selectedDate,
    events,
    onDateSelect,
    onJoinEvent,
    onRemoveEvent,
    onEventClick,
}) => {
    const monthDays = getMonthDays(selectedDate);
    const dayNames = ['日', '月', '火', '水', '木', '金', '土'];

    return (
        <div className="bg-retro-ivory-50">
            {/* 曜日ヘッダー */}
            <div className="grid grid-cols-7 border-b bg-retro-teal-600 border-b-retro-teal-800">
                {dayNames.map((day, index) => (
                    <div
                        key={day}
                        className={clsx(
                            'p-2 sm:p-3 text-center font-semibold text-xs sm:text-sm',
                            {
                                'text-retro-orange-300': index === 0, // 日曜日
                                'text-retro-mustard-300': index === 6, // 土曜日
                                'text-retro-ivory-100': index !== 0 && index !== 6, // 平日
                            }
                        )}
                    >
                        {day}
                    </div>
                ))}
            </div>

            {/* カレンダーグリッド */}
            <div className="grid grid-cols-7">
                {monthDays.map((date) => (
                    <DayCell
                        key={`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`}
                        date={date}
                        isCurrentMonth={isSameMonth(date, selectedDate)}
                        isSelected={isSameDay(date, selectedDate)}
                        isToday={isToday(date)}
                        events={events}
                        onDateSelect={onDateSelect}
                        onJoinEvent={onJoinEvent}
                        onRemoveEvent={onRemoveEvent}
                        onEventClick={onEventClick}
                    />
                ))}
            </div>
        </div>
    );
});

MonthView.displayName = 'MonthView'; 