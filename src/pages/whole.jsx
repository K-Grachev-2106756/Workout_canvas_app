import React from 'react';
import { useState, useEffect } from 'react';
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

function div(val, by){
  return (val - val % by) / by;
}

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

    const handleStart = () => {
        timerIsRunning = true;
        const rawWorkMin = Math.abs(parseInt(document.getElementById('min_input_work').value)) || 0;
        const rawWorkSec = Math.abs(parseInt(document.getElementById('sec_input_work').value)) || 0;
        const rawChillMin = Math.abs(parseInt(document.getElementById('min_input_chill').value)) || 0;
        const rawChillSec = Math.abs(parseInt(document.getElementById('sec_input_chill').value)) || 0;
        
        const workMin = rawWorkMin + div(rawWorkSec, 60)
        const workSec = rawWorkSec % 60
        const chillMin = rawChillMin + div(rawChillSec, 60)
        const chillSec = rawChillSec % 60
        if (workMin + workSec === 0) {
        return;
        }
        // Save the constants for later use
        setWorkTimeConst(workMin * 60 + workSec);
        setChillTimeConst(chillMin * 60 + chillSec);
        setRepToEnd(parseInt(document.getElementById('rep_input').value) || 1);
        setRepToEnd((prevRepToEnd) => prevRepToEnd);

        // Set the initial state
        setCurrentMode('WORK');
        setIsRunning(true);
        setTimeLeft(workMin * 60 + workSec);
    };
    const handleReset = () => {
        timerIsRunning = false;
        setIsRunning(false);
        setWorkTimeConst(0);
        setChillTimeConst(0);
        setRepToEnd(0);
        setCurrentMode('WORK');
        setTimeLeft(0);
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
      <div>
        <div id='mode_work'>
          {(currentMode === 'WORK') ? 'тренировка' : ''}
        </div>
        <div id='mode_chill'>
          {(currentMode === 'CHILL') ? 'отдых' : ''}
        </div>
          <div id = "time">{formatTime(timeLeft)}</div>
          <div id="repLeft">Подходов осталось: {repToEnd}</div>
      </div>
      <div className='controls'>
          <table>
          <div><button className = "button" id = "start" onClick={handleReset}>Стоп</button></div>
          </table>
      </div>
      </div>
  const training_with_breaks_input = <div>
      <div>
          <table className="inputs">
          <tr id="time_name">
              <th colSpan={3}>тренировка</th>
          </tr>
          <tr>
              <td>
              <input type="number" id="min_input_work" min="0" max="59" placeholder="00" />
              </td>
              <td id="separator">:</td>
              <td>
              <input type="number" id="sec_input_work" min="0" max="59" placeholder="00" />
              </td>
          </tr>
          <tr id='space'></tr>
          <tr id="time_name">
              <th colSpan={3}>отдых</th>
          </tr>
          
          <tr>
              <td>
              <input type="number" id="min_input_chill" min="0" max="59" placeholder="00" />
              </td>
              <td id="separator">:</td>
              <td>
              <input type="number" id="sec_input_chill" min="0" max="59" placeholder="00" />
              </td>
          </tr>
          <tr id='space'></tr>
          <tr id="time_name">
              
              <th colSpan={3}>подходы</th>
          </tr>
          
          <tr >
              <td colSpan="3"><input type="number" id="rep_input" placeholder="1" /></td>
          </tr>
          </table> 
      </div>
      <div className="controls">
          <div><button id = "start" className = "button" onClick={handleStart}>Старт</button></div>
          <div><button id = "reset" className = "button" onClick={handleClear}>Сброс</button></div>
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
    <button id={globalMode === 'stopwatch' ? 'selected' : ''} onClick={setModeStopwatch}>Секундомер</button>
    <button id={globalMode === 'timergym' ? 'selected' : ''} onClick={setModeTimer}>Кроссфит</button>
  </div>

  if (globalMode === 'timergym' && timeIsEnd) {
    return (
      <>
        {menu}
        <div id='message'>Время вышло</div>
        <div className="controls">
          
          <table>
            <div className='controls'><button id="reset" className="button" onClick={resetTimeIsEnd}>Сброс</button></div>
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
