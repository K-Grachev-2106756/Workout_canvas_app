import tickSound from '../sounds/tick.mp3';
import timerEndSound from '../sounds/timerEnd.mp3'

import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { createSmartappDebugger, createAssistant } from "@salutejs/client";



const root = createRoot(document.getElementById('root'));
let globalMode = 'stopwatch';
let timeIsEnd = false;
let stopwatchIsRunning = false;
let timerIsRunning = false;

const formatTime = (time) => {
  const minutes = Math.floor(time / 60).toString().padStart(2, '0');
  const seconds = (time % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
};

const Stopwatch = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);

  
  useEffect(() => {
    let intervalId;
    if (isRunning) {
      intervalId = setInterval(() => {
        const now = Date.now();
        setElapsedTime(now - startTime);
      }, 10);
    }
    return () => {
      clearInterval(intervalId);
    };
  }, [isRunning, startTime]);

  const handleStart = () => {
    stopwatchIsRunning = true;
    setIsRunning(true);
    setStartTime(Date.now() - elapsedTime);
  };

  const handlePause = () => {
    stopwatchIsRunning = false;
    setIsRunning(false);
  };

  const handleReset = () => {
    stopwatchIsRunning = false;
    setIsRunning(false);
    setElapsedTime(0);
  };

  const formatTime = (time) => {
    const milliseconds = Math.floor((time % 1000) / 10);
    const seconds = Math.floor((time / 1000) % 60);
    const minutes = Math.floor((time / 1000 / 60) % 60);

    return (
      ("0" + minutes).slice(-2) +
      ":" +
      ("0" + seconds).slice(-2) +
      ":" +
      ("0" + milliseconds).slice(-2)
    );
  };
  return (
    <div id="main">
      <div id="time">{formatTime(elapsedTime)}</div>
      <div className="controls">
      <div>
          <button id="start" className="button" onClick={isRunning ? handlePause : handleStart}>
            {isRunning ? 'Стоп' : 'Старт'}
          </button>
        </div>
        <div>
          <button id="reset" className="button" onClick={handleReset}>
            Сброс
          </button>
        </div>
      </div>
    </div>
  );
};

