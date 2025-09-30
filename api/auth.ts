import { User } from '../types';

// In a real app, this would be an API call. We are simulating it with localStorage.
// This file mimics the behavior of API endpoints like `/api/auth/login` and `/api/auth/signup`.

const SIMULATED_DELAY = 500; // ms

// --- Mock Database ---
// A real backend would use a proper database (SQL, NoSQL, etc.)
const getUsersFromStorage = (): any[] => {
    try {
        return JSON.parse(localStorage.getItem('users') || '[]');
    } catch (e) {
        return [];
    }
};

const saveUsersToStorage = (users: any[]) => {
    localStorage.setItem('users', JSON.stringify(users));
};


// --- Simulated API Functions ---

/**
 * Simulates calling a /api/auth/signup endpoint.
 * @param name User's full name
 * @param email User's email
 * @param password User's password (in a real app, this should be hashed on the server)
 * @returns A promise that resolves if signup is successful, or rejects with an error.
 */
export const signupAPI = (name: string, email: string, password: string): Promise<User> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const users = getUsersFromStorage();
            const existingUser = users.find(u => u.email === email);

            if (existingUser) {
                reject(new Error('An account with this email already exists.'));
                return;
            }

            // Don't store plain text passwords in a real app! Hash them on the server.
            const newUser = {
                id: Date.now().toString(),
                name,
                email,
                password, 
            };
            
            users.push(newUser);
            saveUsersToStorage(users);

            // Return a user object without the password
            const { password: _, ...userToReturn } = newUser;
            resolve(userToReturn);

        }, SIMULATED_DELAY);
    });
};


/**
 * Simulates calling a /api/auth/login endpoint.
 * @param email User's email
 * @param password User's password
 * @returns A promise that resolves with the user object if successful, or rejects with an error.
 */
export const loginAPI = (email: string, password: string): Promise<User> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const users = getUsersFromStorage();
            const user = users.find(u => u.email === email);

            // In a real app, you would use bcrypt.compare() to check the hashed password
            if (user && user.password === password) {
                // Return a user object without the password
                const { password: _, ...userToReturn } = user;
                resolve(userToReturn);
            } else {
                reject(new Error('Invalid email or password.'));
            }
        }, SIMULATED_DELAY);
    });
};