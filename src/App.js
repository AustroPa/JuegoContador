import React, { useState, useEffect, useTransition } from 'react';
import './App.css';
import styles from './App.css';


const StatusMessage = ({ status }) => {//Este componente recibe el estado del juego y muestra el texto dependiendo del estado
  switch (status) {
    case 'Prep':
      return <p className='subtitle'  id="preparado">Preparados...</p>;
    case 'Listo':
      return <p className='subtitle' id="listo">Listos...</p>;
    case 'Comienza':
      return <p className='subtitle' id="ya">¡Ya!</p>;
    case 'Final':
      return <p className='subtitle'>Fin del juego</p>;
    default:
      return <p className='subtitle'>¡Bienvenido al juego! Al iniciar el juego tendrás 5 segundos para clickear en el boton, ¡Buena Suerte!</p>;
  }
};

const CounterGame = () => { //Este componente es el juego en sí
  const [contador, setCont] = useState(0); 
  const [puntajeMax, setHighScore] = useState(() => {//Guarda el puntaje máximo en el local storage
    return parseInt(localStorage.getItem('puntajeMax')) || 0;
  });
  const [timeLeft, setTimeLeft] = useState(null); // Tiempo restante
  const [status, setStatus] = useState('start'); 
  const [isPending, startTransition] = useTransition(); // 

  const startGame = () => {
    resetGame();
    startTransition(() => {
      setStatus('Prep');
      runCountdown();
    });
  };

  const resetGame = () => {
    setCont(0);
    setTimeLeft(null);
  };

  const runCountdown = () => {
    let countdown = 3;
    const countdownInterval = setInterval(() => { // Intervalo de tiempo para el conteo regresivo
      startTransition(() => {
        if (countdown === 1) {
          clearInterval(countdownInterval);
          setStatus('Comienza'); //Cambia el estado a "Comienza" cuando el contador llega a 1 para despues mostrar el botón de "Click Aquí"
          setTimeLeft(5);
        } else {
          countdown--;
          setStatus(countdown === 2 ? 'Prep' : 'Listo');
        }
      });
    }, 1000);
  };

  useEffect(() => {
    if (timeLeft === null) return;
    if (timeLeft === 0) {
      endGame();
      return;
    }

    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  const endGame = () => {
    setStatus('Final');
    if (contador > puntajeMax) { //Compara el puntaje actual con el puntaje máximo y si es mayor lo actualiza
      setHighScore(contador);
      localStorage.setItem('puntajeMax', contador); //Guarda el puntaje máximo en el local storage
    }
  };

  const handleClick = () => {
    if (status === 'Comienza') setCont(contador + 1);
  };

  return (
    <div className="container">

      
      <h1 className='titulo'>Contador de Cliks</h1>
      {isPending ? <p className='puntaje'>Cargando...</p> : <StatusMessage status={status} />}
      
      <div className='infoJuego'>
        
        <div className='texto'>
          <div className='tiempo'>
            {<p className='puntaje'>Tiempo Restante: {timeLeft}</p>}  
          </div>

          <p className='puntaje'>Puntaje Actual: {contador}</p>

          <p className='puntaje'>Puntaje Máximo: {puntajeMax}</p>
      
        </div>

        <div className='botones'>

          {status === 'start' ? (
            <button onClick={startGame}  className="startButton">
              Iniciar Juego
            </button>
          ) : (
            status === 'Final' && (
            <button onClick={startGame} className="startButton">
             Reiniciar Juego
            </button>
            ) 
          )}
          <button onClick={handleClick} disabled={status !== 'Comienza'} className="clickButton">
            Click Aquí
          </button>
        </div>
    
    </div>
  </div>


  );
};


export default CounterGame;