const TimerGym = () => {
    const [workTimeConst, setWorkTimeConst] = useState(0);
    const [chillTimeConst, setChillTimeConst] = useState(0);
    const [repToEnd, setRepToEnd] = useState(0);
    const [currentMode, setCurrentMode] = useState('WORK');
    const [isRunning, setIsRunning] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    let audio = useRef();
    const playTickSound = () => {
      audio.current = new Audio(tickSound);
      audio.current.play();
    }
    const platTimerEndSound = () => {
      audio.current = new Audio(timerEndSound);
      audio.current.play();

    }

    const handleChange = (event) => {
      const { id, value } = event.target;
      
      if (id === 'min_input_work' || id === 'sec_input_work') {
        const rawWorkMin = document.getElementById('min_input_work');
        const rawWorkSec = document.getElementById('sec_input_work');
        rawWorkMin.value = Math.max(0, Math.min(59, parseInt(document.getElementById('min_input_work').value))) || '00';
        rawWorkSec.value = Math.max(0, Math.min(59, parseInt(document.getElementById('sec_input_work').value))) || '00';
        rawWorkMin.value = rawWorkMin.value.padStart(2, '0');
        rawWorkSec.value = rawWorkSec.value.padStart(2, '0');
      } else if (id === 'min_input_chill' || id === 'sec_input_chill') {
        const rawChillMin = document.getElementById('min_input_chill');
        const rawChillSec = document.getElementById('sec_input_chill');
        rawChillMin.value = Math.max(0, Math.min(59, parseInt(document.getElementById('min_input_chill').value))) || '00';
        rawChillSec.value = Math.max(0, Math.min(59, parseInt(document.getElementById('sec_input_chill').value))) || '00';
        rawChillMin.value = rawChillMin.value.padStart(2, '0');
        rawChillSec.value = rawChillSec.value.padStart(2, '0');

      } else if (id === 'rep_input') {
        setRepToEnd(parseInt(value) || 1);
        const rawRepLeft = document.getElementById('rep_input');
        rawRepLeft.value = Math.max(1, parseInt(rawRepLeft.value)) || 1;
        rawRepLeft.value = Math.min(100, parseInt(rawRepLeft.value)) || 1;
      }
    };

    useEffect(() => {
      const handleKeyDown = (event) => {
        if (event.key === 'ArrowUp') {
          event.preventDefault();
        }
      };
  
      const numberInputs = document.querySelectorAll('input[type="number"]');
      numberInputs.forEach((input) => {
        input.addEventListener('keydown', handleKeyDown);
      });
  
      // Cleanup event listeners
      return () => {
        numberInputs.forEach((input) => {
          input.removeEventListener('keydown', handleKeyDown);
        });
      };
    }, []);

    const handleStart = () => {
      const rawWorkMin = Math.max(0, Math.min(59, parseInt(document.getElementById('min_input_work').value))) || 0;
      const rawWorkSec = Math.max(0, Math.min(59, parseInt(document.getElementById('sec_input_work').value))) || 0;
      const rawChillMin = Math.max(0, Math.min(59, parseInt(document.getElementById('min_input_chill').value))) || 0;
      const rawChillSec = Math.max(0, Math.min(59, parseInt(document.getElementById('sec_input_chill').value))) || 0;
      
      if ((rawWorkMin + rawWorkSec) !== 0) {
        timerIsRunning = true;
        const workMin = rawWorkMin + Math.floor(rawWorkSec / 60);
        const workSec = rawWorkSec % 60;
        const chillMin = rawChillMin + Math.floor(rawChillSec / 60);
        const chillSec = rawChillSec % 60;
    
        // Save the constants for later use
        setWorkTimeConst(workMin * 60 + workSec);
        setChillTimeConst(chillMin * 60 + chillSec);
        setRepToEnd(parseInt(document.getElementById('rep_input').value) || 1);
        setRepToEnd((prevRepToEnd) => prevRepToEnd);
    
        // Set the initial state
        setCurrentMode('WORK');
        setIsRunning(true);
        setTimeLeft(workMin * 60 + workSec);
      }
    };
    const handleReset = () => {
        timerIsRunning = false;
        setIsRunning(false);
        setWorkTimeConst(0);
        setChillTimeConst(0);
        setRepToEnd(0);
        setCurrentMode('WORK');
        setTimeLeft(0);
        // audio.current.pause();
        // window.soundManager.muteAll();

    };
    const handleClear = () => {
        timerIsRunning = false;
        document.getElementById('min_input_work').value = '';
        document.getElementById('min_input_chill').value = '';
        document.getElementById('sec_input_work').value = '';
        document.getElementById('sec_input_chill').value = '';
        document.getElementById('rep_input').value = '';
    }
    useEffect(() => {
    let timer = null;
    const startWorkTimer = () => {
      setCurrentMode('WORK');
      setTimeLeft(workTimeConst);
    };

    const startChillTimer = () => {
        playTickSound();
        setCurrentMode('CHILL');
        setTimeLeft(chillTimeConst);
    };
    
    const handleTimerTick = () => {
    setTimeLeft((prevTimeLeft) => {
        const newTimeLeft = prevTimeLeft - 1;
        if (newTimeLeft < 0) {
        if (currentMode === 'WORK') {
            if (repToEnd > 0) {
            if (repToEnd - 1 !== 0) {
              startChillTimer();
              setRepToEnd((prevRepToEnd) => prevRepToEnd - 1);
            } else {
              timeIsEnd = true;
              platTimerEndSound();
              timerIsRunning = false;
              root.render(<Menu />)
              setIsRunning(false);
            }
            } 
        } 
        else if (currentMode === 'CHILL') {
          if (repToEnd === 0) {
            return 0
          }  
          playTickSound();
          startWorkTimer();
        }
        }
        return newTimeLeft;
    });
    };

    if (isRunning) {
    if (currentMode === 'WORK' && repToEnd === 0) {
      setIsRunning(false);
      setTimeLeft(0);
    } else {
      timer = setInterval(handleTimerTick, 1000);
    }
    }
    else {
    startWorkTimer();
    }

    return () => {
    clearInterval(timer);
    };
    }, [isRunning, currentMode, workTimeConst, chillTimeConst, repToEnd]);
    
  const training_with_breaks_active = <div>
      <div className='mode'>
        <div id={currentMode === 'WORK' ? 'mode_work' : 'mode_chill'}>
          {(currentMode === 'WORK') ? 'тренировка' : 'отдых'}
        </div>
        <div id = "time">{formatTime(timeLeft)}</div>
        <div id="repLeft">Подходов осталось: {repToEnd}</div>
      </div>
      <div className='controls'>
          <table>
          <div><button className = "button" tabindex="3" id = "start" onClick={handleReset}>Стоп</button></div>
          </table>
      </div>
      </div>
  const training_with_breaks_input = <div>
      <div>
          <table className="inputs">
          <tr id="textOver">
              <th colSpan={3}>тренировка</th>
          </tr>
          <tr>
              <td>
              <input tabindex="3" type="text" id="min_input_work" min="0" max="59" onChange={handleChange} placeholder="00" />
              </td>
              <td id="separator">:</td>
              <td>
              <input tabindex="4" type="text" id="sec_input_work" min="0" max="59" onChange={handleChange} placeholder="00" />
              </td>
          </tr>
          <tr id='space'></tr>
          <tr id="textOver">
              <th colSpan={3}>отдых</th>
          </tr>
          
          <tr>
              <td>
              <input tabindex="5" type="text" id="min_input_chill" min="0" max="59" onChange={handleChange} placeholder="00" />
              </td>
              <td id="separator">:</td>
              <td>
              <input tabindex="6" type="text" id="sec_input_chill" min="0" max="59" onChange={handleChange} placeholder="00" />
              </td>
          </tr>
          <tr id='space'></tr>
          <tr id="textOver">           
              <th colSpan={3}>подходы</th>
          </tr>
          
          <tr >
              <td colSpan="3"><input tabindex="7" type="text" id="rep_input" onChange={handleChange} placeholder="1" /></td>
          </tr>
          </table> 
      </div>
      <div className="controls">
          <div><button id = "start" tabindex="8" className = "button" onClick={handleStart}>Старт</button></div>
          <div><button id = "reset" tabindex="9" className = "button" onClick={handleClear}>Сброс</button></div>
      </div>
      </div>

return (
  <div id="main">
  {isRunning ? (
      training_with_breaks_active
    ) : (
      training_with_breaks_input
    )}
  </div>
);
};

