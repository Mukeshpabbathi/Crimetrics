// Login.jsx

import React, { useState } from 'react';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleLogin = async () => {
    if (!validateEmail(email)) {
        setEmailError('Invalid email format');
        return;
      }

    try {
        setEmailError('');
        setPasswordError('');
      const response = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Login Successful:', result);
        window.localStorage.setItem("loggedin","TRUE")
        window.location.replace('/home');
        // You can redirect to another page or update the UI as needed
      } else {
        const errorResult = await response.json();
        console.error('Login Failed:', errorResult.message);
        if (response.status === 401) {
          // Invalid password
          setPasswordError('Invalid password');
        } else {
          // Handle other error scenarios
          setPasswordError('Something went wrong');
          console.error('Login Failed:', errorResult.message);
        }
      }
    } catch (error) {
      console.error('Error during login:', error);
      // Handle other error scenarios
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Signup/Login</h2>
      <form style={styles.form}>
        <label style={styles.label}>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setEmailError(validateEmail(email) ? '' : 'Invalid email format')}
            style={styles.input}
          />
          {emailError && <span style={{ color: 'red' }}>{emailError}</span>}
        </label>
        <br />
        <label style={styles.label}>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />
          {passwordError && <span style={{ color: 'red' }}>{passwordError}</span>}
        </label>
        <br />
        <button type="button" onClick={handleLogin} style={styles.button}>
          Login
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    width: '300px',
    margin: 'auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  },
  heading: {
    textAlign: 'center',
    color: '#333',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    margin: '10px 0',
    fontSize: '16px',
  },
  input: {
    width: '100%',
    padding: '8px',
    fontSize: '14px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  button: {
    backgroundColor: '#007BFF',
    color: 'white',
    padding: '10px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
  },
};

export default Login;
