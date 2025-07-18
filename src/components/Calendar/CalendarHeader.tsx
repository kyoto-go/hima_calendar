import React, { memo, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Calendar, List } from 'lucide-react';
import { ViewMode } from '@/types/calendar';
import { formatDate } from '@/utils/dateUtils';
import { addMonths, subMonths, addDays, subDays } from 'date-fns';
import clsx from 'clsx';

interface CalendarHeaderProps {
    selectedDate: Date;
    viewMode: ViewMode;
    onDateChange: (date: Date) => void;
    onViewModeChange: (mode: ViewMode) => void;
}

export const CalendarHeader = memo<CalendarHeaderProps>(({
    selectedDate,
    viewMode,
    onDateChange,
    onViewModeChange,
}) => {
    const handlePrevMonth = useCallback(() => {
        if (viewMode === 'month') {
            onDateChange(subMonths(selectedDate, 1));
        } else {
            onDateChange(subDays(selectedDate, 1));
        }
    }, [selectedDate, onDateChange, viewMode]);

    const handleNextMonth = useCallback(() => {
        if (viewMode === 'month') {
            onDateChange(addMonths(selectedDate, 1));
        } else {
            onDateChange(addDays(selectedDate, 1));
        }
    }, [selectedDate, onDateChange, viewMode]);

    const handleToday = useCallback(() => {
        onDateChange(new Date());
    }, [onDateChange]);

    const handleMonthView = useCallback(() => {
        onViewModeChange('month');
    }, [onViewModeChange]);

    const handleDayView = useCallback(() => {
        onViewModeChange('day');
    }, [onViewModeChange]);

    return (
        <header className="sticky top-0 z-20 shadow-sm calendar-header">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-14">
                    {/* 左側：ロゴとタイトル */}
                    <div className="flex items-center space-x-2 animate-slideInLeft">
                        <span className="text-xl">🕘</span>
                        <h1 className="text-lg font-medium text-retro-white">
                            ひまカレ
                        </h1>
                    </div>

                    {/* 中央：日付ナビゲーション */}
                    <div className="flex items-center space-x-3 animate-slideInUp">
                        <button
                            onClick={handlePrevMonth}
                            className="p-1.5 rounded transition-all duration-150 text-retro-white hover:bg-retro-teal-500"
                            aria-label="前"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>

                        <div className="text-center min-w-0">
                            <h2 className="text-sm font-medium text-retro-white whitespace-nowrap">
                                {viewMode === 'month'
                                    ? formatDate(selectedDate, 'yyyy年 MM月')
                                    : formatDate(selectedDate, 'MM月 dd日')
                                }
                            </h2>
                        </div>

                        <button
                            onClick={handleNextMonth}
                            className="p-1.5 rounded transition-all duration-150 text-retro-white hover:bg-retro-teal-500"
                            aria-label="次"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>

                    {/* 右側：ビューモード切り替え */}
                    <div className="flex items-center space-x-2 animate-slideInRight">
                        <button
                            onClick={handleToday}
                            className="hidden sm:flex px-2 py-1 text-xs font-medium rounded bg-retro-teal-500 text-retro-white hover:bg-retro-teal-600 transition-colors"
                        >
                            今日
                        </button>

                        <div className="flex rounded bg-retro-teal-500/20 p-0.5">
                            <button
                                onClick={handleMonthView}
                                className={clsx(
                                    "flex items-center px-2 py-1 text-xs font-medium rounded transition-all",
                                    viewMode === 'month'
                                        ? "bg-retro-white text-retro-teal-600"
                                        : "text-retro-white hover:bg-retro-teal-500/30"
                                )}
                            >
                                <Calendar className="w-3 h-3" />
                                <span className="ml-1 hidden sm:inline">月</span>
                            </button>
                            <button
                                onClick={handleDayView}
                                className={clsx(
                                    "flex items-center px-2 py-1 text-xs font-medium rounded transition-all",
                                    viewMode === 'day'
                                        ? "bg-retro-white text-retro-teal-600"
                                        : "text-retro-white hover:bg-retro-teal-500/30"
                                )}
                            >
                                <List className="w-3 h-3" />
                                <span className="ml-1 hidden sm:inline">日</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
});

CalendarHeader.displayName = 'CalendarHeader'; 