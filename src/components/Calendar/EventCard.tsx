import React, { memo, useState, useCallback } from 'react';
import { CalendarEvent } from '@/types/calendar';
import { Users, Trash2, UserPlus, X } from 'lucide-react';
import { formatDate } from '@/utils/dateUtils';
import clsx from 'clsx';

interface EventCardProps {
    event: CalendarEvent;
    onJoinEvent: (eventId: string, attendeeName: string) => void;
    onRemoveEvent: (eventId: string) => void;
    onRemoveAttendee?: (eventId: string, attendeeName: string) => void;
    onDetailClick?: (event: CalendarEvent) => void;
    compact?: boolean;
    fullHeight?: boolean;
}

export const EventCard = memo<EventCardProps>(({
    event,
    onJoinEvent,
    onRemoveEvent,
    onRemoveAttendee,
    onDetailClick,
    compact = false,
    fullHeight = false,
}) => {
    const [showJoinForm, setShowJoinForm] = useState(false);
    const [attendeeName, setAttendeeName] = useState('');

    const handleJoinSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        if (attendeeName.trim()) {
            onJoinEvent(event.id, attendeeName.trim());
            setAttendeeName('');
            setShowJoinForm(false);
        }
    }, [attendeeName, event.id, onJoinEvent]);

    const handleJoinClick = useCallback(() => {
        setShowJoinForm(true);
    }, []);

    const handleJoinCancel = useCallback(() => {
        setShowJoinForm(false);
        setAttendeeName('');
    }, []);

    const handleRemoveClick = useCallback(() => {
        if (confirm('この暇な時間を削除しますか？')) {
            onRemoveEvent(event.id);
        }
    }, [event.id, onRemoveEvent]);

    const handleRemoveAttendee = useCallback((attendeeName: string) => {
        if (onRemoveAttendee && confirm(`${attendeeName}さんを削除しますか？`)) {
            onRemoveAttendee(event.id, attendeeName);
        }
    }, [event.id, onRemoveAttendee]);

    const handleDetailClick = useCallback(() => {
        if (onDetailClick) {
            onDetailClick(event);
        }
    }, [event, onDetailClick]);

    if (compact) {
        return (
            <div
                className="rounded-lg p-2 transition-all duration-200 hover:shadow-md animate-slideInUp border"
                style={{
                    backgroundColor: 'var(--retro-mustard-200)',
                    borderColor: 'var(--retro-orange-500)',
                    borderWidth: '2px'
                }}
            >
                <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                        <div
                            className="text-xs font-medium"
                            style={{ color: 'var(--retro-black)' }}
                        >
                            {formatDate(event.startTime, 'HH:mm')} - {formatDate(event.endTime, 'HH:mm')}
                        </div>
                        <div className="flex items-center space-x-1 mt-1">
                            <Users
                                className="w-3 h-3"
                                style={{ color: 'var(--retro-brown-600)' }}
                            />
                            <span
                                className="text-xs"
                                style={{ color: 'var(--retro-brown-800)' }}
                            >
                                {event.attendees.length}人
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={onDetailClick ? handleDetailClick : handleJoinClick}
                        className="text-xs px-2 py-1 rounded-md transition-colors"
                        style={{
                            backgroundColor: 'var(--retro-orange-500)',
                            color: 'var(--retro-white)'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--retro-orange-600)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--retro-orange-500)';
                        }}
                    >
                        {onDetailClick ? '詳細' : '参加'}
                    </button>
                </div>

                {showJoinForm && (
                    <form onSubmit={handleJoinSubmit} className="mt-2 space-y-2">
                        <input
                            type="text"
                            value={attendeeName}
                            onChange={(e) => setAttendeeName(e.target.value)}
                            placeholder="お名前"
                            className="w-full px-2 py-1 text-xs rounded-md focus:outline-none focus:ring-2 border"
                            style={{
                                borderColor: 'var(--retro-teal-400)',
                                backgroundColor: 'var(--retro-white)',
                                color: 'var(--retro-black)',
                                borderWidth: '2px'
                            }}
                            onFocus={(e) => {
                                e.currentTarget.style.borderColor = 'var(--retro-orange-500)';
                                e.currentTarget.style.boxShadow = `0 0 0 2px rgba(255, 69, 0, 0.2)`;
                            }}
                            onBlur={(e) => {
                                e.currentTarget.style.borderColor = 'var(--retro-teal-400)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                            autoFocus
                        />
                        <div className="flex space-x-1">
                            <button
                                type="submit"
                                className="flex-1 text-xs px-2 py-1 rounded-md transition-colors"
                                style={{
                                    backgroundColor: 'var(--retro-orange-500)',
                                    color: 'var(--retro-white)'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = 'var(--retro-orange-600)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'var(--retro-orange-500)';
                                }}
                            >
                                参加
                            </button>
                            <button
                                type="button"
                                onClick={handleJoinCancel}
                                className="flex-1 text-xs px-2 py-1 rounded-md transition-colors"
                                style={{
                                    backgroundColor: 'var(--retro-brown-300)',
                                    color: 'var(--retro-white)'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = 'var(--retro-brown-500)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'var(--retro-brown-300)';
                                }}
                            >
                                取消
                            </button>
                        </div>
                    </form>
                )}
            </div>
        );
    }

    return (
        <div
            className={clsx(
                "rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] animate-slideInUp event-card",
                {
                    'h-full': fullHeight
                }
            )}
        >
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                    <span className="text-2xl">😴</span>
                    <h3
                        className="font-bold"
                        style={{ color: 'var(--retro-black)' }}
                    >
                        暇な時間
                    </h3>
                </div>
                <button
                    onClick={handleRemoveClick}
                    className="p-1.5 rounded-lg transition-all duration-200 transform hover:scale-110"
                    style={{ color: 'var(--retro-brown-500)' }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.color = 'var(--retro-white)';
                        e.currentTarget.style.backgroundColor = 'var(--retro-orange-500)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.color = 'var(--retro-brown-500)';
                        e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                    aria-label="削除"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>

            <div className="space-y-2 mb-4">
                <p
                    className="text-sm font-medium"
                    style={{ color: 'var(--retro-black)' }}
                >
                    {formatDate(event.startTime, 'HH:mm')} - {formatDate(event.endTime, 'HH:mm')}
                </p>
                <p
                    className="text-xs mt-1"
                    style={{ color: 'var(--retro-brown-600)' }}
                >
                    作成者: {event.createdBy}
                </p>
            </div>

            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Users
                            className="w-4 h-4"
                            style={{ color: 'var(--retro-brown-600)' }}
                        />
                        <span
                            className="text-sm font-medium"
                            style={{ color: 'var(--retro-black)' }}
                        >
                            暇人 ({event.attendees.length}人)
                        </span>
                    </div>
                </div>

                <div className="flex flex-wrap gap-1">
                    {event.attendees.map((attendee, index) => (
                        <div
                            key={index}
                            className="relative group inline-flex items-center text-xs px-2 py-1 rounded-full animate-slideInLeft attendee-badge cursor-pointer transition-all duration-200 hover:shadow-md"
                            style={{
                                animationDelay: `${index * 0.1}s`
                            }}
                            title={
                                onRemoveAttendee 
                                    ? `クリックで${attendee}さんを削除` 
                                    : attendee
                            }
                        >
                            <span>👤 {attendee}</span>
                            {onRemoveAttendee && (
                                <button
                                    onClick={() => handleRemoveAttendee(attendee)}
                                    className="ml-1 opacity-0 group-hover:opacity-100 transition-all duration-200 rounded-full p-0.5 bg-retro-orange-500 hover:bg-retro-orange-600 text-retro-white"
                                    aria-label={`${attendee}さんを削除`}
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                {!showJoinForm ? (
                    <button
                        onClick={handleJoinClick}
                        className="w-full flex items-center justify-center space-x-2 py-2 font-medium rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95"
                        style={{
                            backgroundColor: 'var(--retro-orange-500)',
                            color: 'var(--retro-white)'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--retro-orange-600)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--retro-orange-500)';
                        }}
                    >
                        <UserPlus className="w-4 h-4" />
                        <span>私も暇です！</span>
                    </button>
                ) : (
                    <form onSubmit={handleJoinSubmit} className="space-y-3">
                        <input
                            type="text"
                            value={attendeeName}
                            onChange={(e) => setAttendeeName(e.target.value)}
                            placeholder="お名前を入力してください"
                            className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 border"
                            style={{
                                borderColor: 'var(--retro-teal-400)',
                                backgroundColor: 'var(--retro-white)',
                                color: 'var(--retro-black)',
                                borderWidth: '2px'
                            }}
                            onFocus={(e) => {
                                e.currentTarget.style.borderColor = 'var(--retro-orange-500)';
                                e.currentTarget.style.boxShadow = `0 0 0 3px rgba(255, 69, 0, 0.2)`;
                            }}
                            onBlur={(e) => {
                                e.currentTarget.style.borderColor = 'var(--retro-teal-400)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                            autoFocus
                        />
                        <div className="flex space-x-2">
                            <button
                                type="submit"
                                className="flex-1 font-medium py-2 rounded-lg transition-all duration-200"
                                style={{
                                    backgroundColor: 'var(--retro-orange-500)',
                                    color: 'var(--retro-white)'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = 'var(--retro-orange-600)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'var(--retro-orange-500)';
                                }}
                            >
                                参加する
                            </button>
                            <button
                                type="button"
                                onClick={handleJoinCancel}
                                className="flex-1 font-medium py-2 rounded-lg transition-all duration-200"
                                style={{
                                    backgroundColor: 'var(--retro-brown-300)',
                                    color: 'var(--retro-white)'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = 'var(--retro-brown-500)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'var(--retro-brown-300)';
                                }}
                            >
                                キャンセル
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
});

EventCard.displayName = 'EventCard'; 