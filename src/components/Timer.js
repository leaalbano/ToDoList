import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import 'react-toastify/dist/ReactToastify.css';
import './styles.css'
import soundFile from '../sounds/timerOff.mp3'

const PomodoroTimer = () => {
    const [timeLeft, setTimeLeft] = useState(10);
    const [isRunning, setIsRunning] = useState(false);

    const sound = new Audio(soundFile);

    const resetTimer = () => {
        setTimeLeft(10);
        setIsRunning(false);
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
          sound.play()
        }
      }, [isRunning, timeLeft]);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return (
        <div className='timer-container'>
            <h1>Pomodoro Timer</h1>
            <CircularProgressbar 
                value={timeLeft} 
                maxValue={10} 
                text={`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`} 
                styles={{
                    root: { width: '30%', paddingBottom: '5px' },
                    path: { stroke: timeLeft > 5 ? '#32CD32' : timeLeft > 2 ? '#FFD700' : '#FF0000' },
                    text: { fill: timeLeft > 5 ? '#32CD32' : timeLeft > 2 ? '#FFD700' : '#FF0000' }
                }}
                />
            <div className="button-container-timer">
                <button onClick={() => setIsRunning(!isRunning)}>
                    {isRunning ? 'Pause' : 'Start'}
                </button>
                <button onClick={resetTimer}>
                    Reset
                </button>
            </div>
            <ToastContainer />
        </div>
    );
};

export default PomodoroTimer;