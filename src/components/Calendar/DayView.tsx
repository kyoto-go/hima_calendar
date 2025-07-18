import React, { useEffect, useState } from 'react';
import { CalendarEvent } from '@/types/calendar';
import { formatTime } from '@/utils/dateUtils';
import { EventCard } from './EventCard';

interface DayViewProps {
    events: CalendarEvent[];
    selectedDate: Date;
    onJoinEvent: (eventId: string, attendeeName: string) => void;
    onRemoveAttendee: (eventId: string, attendeeName: string) => void;
    onDeleteEvent: (eventId: string) => void;
    onEventClick?: (event: CalendarEvent) => void;
}

export const DayView: React.FC<DayViewProps> = ({
    events,
    selectedDate,
    onJoinEvent,
    onRemoveAttendee,
    onDeleteEvent,
    onEventClick
}) => {
    const [currentTime, setCurrentTime] = useState(new Date());
    
    // 現在時刻を1分ごとに更新
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000); // 1分ごと
        
        return () => clearInterval(timer);
    }, []);
    
    // マウント時に現在時刻にスクロール
    useEffect(() => {
        const isToday = selectedDate.toDateString() === new Date().toDateString();
        if (isToday) {
            scrollToCurrentTime();
        }
    }, [selectedDate]);
    // 対象日のイベントを取得
    const dayEvents = events.filter(event => {
        const eventDate = new Date(event.startTime);
        return eventDate.toDateString() === selectedDate.toDateString();
    });
    
    // イベントの重なりを計算して列を割り当てる
    const calculateEventColumns = () => {
        const sortedEvents = [...dayEvents].sort((a, b) => {
            const aStart = new Date(a.startTime).getTime();
            const bStart = new Date(b.startTime).getTime();
            if (aStart !== bStart) return aStart - bStart;
            const aEnd = new Date(a.endTime).getTime();
            const bEnd = new Date(b.endTime).getTime();
            return bEnd - aEnd; // 長いイベントを先に
        });
        
        const eventColumns: { event: CalendarEvent; column: number; totalColumns: number }[] = [];
        const activeColumns: { endTime: number }[] = [];
        
        sortedEvents.forEach(event => {
            const startTime = new Date(event.startTime).getTime();
            const endTime = new Date(event.endTime).getTime();
            
            // 終了したイベントの列を解放
            activeColumns.forEach((col, index) => {
                if (col && col.endTime <= startTime) {
                    activeColumns[index] = null as any;
                }
            });
            
            // 空いている列を探す
            let column = activeColumns.findIndex(col => !col);
            if (column === -1) {
                column = activeColumns.length;
                activeColumns.push({ endTime });
            } else {
                activeColumns[column] = { endTime };
            }
            
            eventColumns.push({ event, column, totalColumns: 1 });
        });
        
        // 各イベントの総列数を計算
        eventColumns.forEach((item, index) => {
            const itemStart = new Date(item.event.startTime).getTime();
            const itemEnd = new Date(item.event.endTime).getTime();
            
            let maxColumn = item.column;
            
            // 重なっている他のイベントを確認
            eventColumns.forEach((other, otherIndex) => {
                if (index === otherIndex) return;
                
                const otherStart = new Date(other.event.startTime).getTime();
                const otherEnd = new Date(other.event.endTime).getTime();
                
                // 時間が重なっているか確認
                if (itemStart < otherEnd && itemEnd > otherStart) {
                    maxColumn = Math.max(maxColumn, other.column);
                }
            });
            
            item.totalColumns = maxColumn + 1;
        });
        
        return eventColumns;
    };
    
    const eventColumns = calculateEventColumns();

    // 6:00から23:50まで10分間隔の時間スロットを生成
    const generateTimeSlots = () => {
        const slots = [];
        for (let hour = 6; hour < 24; hour++) {
            for (let minute = 0; minute < 60; minute += 10) {
                slots.push({ hour, minute });
            }
        }
        return slots;
    };

    const timeSlots = generateTimeSlots();




    // 現在時刻のインジケーター位置を計算
    const getCurrentTimePosition = () => {
        const now = currentTime;
        const isToday = selectedDate.toDateString() === now.toDateString();
        
        if (!isToday) return null;
        
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        
        // 6:00〜23:50の範囲外なら表示しない
        if (currentHour < 6 || currentHour >= 24) return null;
        
        const minutesFromBase = (currentHour - 6) * 60 + currentMinute;
        const position = (minutesFromBase / 10) * 48; // モバイル
        const positionMd = (minutesFromBase / 10) * 64; // デスクトップ
        
        return { position, positionMd };
    };
    
    const currentTimePos = getCurrentTimePosition();
    
    // 現在時刻にスクロールする関数
    const scrollToCurrentTime = () => {
        const now = new Date();
        const currentHour = now.getHours();
        
        if (currentHour < 6 || currentHour >= 24) return;
        
        // 現在時刻のスロットを探す
        const currentSlot = document.getElementById('current-time-slot');
        if (currentSlot) {
            const container = document.getElementById('day-view-container');
            if (container) {
                const containerRect = container.getBoundingClientRect();
                const slotRect = currentSlot.getBoundingClientRect();
                const scrollTop = container.scrollTop + slotRect.top - containerRect.top - (containerRect.height / 2) + (slotRect.height / 2);
                container.scrollTo({
                    top: scrollTop,
                    behavior: 'smooth'
                });
            }
        }
    };
    
    return (
        <div className="space-y-0 relative overflow-y-auto" id="day-view-container" style={{ maxHeight: 'calc(100vh - 200px)' }}>
            <div className="relative">
                {timeSlots.map(({ hour, minute }) => {
                    const timeString = formatTime(hour, minute);
                    const slotId = hour === currentTime.getHours() && minute <= currentTime.getMinutes() && minute + 10 > currentTime.getMinutes() ? 'current-time-slot' : undefined;

                    return (
                        <div key={timeString} id={slotId} className="flex relative h-12 md:h-16">
                            {/* 時間表示 */}
                            <div className="w-12 md:w-16 text-xs md:text-sm text-retro-brown-600 font-medium py-2 pr-2 text-right flex-shrink-0">
                                {minute === 0 ? timeString : ''}
                            </div>

                            {/* イベントカードエリア */}
                            <div className="flex-1 border-b border-retro-ivory-300/50 time-slot relative">
                                {minute === 0 && (
                                    <div className="absolute inset-x-0 top-0 border-t border-retro-brown-200/30"></div>
                                )}
                            </div>
                        </div>
                    );
                })}

                {/* 絶対配置でイベントカードを配置 */}
                <div className="absolute top-0 left-12 md:left-16 right-0">
                {eventColumns.map(({ event, column, totalColumns }) => {
                    const eventStartTime = new Date(event.startTime);
                    const eventEndTime = new Date(event.endTime);
                    const startHour = eventStartTime.getHours();
                    const startMinute = eventStartTime.getMinutes();
                    const endHour = eventEndTime.getHours();
                    const endMinute = eventEndTime.getMinutes();
                    
                    // 開始位置を計算（6:00を基準とした分数）
                    const startMinutesFromBase = (startHour - 6) * 60 + startMinute;
                    const endMinutesFromBase = (endHour - 6) * 60 + endMinute;
                    const topPosition = (startMinutesFromBase / 10) * 48; // モバイル: 48px per slot
                    const topPositionMd = (startMinutesFromBase / 10) * 64; // デスクトップ: 64px per slot
                    
                    const durationMinutes = endMinutesFromBase - startMinutesFromBase;
                    const heightPx = (durationMinutes / 10) * 48; // モバイル: 48px per 10min
                    const heightPxMd = (durationMinutes / 10) * 64; // デスクトップ: 64px per 10min
                    
                    // 列に基づく位置計算
                    const widthPercentage = 100 / totalColumns;
                    const leftPercentage = column * widthPercentage;
                    
                    return (
                        <React.Fragment key={event.id}>
                            {/* モバイル表示 */}
                            <div 
                                className="absolute md:hidden pr-1"
                                style={{
                                    top: `${topPosition}px`,
                                    left: `${leftPercentage}%`,
                                    width: `${widthPercentage}%`,
                                    height: `${heightPx}px`
                                }}
                            >
                                <EventCard
                                    event={event}
                                    onJoinEvent={onJoinEvent}
                                    onRemoveEvent={onDeleteEvent}
                                    onRemoveAttendee={onRemoveAttendee}
                                    onDetailClick={onEventClick}
                                    compact={true}
                                    fullHeight={true}
                                />
                            </div>
                            
                            {/* デスクトップ表示 */}
                            <div 
                                className="absolute hidden md:block pr-2"
                                style={{
                                    top: `${topPositionMd}px`,
                                    left: `${leftPercentage}%`,
                                    width: `${widthPercentage}%`,
                                    height: `${heightPxMd}px`
                                }}
                            >
                                <EventCard
                                    event={event}
                                    onJoinEvent={onJoinEvent}
                                    onRemoveEvent={onDeleteEvent}
                                    onRemoveAttendee={onRemoveAttendee}
                                    onDetailClick={onEventClick}
                                    compact={totalColumns > 1}
                                    fullHeight={true}
                                />
                            </div>
                        </React.Fragment>
                    );
                })}
                </div>
                
                {/* 現在時刻インジケーター */}
                {currentTimePos && (
                    <>
                        {/* モバイル表示 */}
                        <div 
                            id="current-time-indicator"
                            className="absolute left-0 right-0 pointer-events-none z-20 md:hidden"
                            style={{ top: `${currentTimePos.position}px` }}
                        >
                            <div className="flex items-center">
                                <div 
                                    className="w-12 pr-2 text-right text-xs font-bold"
                                    style={{ color: 'var(--retro-orange-600)' }}
                                >
                                    {formatTime(currentTime.getHours(), currentTime.getMinutes())}
                                </div>
                                <div 
                                    className="flex-1 h-1"
                                    style={{ backgroundColor: 'var(--retro-orange-600)' }}
                                >
                                    <div 
                                        className="w-3 h-3 rounded-full -mt-1 -ml-1.5"
                                        style={{ backgroundColor: 'var(--retro-orange-600)' }}
                                    />
                                </div>
                            </div>
                        </div>
                        
                        {/* デスクトップ表示 */}
                        <div 
                            className="absolute left-0 right-0 pointer-events-none z-20 hidden md:flex"
                            style={{ top: `${currentTimePos.positionMd}px` }}
                        >
                            <div className="flex items-center">
                                <div 
                                    className="w-16 pr-2 text-right text-sm font-bold"
                                    style={{ color: 'var(--retro-orange-600)' }}
                                >
                                    {formatTime(currentTime.getHours(), currentTime.getMinutes())}
                                </div>
                                <div 
                                    className="flex-1 h-1"
                                    style={{ backgroundColor: 'var(--retro-orange-600)' }}
                                >
                                    <div 
                                        className="w-4 h-4 rounded-full -mt-1.5 -ml-2"
                                        style={{ backgroundColor: 'var(--retro-orange-600)' }}
                                    />
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}; 