import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

export default function BlindPrintingSpeedTest() {
  const [ originalText, setOriginalText] = useState('text Test');
  useEffect(()=> {
    axios.get('https://baconipsum.com/api/?type=meat-and-filler&paras=1&format=text')
          .then(response => {
            setOriginalText(response.data);
          })
          .catch(error => {
            console.log(error);
          });
  }, [])

  return  <>
            <h1 className="text-center">Тест скорости слепой печати</h1>
            <p className="no-copy text-center">{originalText}</p>
            <p>Результат ввода:</p>
            <TextInput originalText={originalText}/>
          </>;
};

function TextInput({ originalText }) {
  const [text, setText] = useState('');
  const [highlight, setHighlight] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const [cps, setCPS] = useState(0);
  const [totalChars, setTotalChars] = useState(0);
  const [totalKeystrokes, setTotalKeystrokes] = useState(0);

  const textareaRef = useRef(null);

  const handleTextChange = (event) => {
    const inputText = event.target.value;
    setText(inputText);
    if (inputText === originalText) {
      setEndTime(Date.now());
    }
  };

  const handleKeyDown = (event) => {
    setTotalKeystrokes(totalKeystrokes + 1);
  };

  const getHighlight = (text, originalText) => {
    const maxLength = Math.max(text.length, originalText.length);
    const h = Array(maxLength).fill(null);
    for (let i = 0; i < maxLength; i++) {
      if (text.charAt(i) === originalText.charAt(i)) {
        h[i] = 'green';
      } else {
        h[i] = 'red';
      }
    }
    return h;
  };

  useEffect(() => {
    setHighlight(getHighlight(text, originalText));
    setTotalChars(text.length);
  }, [text, originalText]);

  useEffect(() => {
    if (text.length === 1) {
      setStartTime(Date.now());
    }
  }, [text]);

  useEffect(() => {
    if (startTime && endTime) {
      const timeDiff = endTime - startTime;
      const cps = Math.round((text.length / timeDiff) * 1000 * 60);
      setCPS(cps);
      const accuracy = Math.round(((totalChars / totalKeystrokes) * 100) * 100) / 100;
      setAccuracy(accuracy);
    }
  }, [text, originalText, startTime, endTime, totalChars, totalKeystrokes]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  return (
    <div>
      <div className="result">
        {[...originalText].map((char, index) => (
          <span key={index} style={{ color: highlight[index] }}>
            {text.charAt(index) || ''}
          </span>
        ))}
      </div>
      <p>Текст вводить сюда:</p>
      <textarea className="textInput text-center" ref={textareaRef} value={text} onChange={handleTextChange} onKeyDown={handleKeyDown} />
      {text === originalText ? (
        <p>
          Тест завершен! Скорость печати: {cps} CPS. Точность печати: {accuracy}%.
        </p>
      ) : (
        <p>
          Введите текст выше и начните печатать. Скорость печати и точность будут отображаться здесь после завершения теста.
        </p>
      )}
    </div>
  );
}


