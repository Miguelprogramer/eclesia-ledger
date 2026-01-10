import { User, UserRole } from '../types';
import { apiConfig } from './apiConfig';
import { authService } from './authService';

export const userService = {
    async getUsers(): Promise<User[]> {
        try {
            return await apiConfig.get('/users');
        } catch (error) {
            console.error('Error fetching users:', error);
            return [];
        }
    },

    async deleteUser(id: number): Promise<void> {
        try {
            await apiConfig.delete(`/users/${id}`);
        } catch (error) {
            console.error('Error deleting user:', error);
            throw error;
        }
    },

    async registerUser(name: string, role: UserRole, password: string): Promise<User> {
        // Reuse auth service logic which calls /auth/register
        return await authService.register(name, role, password);
    }
};
