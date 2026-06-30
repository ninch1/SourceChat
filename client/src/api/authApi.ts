import type { RegisterUserData, User } from '../types/auth';

const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) throw new Error('VITE_API_URL is not set');

export const registerUser = async (
  userData: RegisterUserData,
): Promise<User> => {
  //await new Promise((resolve) => setTimeout(resolve, 5000));

  let response: Response;

  try {
    response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      body: JSON.stringify(userData),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch {
    throw new Error('Something went wrong. Please try again later.');
  }

  if (!response.ok) {
    let message = 'Something went wrong. Please try again later.';

    try {
      const error = await response.json();

      if (error?.message) {
        message = error.message;
      }
    } catch {
      // Keep generic user-friendly message
    }

    throw new Error(message);
  }
  const data = await response.json();
  const user = data.data.user;
  return user;
};
