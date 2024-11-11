import React, { useState } from 'react';
import { Auth } from 'aws-amplify';
import { Link, useNavigate } from 'react-router-dom';
import "./css/register.css"
function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordComfirm, setPasswordComfirm] = useState('')
  const [email, setEmail] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async () => {
    if(password !== passwordComfirm){
        return alert('les mot de passe ne sont pas identique')
    }
    try {
      await Auth.signUp({
        username: email,
        password,
        attributes: {
          email,
        },
      });
      setUsername(email); 
      setIsCodeSent(true);
      alert('Code de confirmation envoyé à votre email.');
    } catch (err) {
      console.error('Erreur lors de l’inscription :', err);
      alert(err.message);
    }
  };

  const handleConfirmSignUp = async () => {
    try {
      await Auth.confirmSignUp({username: email, confirmationCode});
      alert('Inscription confirmée !');
      navigate('/'); 
    } catch (error) {
      console.error('Erreur lors de la confirmation de l’inscription :', error);
      alert(error.message);
    }
  };

  return (
    <div className='register'>
      <div className='register-container'>
        <h2 className='register-title'>Inscription</h2>
        {!isCodeSent ? (
          <>
            <input className='register-input' 
              type="email"
              placeholder="Entrez votre email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input className='register-input'
              type="password"
              placeholder="Entrez votre mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input  className='register-input'
            type="password"
            placeholder="Confirmez votre mot de passe"
            value={passwordComfirm}
            onChange={(e) => setPasswordComfirm(e.target.value)}
            />
            <button className='register-btn' onClick={handleSignUp}>S'inscrire</button>
            <span>vous avez un compte<Link to='/'>click ici</Link></span>
          </>
        ) : (
          <>
            <input className='register-input'
              type="text"
              placeholder="Code de confirmation"
              value={confirmationCode}
              onChange={(e) => setConfirmationCode(e.target.value)}
            />
            <button className='register-btn' onClick={handleConfirmSignUp}>Confirmer</button>
          </>
        )}
      </div>
    </div>
  );
}

export default Register;
