import React, { memo, useState, useCallback } from 'react';
import { CalendarEvent } from '@/types/calendar';
import { X, User } from 'lucide-react';
import { formatDate } from '@/utils/dateUtils';
import { addMinutes } from 'date-fns';

interface EventFormProps {
    selectedDate: Date;
    onAddEvent: (event: Omit<CalendarEvent, 'id' | 'createdAt'>) => void;
    onCancel: () => void;
}

export const EventForm = memo<EventFormProps>(({
    selectedDate,
    onAddEvent,
    onCancel,
}) => {
    const [name, setName] = useState('');
    const [startTime, setStartTime] = useState('09:00');
    const [duration, setDuration] = useState(60); // デフォルト60分

    const handleSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        const [hours, minutes] = startTime.split(':').map(Number);
        const eventStartTime = new Date(selectedDate);
        eventStartTime.setHours(hours, minutes, 0, 0);

        const eventEndTime = addMinutes(eventStartTime, duration);

        // 1つの連続したイベントを作成
        const newEvent: Omit<CalendarEvent, 'id' | 'createdAt'> = {
            startTime: eventStartTime,
            endTime: eventEndTime,
            attendees: [name.trim()],
            createdBy: name.trim(),
        };

        onAddEvent(newEvent);
    }, [name, startTime, duration, selectedDate, onAddEvent]);

    const durationOptions = [
        { value: 30, label: '30分' },
        { value: 60, label: '1時間' },
        { value: 90, label: '1時間30分' },
        { value: 120, label: '2時間' },
        { value: 180, label: '3時間' },
        { value: 240, label: '4時間' },
    ];

    return (
        <div
            className="fixed inset-0 flex items-center justify-center z-50 p-4 animate-fadeIn"
            style={{
                backgroundColor: 'rgba(0, 0, 0, 0.7)'
            }}
        >
            <div
                className="rounded-2xl shadow-2xl p-6 w-full max-w-md animate-slideInUp"
                style={{
                    backgroundColor: 'var(--retro-ivory-100)',
                    borderColor: 'var(--retro-orange-500)',
                    borderWidth: '2px'
                }}
            >
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-2">
                        <span className="text-2xl">😴</span>
                        <h2
                            className="text-xl font-bold"
                            style={{ color: 'var(--retro-black)' }}
                        >
                            暇な時間を登録
                        </h2>
                    </div>
                    <button
                        onClick={onCancel}
                        className="p-2 rounded-lg transition-all duration-200 transform hover:scale-110"
                        style={{
                            color: 'var(--retro-brown-500)'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.color = 'var(--retro-white)';
                            e.currentTarget.style.backgroundColor = 'var(--retro-orange-500)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.color = 'var(--retro-brown-500)';
                            e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                        aria-label="閉じる"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* 日付表示 */}
                    <div
                        className="rounded-lg p-3"
                        style={{
                            backgroundColor: 'var(--retro-mustard-200)',
                            borderColor: 'var(--retro-mustard-400)',
                            borderWidth: '1px'
                        }}
                    >
                        <p
                            className="text-sm font-medium text-center"
                            style={{ color: 'var(--retro-brown-800)' }}
                        >
                            📅 {formatDate(selectedDate, 'yyyy年 MM月 dd日 (E)')}
                        </p>
                    </div>

                    {/* お名前 */}
                    <div>
                        <label
                            htmlFor="name"
                            className="block text-sm font-bold mb-2"
                            style={{ color: 'var(--retro-black)' }}
                        >
                            <div className="flex items-center space-x-2">
                                <User className="w-4 h-4" />
                                <span>お名前</span>
                            </div>
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="暇人のお名前を入力"
                            className="w-full px-3 py-3 rounded-lg focus:outline-none focus:ring-2 border"
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
                            required
                            autoFocus
                        />
                    </div>

                    {/* 開始時刻 */}
                    <div>
                        <label
                            htmlFor="startTime"
                            className="block text-sm font-bold mb-2"
                            style={{ color: 'var(--retro-black)' }}
                        >
                            開始時刻
                        </label>
                        <input
                            type="time"
                            id="startTime"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            className="w-full px-3 py-3 rounded-lg focus:outline-none focus:ring-2 border"
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
                            required
                        />
                    </div>

                    {/* 時間の長さ */}
                    <div>
                        <label
                            htmlFor="duration"
                            className="block text-sm font-bold mb-2"
                            style={{ color: 'var(--retro-black)' }}
                        >
                            暇な時間の長さ
                        </label>
                        <select
                            id="duration"
                            value={duration}
                            onChange={(e) => setDuration(Number(e.target.value))}
                            className="w-full px-3 py-3 rounded-lg focus:outline-none focus:ring-2 border"
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
                        >
                            {durationOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* 終了時刻表示 */}
                    <div
                        className="rounded-lg p-3"
                        style={{
                            backgroundColor: 'var(--retro-teal-200)',
                            borderColor: 'var(--retro-teal-500)',
                            borderWidth: '2px'
                        }}
                    >
                        <div
                            className="text-sm"
                            style={{ color: 'var(--retro-black)' }}
                        >
                            <span className="font-medium">終了時刻: </span>
                            {(() => {
                                const [hours, minutes] = startTime.split(':').map(Number);
                                const start = new Date(selectedDate);
                                start.setHours(hours, minutes, 0, 0);
                                const end = addMinutes(start, duration);
                                return formatDate(end, 'HH:mm');
                            })()}
                        </div>
                    </div>

                    {/* ボタン */}
                    <div className="flex space-x-3 pt-2">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 px-4 py-3 font-medium rounded-lg transition-all duration-200 transform hover:scale-105"
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
                        <button
                            type="submit"
                            className="flex-1 px-4 py-3 font-bold rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{
                                backgroundColor: name.trim()
                                    ? 'var(--retro-orange-500)'
                                    : 'var(--retro-brown-200)',
                                color: 'var(--retro-white)'
                            }}
                            onMouseEnter={(e) => {
                                if (name.trim()) {
                                    e.currentTarget.style.backgroundColor = 'var(--retro-orange-600)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (name.trim()) {
                                    e.currentTarget.style.backgroundColor = 'var(--retro-orange-500)';
                                }
                            }}
                            disabled={!name.trim()}
                        >
                            暇時間を登録
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
});

EventForm.displayName = 'EventForm'; 