import React, { useEffect, useState } from 'react';
import { User, UserRole } from '../types';
import { userService } from '../services/userService';
import UserForm from './UserForm';

interface UsersManagerProps {
    onBack: () => void;
    currentUser: User;
}

const UsersManager: React.FC<UsersManagerProps> = ({ onBack, currentUser }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);

    const loadUsers = async () => {
        setLoading(true);
        const data = await userService.getUsers();
        setUsers(data);
        setLoading(false);
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handleAddUser = async (name: string, role: UserRole, password: string) => {
        await userService.registerUser(name, role, password);
        await loadUsers();
        setShowAddForm(false);
    };

    const handleDeleteUser = async (id: number, userName: string) => {
        if (confirm(`Tem certeza que deseja remover o usuário ${userName}?`)) {
            setLoading(true);
            try {
                await userService.deleteUser(id);
                await loadUsers();
            } catch (error) {
                alert('Erro ao excluir usuário');
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 p-6 font-sans">
            <div className="max-w-5xl mx-auto space-y-6">

                {/* Header */}
                <header className="flex items-center justify-between bg-slate-900/50 backdrop-blur-xl p-6 rounded-[2rem] border border-white/5 shadow-2xl">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onBack}
                            className="w-12 h-12 rounded-2xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-all border border-white/5"
                        >
                            <i className="fas fa-arrow-left"></i>
                        </button>
                        <div>
                            <h1 className="text-2xl font-black text-white italic tracking-tighter">
                                GESTÃO DE <span className="text-indigo-500">EQUIPE</span>
                            </h1>
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">
                                Gerencie os membros com acesso ao sistema
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => setShowAddForm(true)}
                        className="px-6 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-xl uppercase tracking-widest text-xs transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-3"
                    >
                        <i className="fas fa-user-plus"></i>
                        <span>Adicionar Membro</span>
                    </button>
                </header>

                {/* Users List */}
                <div className="grid gap-4">
                    {loading && users.length === 0 ? (
                        <div className="text-center py-20">
                            <i className="fas fa-spinner fa-spin text-4xl text-indigo-500 mb-4"></i>
                            <p className="text-slate-500 font-bold">Carregando equipe...</p>
                        </div>
                    ) : (
                        users.map((user) => (
                            <div
                                key={user.id}
                                className="bg-slate-900 p-6 rounded-3xl border border-white/5 flex items-center justify-between group hover:border-indigo-500/30 transition-all"
                            >
                                <div className="flex items-center gap-6">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-lg ${user.role === UserRole.PASTOR
                                            ? 'bg-indigo-600/20 text-indigo-400'
                                            : 'bg-emerald-600/20 text-emerald-400'
                                        }`}>
                                        <i className={`fas ${user.role === UserRole.PASTOR ? 'fa-user-tie' : 'fa-clipboard-list'}`}></i>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-white uppercase tracking-tight">{user.name}</h3>
                                        <span className={`inline-block px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${user.role === UserRole.PASTOR
                                                ? 'bg-indigo-500/10 text-indigo-400'
                                                : 'bg-emerald-500/10 text-emerald-400'
                                            }`}>
                                            {user.role}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {/* Prevent deleting yourself or important users logic if needed, but for now simple delete */}
                                    {/* Maybe hide delete for current user? */}
                                    {user.name !== currentUser.name && (
                                        <button
                                            onClick={() => handleDeleteUser(user.id!, user.name)}
                                            className="w-12 h-12 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white flex items-center justify-center transition-colors"
                                            title="Remover Usuário"
                                        >
                                            <i className="fas fa-trash-alt"></i>
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}

                    {!loading && users.length === 0 && (
                        <div className="p-10 text-center bg-slate-900/50 rounded-[2rem] border border-dashed border-slate-800">
                            <i className="fas fa-users-slash text-4xl text-slate-700 mb-4"></i>
                            <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">Nenhum membro encontrado</p>
                        </div>
                    )}
                </div>

                {/* Add User Modal */}
                {showAddForm && (
                    <UserForm
                        onSubmit={handleAddUser}
                        onCancel={() => setShowAddForm(false)}
                    />
                )}

            </div>
        </div>
    );
};

export default UsersManager;
