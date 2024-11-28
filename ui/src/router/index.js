import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from '../components/dashboard/Dashboard.vue'; 
import AuthPage from '../components/auth/AuthPage.vue'; 
import QRCodePage from '../components/auth/QRCodePage.vue'; 
import TwoFactorPage from '../components/auth/TwoFactorAuth.vue'; 

const routes = [
  {
    path: '/',
    redirect: '/auth',
  },
  {
    path: '/auth',
    name: 'Auth',
    component: AuthPage,
  },
  {
    path: '/qr-code',
    name: 'QRCode',
    component: QRCodePage, 
  },
  {
    path: '/2fa',
    name: 'TwoFactor',
    component: TwoFactorPage, 
  },
  {
    path: '/home',
    name: 'Home',
    component: Dashboard,
    meta: { requiresAuth: true }, 
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Function to validate JWT
const validateToken = async (token) => {
  try {
    const response = await fetch('http://localhost:8081/api/2fa/tokens/validate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });
    return response.ok; // Returns true if the response status is 200-299
  } catch (error) {
    console.error('Token validation failed:', error);
    return false;
  }
};

// Function to refresh JWT
const refreshAccessToken = async (refreshToken) => {
  try {
    const response = await fetch('http://localhost:8081/api/2fa/tokens/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });
    
    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('token', data.accessToken); // Store the new access token
      return true;
    }
    return false;
  } catch (error) {
    console.error('Failed to refresh token:', error);
    return false;
  }
};

router.beforeEach(async (to, from, next) => {
  const token = localStorage.getItem('token');
  const refreshToken = localStorage.getItem('refreshToken'); // Assuming you store the refresh token

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!token) {
      next('/auth'); // No token, redirect to auth
    } else {
      const isValid = await validateToken(token);
      if (!isValid) {
        if (refreshToken) {
          const isRefreshed = await refreshAccessToken(refreshToken);
          if (isRefreshed) {
            next(); // Token refreshed, proceed to the route
          } else {
            next('/auth'); // Refresh failed, redirect to auth
          }
        } else {
          next('/auth'); // No refresh token available, redirect to auth
        }
      } else {
        next(); // Token is valid, proceed to the route
      }
    }
  } else {
    next(); // Proceed if no authentication required
  }
});

export default router;
