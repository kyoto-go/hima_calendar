import React, { memo, useState, useCallback } from 'react';
import { CalendarHeader } from './CalendarHeader';
import { MonthView } from './MonthView';
import { DayView } from './DayView';
import { EventForm } from './EventForm';
import { EventDetailModal } from './EventDetailModal';
import { useCalendar } from '@/hooks/useCalendar';
import { CalendarEvent } from '@/types/calendar';
import { Plus } from 'lucide-react';

export const Calendar = memo(() => {
    const {
        events,
        selectedDate,
        viewMode,
        isLoading,
        addEvent,
        joinEvent,
        removeEvent,
        removeAttendee,
        changeDate,
        changeViewMode,
    } = useCalendar();

    const [showEventForm, setShowEventForm] = useState(false);
    const [showEventDetail, setShowEventDetail] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

    const handleAddEvent = useCallback(() => {
        setShowEventForm(true);
    }, []);

    const handleEventFormSubmit = useCallback((eventData: Parameters<typeof addEvent>[0]) => {
        addEvent(eventData);
        setShowEventForm(false);
    }, [addEvent]);

    const handleEventFormCancel = useCallback(() => {
        setShowEventForm(false);
    }, []);

    const handleEventClick = useCallback((event: CalendarEvent) => {
        setSelectedEvent(event);
        setShowEventDetail(true);
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-retro-ivory-100">
                <div className="text-center animate-slideUp">
                    <div className="relative">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-retro-teal-300 border-t-retro-orange-500 mx-auto"></div>
                        <span className="absolute inset-0 flex items-center justify-center text-2xl animate-pulse-gentle">😴</span>
                    </div>
                    <p className="mt-6 font-medium text-retro-brown-600">
                        読み込み中...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-retro-ivory-50">
            <CalendarHeader
                selectedDate={selectedDate}
                viewMode={viewMode}
                onDateChange={(date: Date) => {
                    changeDate(date);
                    // 今日ボタンを押した場合、日表示モードで現在時刻にスクロール
                    if (viewMode === 'day' && date.toDateString() === new Date().toDateString()) {
                        setTimeout(() => {
                            const timeIndicator = document.getElementById('current-time-indicator');
                            if (timeIndicator) {
                                timeIndicator.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            }
                        }, 100);
                    }
                }}
                onViewModeChange={changeViewMode}
            />

            <main className="max-w-6xl mx-auto px-2 sm:px-4 lg:px-8 pb-20">
                {viewMode === 'month' ? (
                    <div className="relative animate-fadeIn">
                        <div className="calendar-container rounded-lg overflow-hidden mt-4 sm:mt-6">
                            <MonthView
                                selectedDate={selectedDate}
                                events={events}
                                onDateSelect={changeDate}
                                onJoinEvent={joinEvent}
                                onRemoveEvent={removeEvent}
                                onEventClick={handleEventClick}
                            />
                        </div>

                        {/* 浮動追加ボタン（月表示用） */}
                        <button
                            onClick={handleAddEvent}
                            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-lg transition-all duration-200 flex items-center justify-center z-10 transform hover:scale-105 active:scale-95 btn-primary"
                            aria-label="時間を追加"
                        >
                            <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 sm:gap-4 py-4 sm:py-6 animate-fadeIn">
                        <div className="lg:col-span-3">
                            <div className="calendar-container rounded-lg overflow-hidden">
                                <DayView
                                    selectedDate={selectedDate}
                                    events={events}
                                    onJoinEvent={joinEvent}
                                    onRemoveAttendee={removeAttendee}
                                    onDeleteEvent={removeEvent}
                                    onEventClick={(event) => {
                                        setSelectedEvent(event);
                                        setShowEventDetail(true);
                                    }}
                                />
                            </div>
                        </div>

                        <div className="space-y-3 sm:space-y-4 hidden lg:block">
                            {/* 今日の予定カード */}
                            <div className="rounded-lg shadow-sm p-3 sm:p-4 animate-slideInRight bg-retro-ivory-100 border border-retro-ivory-300">
                                <div className="flex items-center space-x-2 mb-3">
                                    <span className="text-base sm:text-lg">📅</span>
                                    <h3 className="text-xs sm:text-sm font-medium text-retro-brown-700">
                                        今日
                                    </h3>
                                </div>
                                <div className="space-y-3">
                                    {events
                                        .filter(event => {
                                            const eventDate = new Date(event.startTime);
                                            return (
                                                eventDate.getFullYear() === selectedDate.getFullYear() &&
                                                eventDate.getMonth() === selectedDate.getMonth() &&
                                                eventDate.getDate() === selectedDate.getDate()
                                            );
                                        })
                                        .map((event, index) => (
                                            <div
                                                key={event.id}
                                                className="rounded-xl p-4 animate-slideInUp bg-retro-ivory-200 border border-retro-orange-400 cursor-pointer hover:bg-retro-ivory-300 transition-colors"
                                                style={{
                                                    animationDelay: `${index * 0.1}s`
                                                }}
                                                onClick={() => handleEventClick(event)}
                                            >
                                                <div className="flex items-center space-x-2 mb-2">
                                                    <span className="text-sm">⏰</span>
                                                    <h4 className="text-sm font-medium text-retro-brown-700">
                                                        {event.title || '空き時間'}
                                                    </h4>
                                                </div>
                                                <p className="text-sm font-medium mb-2 text-retro-brown-700">
                                                    {event.startTime.toLocaleTimeString('ja-JP', {
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })} - {event.endTime.toLocaleTimeString('ja-JP', {
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                                </p>
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-xs text-retro-brown-600">
                                                        参加者:
                                                    </span>
                                                    <div className="flex flex-wrap gap-1">
                                                        {event.attendees.map((attendee, idx) => (
                                                            <span
                                                                key={idx}
                                                                className="inline-flex items-center text-xs px-2 py-0.5 rounded attendee-badge"
                                                            >
                                                                {attendee}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    {events.filter(event => {
                                        const eventDate = new Date(event.startTime);
                                        return (
                                            eventDate.getFullYear() === selectedDate.getFullYear() &&
                                            eventDate.getMonth() === selectedDate.getMonth() &&
                                            eventDate.getDate() === selectedDate.getDate()
                                        );
                                    }).length === 0 && (
                                            <div className="text-center py-6 animate-scaleIn">
                                                <span className="text-2xl mb-2 block">📭</span>
                                                <p className="text-xs text-retro-brown-500">
                                                    予定なし
                                                </p>
                                            </div>
                                        )}
                                </div>
                            </div>
                        </div>

                        {/* 浮動追加ボタン（日表示用） */}
                        <button
                            onClick={handleAddEvent}
                            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-lg transition-all duration-200 flex items-center justify-center z-10 transform hover:scale-105 active:scale-95 btn-primary"
                            aria-label="時間を追加"
                        >
                            <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
                        </button>
                    </div>
                )}
            </main>

            {showEventForm && (
                <EventForm
                    selectedDate={selectedDate}
                    onAddEvent={handleEventFormSubmit}
                    onCancel={handleEventFormCancel}
                />
            )}

            {showEventDetail && selectedEvent && (
                <EventDetailModal
                    event={selectedEvent}
                    onClose={() => {
                        setShowEventDetail(false);
                        setSelectedEvent(null);
                    }}
                    onJoinEvent={joinEvent}
                    onRemoveAttendee={removeAttendee}
                    onRemoveEvent={(eventId: string) => {
                        removeEvent(eventId);
                        setShowEventDetail(false);
                        setSelectedEvent(null);
                    }}
                />
            )}
        </div>
    );
});

Calendar.displayName = 'Calendar'; 