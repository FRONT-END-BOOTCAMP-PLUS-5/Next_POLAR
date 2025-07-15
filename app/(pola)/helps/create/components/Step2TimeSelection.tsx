'use client';

import React, { useState } from 'react';
import styles from './Step2TimeSelection.module.css';

interface Step2TimeSelectionProps {
  selectedTimeType: string | null;
  selectedDate: string;
  selectedStartTime: string;
  selectedEndTime: string;
  onTimeTypeSelect: (type: string) => void;
  onDateChange: (date: string) => void;
  onStartTimeChange: (time: string) => void;
  onEndTimeChange: (time: string) => void;
}

const Step2TimeSelection: React.FC<Step2TimeSelectionProps> = ({
  selectedTimeType,
  selectedDate,
  selectedStartTime,
  selectedEndTime,
  onTimeTypeSelect,
  onDateChange,
  onStartTimeChange,
  onEndTimeChange,
}) => {
  const [showTimeGrid, setShowTimeGrid] = useState(false);
  const [showEndTimeGrid, setShowEndTimeGrid] = useState(false);

  const timeTypes = [
    {
      id: 'now',
      label: '지금 당장',
      description: '바로 도움이 필요해요',
    },
    {
      id: 'tomorrow',
      label: '내일',
      description: '내일 도움이 필요해요',
    },
    {
      id: 'specific',
      label: '특정 날짜',
      description: '원하는 날짜와 시간을 선택해요',
    },
  ];

  const timeSlots = [
    '07:00',
    '07:30',
    '08:00',
    '08:30',
    '09:00',
    '09:30',
    '10:00',
    '10:30',
    '11:00',
    '11:30',
    '12:00',
    '12:30',
    '13:00',
    '13:30',
    '14:00',
    '14:30',
    '15:00',
    '15:30',
    '16:00',
    '16:30',
    '17:00',
    '17:30',
    '18:00',
    '18:30',
    '19:00',
    '19:30',
    '20:00',
    '20:30',
    '21:00',
    '21:30',
    '22:00',
  ];

  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const handleTimeTypeSelect = (type: string) => {
    onTimeTypeSelect(type);
    if (type === 'now') {
      onDateChange(getCurrentDate());
      onStartTimeChange(new Date().toLocaleTimeString());
      onEndTimeChange(new Date().toLocaleTimeString());
    } else if (type === 'tomorrow') {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      onDateChange(tomorrow.toISOString().split('T')[0]);
      // 내일은 시간을 선택하도록 빈 값으로 설정
      onStartTimeChange('');
      onEndTimeChange('');
    }
  };

  const formatTimeDisplay = (time: string) => {
    if (time === 'now') return '지금';
    const hour = parseInt(time.split(':')[0]);
    const minute = time.split(':')[1];
    const period = hour < 12 ? '오전' : '오후';
    let displayHour = hour < 12 ? hour : hour - 12;
    if (displayHour === 0) displayHour = 12;
    return `${period} ${displayHour}:${minute}`;
  };

  return (
    <div className={styles.stepContent}>
      <h2 className={styles.stepTitle}>2단계 언제 도움을 받고 싶으세요?</h2>

      <div className={styles.timeSection}>
        <div className={styles.timeOptions}>
          {timeTypes.map((type) => (
            <div
              key={type.id}
              className={`${styles.timeOption} ${
                selectedTimeType === type.id ? styles.timeOptionSelected : ''
              }`}
              onClick={() => handleTimeTypeSelect(type.id)}
            >
              <div className={styles.timeOptionLabel}>{type.label}</div>
              <div className={styles.timeOptionDescription}>
                {type.description}
              </div>
            </div>
          ))}
        </div>

        {(selectedTimeType === 'specific' ||
          selectedTimeType === 'tomorrow') && (
          <div className={styles.dateTimeInputs}>
            {selectedTimeType === 'specific' && (
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>특정 날짜</label>
                <input
                  type='date'
                  className={styles.input}
                  value={selectedDate}
                  onChange={(e) => onDateChange(e.target.value)}
                  min={getCurrentDate()}
                />
              </div>
            )}

            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>시작시간</label>
              <input
                type='text'
                className={styles.input}
                value={
                  selectedStartTime ? formatTimeDisplay(selectedStartTime) : ''
                }
                onClick={() => setShowTimeGrid(!showTimeGrid)}
                readOnly
                placeholder='시간을 선택해주세요'
              />
              {showTimeGrid && (
                <div className={styles.timeGrid}>
                  {timeSlots.map((time) => (
                    <div
                      key={time}
                      className={`${styles.timeSlot} ${
                        selectedStartTime === time
                          ? styles.timeSlotSelected
                          : ''
                      }`}
                      onClick={() => {
                        onStartTimeChange(time);
                        setShowTimeGrid(false);
                      }}
                    >
                      {formatTimeDisplay(time)}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>종료시간</label>
              <input
                type='text'
                className={styles.input}
                value={
                  selectedEndTime ? formatTimeDisplay(selectedEndTime) : ''
                }
                onClick={() => setShowEndTimeGrid(!showEndTimeGrid)}
                readOnly
                placeholder='시간을 선택해주세요'
              />
              {showEndTimeGrid && (
                <div className={styles.timeGrid}>
                  {timeSlots.map((time) => (
                    <div
                      key={time}
                      className={`${styles.timeSlot} ${
                        selectedEndTime === time ? styles.timeSlotSelected : ''
                      }`}
                      onClick={() => {
                        onEndTimeChange(time);
                        setShowEndTimeGrid(false);
                      }}
                    >
                      {formatTimeDisplay(time)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Step2TimeSelection;
