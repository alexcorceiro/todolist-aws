import React, { useState } from 'react';
import { Auth } from 'aws-amplify';
import { Link, useNavigate } from 'react-router-dom';
import './css/login.css'

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate()

  const handleSignIn = async () => {
    try {
      await Auth.signIn(username, password);
      navigate('/home')
      setErrorMessage('');
    } catch (error) {
      console.error('Erreur lors de la connexion :', error);
      setErrorMessage(error.message || 'Une erreur est survenue lors de la connexion');
    }
  };

  return (
    <div className='login'>
      <div className='login-container'>
      <h2 className='login-title'>Connexion a la todolist app</h2>

      <input className='login-input'
        type="text"
        placeholder="Nom d'utilisateur"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input className='login-input'
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

      <button type='submit' className='login-btn' onClick={handleSignIn}>Se connecter</button>
      <p>vous n'avez pas de compte <Link to="/inscription">click ici</Link></p>
      </div>  
    </div>
  );
};

export default Login;
