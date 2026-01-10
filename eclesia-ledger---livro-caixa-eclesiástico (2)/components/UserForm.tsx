import React, { useState } from 'react';
import { UserRole } from '../types';

interface UserFormProps {
    onSubmit: (name: string, role: UserRole, password: string) => Promise<void>;
    onCancel: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ onSubmit, onCancel }) => {
    const [name, setName] = useState('');
    const [role, setRole] = useState<UserRole>(UserRole.DEACON);
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!name.trim()) {
            setError('O NOME É OBRIGATÓRIO');
            return;
        }
        if (!password.trim()) {
            setError('A SENHA É OBRIGATÓRIA');
            return;
        }

        try {
            setLoading(true);
            await onSubmit(name, role, password);
            // Form resets or closes via parent
        } catch (err: any) {
            setError(err.message || 'ERRO AO SALVAR USUÁRIO');
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-white/10 rounded-[2rem] p-8 w-full max-w-md shadow-2xl">
                <h2 className="text-xl font-black text-white mb-6 flex items-center gap-3 uppercase tracking-widest">
                    <i className="fas fa-user-plus text-indigo-500"></i>
                    Novo Usuário
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-2">Nome Completo</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value.toUpperCase())}
                            className="w-full bg-slate-800 border-2 border-slate-700 rounded-xl px-4 py-3 text-white font-bold outline-none focus:border-indigo-500 transition-colors uppercase"
                            placeholder="EX: JOÃO SILVA"
                            autoFocus
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-2">Cargo</label>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => setRole(UserRole.PASTOR)}
                                className={`p-4 rounded-xl border-2 font-black text-xs uppercase tracking-widest transition-all flex flex-col items-center gap-2 ${role === UserRole.PASTOR
                                        ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                                    }`}
                            >
                                <i className="fas fa-user-tie text-lg"></i>
                                Pastor
                            </button>
                            <button
                                type="button"
                                onClick={() => setRole(UserRole.DEACON)}
                                className={`p-4 rounded-xl border-2 font-black text-xs uppercase tracking-widest transition-all flex flex-col items-center gap-2 ${role === UserRole.DEACON
                                        ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                                    }`}
                            >
                                <i className="fas fa-clipboard-list text-lg"></i>
                                Diácono
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-2">Senha de Acesso</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-slate-800 border-2 border-slate-700 rounded-xl px-4 py-3 text-white font-bold outline-none focus:border-indigo-500 transition-colors"
                            placeholder="Digite a senha..."
                        />
                    </div>

                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs font-black text-center uppercase tracking-wide">
                            {error}
                        </div>
                    )}

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={loading}
                            className="flex-1 py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-black rounded-xl uppercase tracking-widest text-xs transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-[2] py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-xl uppercase tracking-widest text-xs transition-colors shadow-lg shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <i className="fas fa-spinner fa-spin"></i> Salvando...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-save"></i> Salvar Usuário
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserForm;