function setModeStopwatch() {
  globalMode = 'stopwatch';
  stopwatchIsRunning = false;
  timerIsRunning = false;
  root.render(<Menu />);
}

function setModeTimer() {
  globalMode = 'timergym';
  stopwatchIsRunning = false;
  timerIsRunning = false;
  root.render(<Menu />);
}

function resetTimeIsEnd() {
  timeIsEnd = false;
  root.render(<Menu />);
}

function resetExternally() {
  const resetButton = document.getElementById('reset');
  resetButton.click();
}

function startStopExternally() {
  const Button = document.getElementById('start');
  Button.click();
}

const Menu = () => {
  const menu = <div id="menu">
    <button tabindex="1" id={globalMode === 'stopwatch' ? 'selected' : 'unselected'} onClick={setModeStopwatch}>Секундомер</button>
    <button tabindex="2" id={globalMode === 'timergym' ? 'selected' : 'unselected'} onClick={setModeTimer}>Кроссфит</button>
  </div>

  if (globalMode === 'timergym' && timeIsEnd) {
    return (
      <>
        {menu}
        <div id='message'>Время вышло</div>
        <div className="controls">
          
          <table>
            <div className='controls'><button tabindex="3" id="reset" className="button" onClick={resetTimeIsEnd}>Сброс</button></div>
          </table>
        </div>
      </>
    )
  }
  else if (globalMode === 'stopwatch') {
    return (
      <>
        {menu}
        <Stopwatch />
      </>
    );
  } else if (globalMode === 'timergym' && !timeIsEnd) {
    return (
      <>
        {menu}
        <TimerGym />
      </>
    );
  } 
};

