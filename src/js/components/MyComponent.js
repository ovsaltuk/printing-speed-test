import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

export default function BlindPrintingSpeedTest() {
  const [ originalText, setOriginalText] = useState('');
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
            <h1>Тест скорости слепой печати</h1>
            <p>{originalText}</p>
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

  const textareaRef = useRef(null);

  const handleTextChange = (event) => {
    const inputText = event.target.value;
    setText(inputText);
    setTotalChars(inputText.length);
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
  }, [text, originalText]);

  useEffect(() => {
    if (text.length === 1) {
      setStartTime(Date.now());
    }
    if (text === originalText) {
      setEndTime(Date.now());
    }
  }, [text, originalText]);

  useEffect(() => {
    if (startTime && endTime) {
      const timeDiff = endTime - startTime;
      const cps = Math.round((text.length / timeDiff) * 1000 * 60);
      setCPS(cps);
      const accuracy = Math.round((originalText.length / totalChars) * 100);
      setAccuracy(accuracy);
    }
  }, [text, originalText, startTime, endTime, totalChars]);

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
      <textarea className="textInput" ref={textareaRef} value={text} onChange={handleTextChange} />
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

