import { User } from '../../../types';

// This is a simple in-memory "database" for demonstration purposes.
// In a real application, you would use a proper database like PostgreSQL, MongoDB, etc.

interface UserWithPassword extends User {
    password?: string;
}

let users: UserWithPassword[] = [];

export const USERS_DB = {
    getUsers: () => users,
    addUser: (user: UserWithPassword) => {
        users.push(user);
    },
};