const initializeAssistant = (getState/*: any*/) => {
  if (process.env.NODE_ENV === "development") {
    return createSmartappDebugger({
      token: process.env.REACT_APP_TOKEN ?? "",
      initPhrase: `Запусти ${process.env.REACT_APP_SMARTAPP}`,
      getState,
    });
  }
  return createAssistant({ getState });
};

export class Whole extends React.Component {

  constructor(props) {
    super(props);
    console.log('constructor');

    this.state = {
      notes: [],
    }

    this.assistant = initializeAssistant(() => this.getStateForAssistant() );
    this.assistant.on("data", (event/*: any*/) => {
      console.log(`assistant.on(data)`, event);
      const { action } = event
      this.dispatchAssistantAction(action);
    });
    this.assistant.on("start", (event) => {
      console.log(`assistant.on(start)`, event);
    });

  }

  componentDidMount() {
    console.log('componentDidMount');
  }

  getStateForAssistant () {
    console.log('getStateForAssistant: this.state:', this.state)
    const state = {
      item_selector: {
        items: this.state.notes.map(
          ({ id, title }, index) => ({
            number: index + 1,
            id,
            title,
          })
        ),
      },
    };
    console.log('getStateForAssistant: state:', state)
    return state;
  }

  dispatchAssistantAction (action) {
    console.log('dispatchAssistantAction', action);
    if (action) {
      switch (action.type) {

        case 'open_stopwatch':
          setModeStopwatch();
          break;

        case 'open_crossfit':
          setModeTimer();
          break;

        case 'start_stopwatch':
            setTimeout(() => {
              startStopExternally();
            }, 100);
          break;
        
        case 'stoppause':
          if ((globalMode === 'stopwatch' && stopwatchIsRunning===true) | (globalMode==='timergym' && timerIsRunning === true)) {
            startStopExternally();
          }
          break;

        case 'check_mode_s':
          this.checkModeStopwatch();
          break;  
        
        case 'check_mode_c': 
          this.checkModeCrossfit();
          break;
          
        case 'reset':
          console.log('reset', action);
          resetExternally();
          break;
        
        case 'check_crossfit':
          this.checkCrossfit();
          break;

        case 'check_stopwatch':
          this.checkStopwatch();
          break;

        case 'start_crossfit':
          startStopExternally();
          break;

        default:
          throw new Error();
      }
    }
  }

  _send_action_value(action_id) {
    const data = {
      action: {
        action_id: action_id,
        parameters: {}
      }
    };

    const unsubscribe = this.assistant.sendData(
      data,
      (data) => {   // функция, вызываемая, если на sendData() был отправлен ответ
        const {type, payload} = data;
        console.log('sendData onData:', type, payload);
        unsubscribe();
      });
  }
  
  checkModeStopwatch(){
    let flag = '';
    if (globalMode === 'stopwatch'){
      flag = 'already';
    }
    else{
      flag = 'mode_is_not_stopwatch';
    }
    
    this._send_action_value(flag);
  }

  checkModeCrossfit(){
    let flag = '';
    if (globalMode === 'timergym'){
      flag = 'already';
    }
    else{
      flag = 'mode_is_not_crossfit';
    }
    
    this._send_action_value(flag);
  }

  checkCrossfit() {
    let flag = '';
    if (globalMode === 'timergym'){
      if(timerIsRunning===true){
        flag = 'already_running';
      }
      else {
        if ((document.getElementById('min_input_work').value !== '') | (document.getElementById('sec_input_work').value !== '')){
          flag = 'crossfit_all_right';
        }
      }
    }
    else{
      setModeTimer();
      flag = 'invalid_crossfit_input';
    }
    
    this._send_action_value(flag);
  }

  checkStopwatch() {
    let flag = '';
    if (stopwatchIsRunning === false) {
      if(globalMode === 'timergym'){
        setModeStopwatch();
      }
      flag = 'is_not_running';
    }
    else{
      flag = 'already_running';
    }
    
    this._send_action_value(flag);
  }

  render() {
    console.log('render');
    return (
      <Menu
      />
    )
  }
}
