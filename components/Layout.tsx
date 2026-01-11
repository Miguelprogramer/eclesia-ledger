
import React from 'react';
import { UserRole } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  user: { name: string; role: UserRole } | null;
  onLogout: () => void;
  onNavigate: (view: string) => void;
  activeView: string;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout, onNavigate, activeView }) => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-100">
      <aside className="w-full md:w-72 bg-indigo-950 text-white flex-shrink-0 shadow-2xl z-20">
        <div className="p-8 h-full flex flex-col">
          <div className="flex items-center gap-4 mb-12">
            <div className="bg-indigo-600 p-3 rounded-2xl shadow-lg shadow-indigo-500/30">
              <i className="fas fa-cross text-2xl"></i>
            </div>
            <h1 className="font-black text-xl tracking-tighter leading-tight">MINISTÉRIO<br /><span className="text-indigo-400">JEOVÁ JIRÉ</span></h1>
          </div>

          <div className="flex-1 space-y-8">
            <div>
              <p className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4 opacity-50">Principais</p>
              <nav className="space-y-2">
                <button
                  onClick={() => onNavigate('dashboard')}
                  className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-sm transition-all ${activeView === 'dashboard' ? 'bg-indigo-700 text-white shadow-xl shadow-indigo-900/50' : 'text-indigo-200 hover:bg-indigo-900'}`}
                >
                  <i className="fas fa-gauge-high"></i> Painel Geral
                </button>
                {(user?.role === UserRole.DEACON || user?.role === UserRole.PASTOR) && (
                  <button
                    onClick={() => onNavigate('report-form')}
                    className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-sm transition-all ${activeView === 'report-form' ? 'bg-indigo-700 text-white shadow-xl shadow-indigo-900/50' : 'text-indigo-200 hover:bg-indigo-900'}`}
                  >
                    <i className="fas fa-file-circle-plus"></i> Novo Relatório
                  </button>
                )}
                <button
                  onClick={() => onNavigate('reports-list')}
                  className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-sm transition-all ${activeView === 'reports-list' ? 'bg-indigo-700 text-white shadow-xl shadow-indigo-900/50' : 'text-indigo-200 hover:bg-indigo-900'}`}
                >
                  <i className="fas fa-landmark"></i> Histórico Atas
                </button>
              </nav>
            </div>

            {user?.role === UserRole.PASTOR && (
              <div>
                <p className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4 opacity-50">Administração</p>
                <button
                  onClick={() => onNavigate('settings')}
                  className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-sm text-indigo-200 hover:bg-indigo-900 transition-all"
                >
                  <i className="fas fa-gears"></i> Config. Igreja
                </button>
                <button
                  onClick={() => onNavigate('users-manager')}
                  className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-sm transition-all mt-2 ${activeView === 'users-manager' ? 'bg-indigo-700 text-white shadow-xl shadow-indigo-900/50' : 'text-indigo-200 hover:bg-indigo-900'}`}
                >
                  <i className="fas fa-users-gear"></i> Gerenciar Equipe
                </button>
              </div>
            )}
          </div>

          <div className="mt-auto pt-8 border-t border-indigo-900">
            <div className="bg-indigo-900/50 p-5 rounded-3xl border border-indigo-800 mb-4">
              <p className="text-[10px] font-black text-indigo-400 uppercase mb-1">Logado como {user?.role}</p>
              <p className="font-black text-white truncate text-sm">{user?.name}</p>
            </div>
            {/* Fix: Use the correct prop name 'onLogout' instead of the undefined 'handleLogout' */}
            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white font-black text-sm transition-all border border-red-500/20"
            >
              <i className="fas fa-power-off"></i> ENCERRAR
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        <header className="bg-white border-b-2 border-slate-200 p-5 flex justify-between items-center md:hidden sticky top-0 z-30">
          <h1 className="font-black text-indigo-950 tracking-tighter text-xs">MINISTÉRIO JEOVÁ JIRÉ</h1>
          <button onClick={onLogout} className="text-red-600 text-xl"><i className="fas fa-power-off"></i></button>
        </header>
        <div className="p-6 md:p-12 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
