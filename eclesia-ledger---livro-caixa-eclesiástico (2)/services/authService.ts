import { User, UserRole } from '../types';
import { apiConfig } from './apiConfig';

export const authService = {
    async login(name: string, role: UserRole, password: string): Promise<User> {
        try {
            const response = await apiConfig.post('/auth/login', {
                name: name.toUpperCase(),
                role,
                password,
            });

            if (response.success && response.user) {
                return {
                    name: response.user.name,
                    role: response.user.role,
                };
            }

            throw new Error('Login failed');
        } catch (error: any) {
            throw new Error(error.message || 'ACESSO NEGADO: SENHA INCORRETA');
        }
    },

    async register(name: string, role: UserRole, password: string): Promise<User> {
        try {
            const user = await apiConfig.post('/auth/register', {
                name: name.toUpperCase(),
                role,
                password,
            });

            return {
                name: user.name,
                role: user.role,
            };
        } catch (error: any) {
            throw new Error(error.message || 'Erro ao registrar usuário');
        }
    },
};
