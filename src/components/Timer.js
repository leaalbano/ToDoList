import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import 'react-toastify/dist/ReactToastify.css';
import './styles.css';
import soundFile from '../sounds/timerOff.mp3';

const PomodoroTimer = () => {
    const [timeLeft, setTimeLeft] = useState(10);
    const [isRunning, setIsRunning] = useState(false);
    const [selectedTime, setSelectedTime] = useState(10);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [pomodoroTime, setPomodoroTime] = useState(10);
    const [shortBreakTime, setShortBreakTime] = useState(5);
    const [longBreakTime, setLongBreakTime] = useState(15);
    const [lastChanged, setLastChanged] = useState('pomodoro'); // Added this line to keep track of the last changed button

    const sound = new Audio(soundFile);

    const resetTimer = () => {
        setIsRunning(false);
        setSettingsOpen(false);
        switch(lastChanged) {
            case 'pomodoro':
                setSelectedTime(pomodoroTime);
                setTimeLeft(pomodoroTime);
                break;
            case 'shortBreak':
                setSelectedTime(shortBreakTime);
                setTimeLeft(shortBreakTime);
                break;
            case 'longBreak':
                setSelectedTime(longBreakTime);
                setTimeLeft(longBreakTime);
                break;
            default:
                setSelectedTime(pomodoroTime);
                setTimeLeft(pomodoroTime);
        }
    };

    useEffect(() => {
        if (timeLeft > 0 && isRunning) {
            const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timerId);
        } else if (timeLeft === 0) {
            toast('Time is up!', {
                onClick: () => {
                    resetTimer();
                }
            });
            sound.play();
        }
    }, [isRunning, timeLeft, selectedTime]);

    useEffect(() => {
        setTimeLeft(selectedTime);
    }, [selectedTime]);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return (
        <div className='timer-container'>
            <h1>Pomodoro Timer</h1>
            <div className="timer-options">
                <button className={`timer-option ${selectedTime === pomodoroTime ? 'selected' : ''}`} onClick={() => {setSelectedTime(pomodoroTime); setLastChanged('pomodoro');}}>Pomodoro</button>
                <button className={`timer-option ${selectedTime === shortBreakTime ? 'selected' : ''}`} onClick={() => {setSelectedTime(shortBreakTime); setLastChanged('shortBreak');}}>Short Break</button>
                <button className={`timer-option ${selectedTime === longBreakTime ? 'selected' : ''}`} onClick={() => {setSelectedTime(longBreakTime); setLastChanged('longBreak');}}>Long Break</button>
            </div>
            {settingsOpen && (
                <div className="timer-settings">
                    <label>Pomodoro Time: <input type="number" value={pomodoroTime} onChange={e => {setPomodoroTime(parseInt(e.target.value)); setLastChanged('pomodoro');}} /></label>
                    <label>Short Break Time: <input type="number" value={shortBreakTime} onChange={e => {setShortBreakTime(parseInt(e.target.value)); setLastChanged('shortBreak');}} /></label>
                    <label>Long Break Time: <input type="number" value={longBreakTime} onChange={e => {setLongBreakTime(parseInt(e.target.value)); setLastChanged('longBreak');}} /></label>
                    <button className="timer-button" onClick={resetTimer}>Apply</button>
                </div>
            )}
            <CircularProgressbar 
                value={timeLeft} 
                maxValue={selectedTime} 
                text={`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`} 
                styles={{
                    root: { width: '30%', paddingBottom: '5px' },
                    path: { stroke: timeLeft > 5 ? '#32CD32' : timeLeft > 2 ? '#FFD700' : '#FF0000' },
                    text: { fill: timeLeft > 5 ? '#32CD32' : timeLeft > 2 ? '#FFD700' : '#FF0000' }
                }}
            />
            <div className="button-container-timer">
                <button className="timer-button" onClick={() => setIsRunning(!isRunning)}>
                    {isRunning ? 'Pause' : 'Start'}
                </button>
                <button className="timer-button" onClick={resetTimer}>
                    Reset
                </button>
                <button className="timer-button" onClick={() => setSettingsOpen(!settingsOpen)}>Settings</button>
            </div>
            <ToastContainer />
        </div>
    );
};

export default PomodoroTimer;