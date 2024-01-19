async function loginUser(username, password) {
    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
  
      const data = await response.json();

  
      if (response.ok) {
        // Successful login, store the token (e.g., in localStorage)
        localStorage.setItem('token', data.token);
        // Redirect to a secured page (e.g., using window.location.href)
        window.location.href = '/index';
      } else {
        // Handle login failure (e.g., display an error message)
        console.error(data.error);
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  
    document.getElementById('loginForm').addEventListener('submit', async function (event) {
      event.preventDefault();
      await loginUser();
    });
    }