import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const settingEmail = (e: any) => {
    setEmail(e.target.value);
  };

  const settingPassword = (e: any) => {
    setPassword(e.target.value);
  };

  const inicioDeSesion = () => {
    if (email === '123' && password === '123') {
      localStorage.setItem('authToken', 'JKw12WEdas321a1');
      navigate('/home');
    } else {
      localStorage.removeItem('authToken');
    }
  };
  return (
    <div className=" bg-yellow-900 justify-center items-center m-20  rounded-lg">
      <div className="flex justify-center items-center text-white py-24 px-4 text-6xl">
        Bienvenido de vuelta
      </div>
      <div className="flex justify-center items-center pb-3 p-2 text-3xl rounded-lg">
        <input
          type="text"
          placeholder="Email"
          onChange={(e) => settingEmail(e)}
        ></input>
      </div>
      <div className="flex justify-center items-center py-5 p-2 text-3xl rounded-lg">
        <input
          type="password"
          placeholder="Contraseña"
          onChange={(e) => settingPassword(e)}
        ></input>
      </div>
      <div className="flex justify-center items-center py-4">
        <button
          className=' bg-orange-200 hover:bg-orange-600 text-black font-bold py-2 px-4 border border-blue-700 rounded"'
          onClick={() => inicioDeSesion()}
        >
          Entrar como usuario
        </button>
      </div>
    </div>
  );
};
