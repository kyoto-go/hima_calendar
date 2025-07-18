import React, { memo, useState, useCallback } from 'react';
import { CalendarEvent } from '@/types/calendar';
import { X, Clock, Users, UserPlus, Trash2 } from 'lucide-react';
import { formatDate } from '@/utils/dateUtils';

interface EventDetailModalProps {
    event: CalendarEvent;
    onJoinEvent: (eventId: string, attendeeName: string) => void;
    onRemoveEvent: (eventId: string) => void;
    onRemoveAttendee?: (eventId: string, attendeeName: string) => void;
    onClose: () => void;
}

export const EventDetailModal = memo<EventDetailModalProps>(({
    event,
    onJoinEvent,
    onRemoveEvent,
    onRemoveAttendee,
    onClose,
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
            onClose();
        }
    }, [event.id, onRemoveEvent, onClose]);

    const handleRemoveAttendee = useCallback((attendeeName: string) => {
        if (onRemoveAttendee && confirm(`${attendeeName}さんを削除しますか？`)) {
            onRemoveAttendee(event.id, attendeeName);
        }
    }, [event.id, onRemoveAttendee]);

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 animate-fadeIn modal-backdrop">
            <div className="rounded-2xl shadow-2xl p-6 w-full max-w-lg animate-slideInUp modal-content border-2 border-retro-orange-500">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-2">
                        <span className="text-2xl">😴</span>
                        <h2 className="text-xl font-bold text-retro-black">
                            暇な時間の詳細
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg transition-all duration-200 transform hover:scale-110 text-retro-brown-500 hover:text-retro-white hover:bg-retro-orange-500"
                        aria-label="閉じる"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-4">
                    {/* 時間情報 */}
                    <div className="rounded-lg p-4 bg-retro-mustard-200 border border-retro-mustard-400">
                        <div className="flex items-center space-x-2 mb-2">
                            <Clock className="w-5 h-5 text-retro-brown-600" />
                            <h3 className="font-bold text-retro-black">
                                時間
                            </h3>
                        </div>
                        <p className="text-lg font-medium text-retro-black">
                            {formatDate(event.startTime, 'yyyy年 MM月 dd日 (E)')}
                        </p>
                        <p className="text-lg font-medium text-retro-brown-700">
                            {formatDate(event.startTime, 'HH:mm')} - {formatDate(event.endTime, 'HH:mm')}
                        </p>
                        <p className="text-sm text-retro-brown-600">
                            作成者: {event.createdBy}
                        </p>
                    </div>

                    {/* 参加者情報 */}
                    <div className="rounded-lg p-4 bg-retro-teal-200 border border-retro-teal-500">
                        <div className="flex items-center space-x-2 mb-3">
                            <Users className="w-5 h-5 text-retro-brown-600" />
                            <h3 className="font-bold text-retro-black">
                                暇人 ({event.attendees.length}人)
                            </h3>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {event.attendees.map((attendee, index) => (
                                <div
                                    key={index}
                                    className="relative group inline-flex items-center text-sm px-3 py-2 rounded-full attendee-badge cursor-pointer transition-all duration-200 hover:shadow-md"
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
                                            className="ml-2 opacity-0 group-hover:opacity-100 transition-all duration-200 rounded-full p-0.5 bg-retro-orange-500 hover:bg-retro-orange-600 text-retro-white"
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
                                className="w-full flex items-center justify-center space-x-2 py-3 font-medium rounded-lg transition-all duration-200 transform hover:scale-105 btn-primary"
                            >
                                <UserPlus className="w-5 h-5" />
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

                    {/* 削除ボタン */}
                    <div className="pt-2">
                        <button
                            onClick={handleRemoveClick}
                            className="w-full flex items-center justify-center space-x-2 py-2 font-medium rounded-lg transition-all duration-200 bg-retro-brown-300 text-retro-white hover:bg-red-600"
                        >
                            <Trash2 className="w-4 h-4" />
                            <span>この暇な時間を削除</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
});

EventDetailModal.displayName = 'EventDetailModal'; 