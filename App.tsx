
import React, { useState, useEffect } from 'react';
import { UserRole, ChurchReport, User, ChurchSettings } from './types';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import ReportForm from './components/ReportForm';
import ReportsList from './components/ReportsList';
import { dbService } from './services/dbService';
import UsersManager from './components/UsersManager';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [reports, setReports] = useState<ChurchReport[]>([]);
  const [activeView, setActiveView] = useState('dashboard');
  const [editingReport, setEditingReport] = useState<ChurchReport | null>(null);
  const [loading, setLoading] = useState(false);

  const [settings, setSettings] = useState<ChurchSettings>({
    churchName: 'JEOVÁ JIRÉ',
    monthlyGoal: 0
  });

  const [loginRole, setLoginRole] = useState<UserRole | null>(null);
  const [loginName, setLoginName] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    const initDb = async () => {
      try {
        setLoading(true);
        const [loadedReports, loadedSettings] = await Promise.all([
          dbService.getReports(),
          dbService.getSettings()
        ]);
        setReports(loadedReports);
        setSettings(loadedSettings);
      } catch (error) {
        console.error('Error initializing data:', error);
      } finally {
        setLoading(false);
      }
    };
    initDb();
  }, []);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (!loginName.trim()) {
      setLoginError('INFORME SEU NOME');
      return;
    }

    try {
      setLoading(true);
      const { authService } = await import('./services/authService');
      const user = await authService.login(loginName, loginRole!, loginPassword);
      setUser(user);
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      setLoginError(error.message || 'ACESSO NEGADO: SENHA INCORRETA');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setLoginRole(null);
    setLoginName('');
    setLoginPassword('');
    setActiveView('dashboard');
  };

  const handleAddOrEditReport = async (formData: Omit<ChurchReport, 'id' | 'total' | 'timestamp' | 'offerings'>) => {
    try {
      setLoading(true);
      const totalOfferings = (formData.offeringsPix || 0) + (formData.offeringsCash || 0);
      const calculatedTotal = (formData.tithes || 0) + totalOfferings;

      const reportToSave: ChurchReport = editingReport
        ? { ...formData, offerings: totalOfferings, id: editingReport.id, total: calculatedTotal, timestamp: editingReport.timestamp }
        : { ...formData, offerings: totalOfferings, id: Date.now().toString(), total: calculatedTotal, timestamp: Date.now() };

      await dbService.saveReport(reportToSave);
      const updatedReports = await dbService.getReports();
      setReports(updatedReports);
      setEditingReport(null);
      setLoading(false);
      setActiveView('reports-list');
    } catch (error: any) {
      console.error('Error saving report:', error);
      alert('Erro ao salvar relatório: ' + (error.message || 'Erro desconhecido'));
      setLoading(false);
    }
  };

  const handleDeleteReport = async (id: string) => {
    if (user?.role !== UserRole.PASTOR) {
      alert('⚠️ APENAS O PASTOR PODE EXCLUIR ATAS DO SISTEMA');
      return;
    }

    if (confirm('⚠️ EXCLUIR DEFINITIVAMENTE DO BANCO DE DADOS?')) {
      try {
        setLoading(true);
        await dbService.deleteReport(id);
        const updatedReports = await dbService.getReports();
        setReports(updatedReports);
        setLoading(false);
      } catch (error: any) {
        console.error('Error deleting report:', error);
        alert('Erro ao excluir relatório: ' + (error.message || 'Erro desconhecido'));
        setLoading(false);
      }
    }
  };

  const startEdit = (report: ChurchReport) => {
    const isOwner = report.deaconName === user?.name;
    const isPastor = user?.role === UserRole.PASTOR;

    if (!isPastor && !isOwner) {
      alert('⚠️ VOCÊ SÓ PODE EDITAR SUAS PRÓPRIAS ATAS');
      return;
    }

    setEditingReport(report);
    setActiveView('report-form');
  };

  const openSettings = async () => {
    if (user?.role !== UserRole.PASTOR) return;
    const action = confirm("Deseja baixar um BACKUP dos dados atuais?");
    if (action) {
      dbService.exportAllData();
      return;
    }

    const name = prompt("NOVO NOME DA IGREJA:", settings.churchName);
    const goal = prompt("NOVA META MENSAL:", settings.monthlyGoal.toString());
    if (name !== null && goal !== null) {
      const newSettings = {
        churchName: name.toUpperCase(),
        monthlyGoal: parseFloat(goal) || 0
      };
      setSettings(newSettings);
      await dbService.saveSettings(newSettings);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full">
          <div className="text-center mb-12">
            <div className="inline-flex bg-indigo-600 text-white w-16 h-16 rounded-3xl shadow-2xl mb-6 items-center justify-center">
              <i className="fas fa-church text-2xl"></i>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tighter mb-2 italic px-4">MINISTÉRIO APOSTÓLICO E PROFÉTICO <span className="text-indigo-500">JEOVÁ JIRÉ</span></h1>
            <p className="text-slate-500 font-black uppercase text-[9px] tracking-[0.5em]">Backend Integration Ready</p>
          </div>

          {!loginRole ? (
            <div className="bg-slate-900/50 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
              <h2 className="text-slate-400 font-black text-center mb-10 uppercase text-[10px] tracking-widest">Acesso ao Sistema</h2>
              <div className="space-y-4">
                <button onClick={() => setLoginRole(UserRole.PASTOR)} className="w-full flex items-center gap-4 p-5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 transition-all text-left">
                  <i className="fas fa-user-tie text-xl text-white/50"></i>
                  <div>
                    <p className="font-black text-white text-sm">GABINETE PASTORAL</p>
                    <p className="text-white/40 text-[9px] font-black uppercase tracking-widest">SENHA PESSOAL</p>
                  </div>
                </button>
                <button onClick={() => setLoginRole(UserRole.DEACON)} className="w-full flex items-center gap-4 p-5 rounded-2xl bg-slate-800 hover:bg-slate-700 transition-all text-left border border-white/5">
                  <i className="fas fa-clipboard-list text-xl text-white/30"></i>
                  <div>
                    <p className="font-black text-white text-sm">TESOURARIA / DIÁCONO</p>
                    <p className="text-white/20 text-[9px] font-black uppercase tracking-widest">SENHA PESSOAL</p>
                  </div>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900/80 backdrop-blur-2xl p-10 rounded-[3rem] shadow-2xl border-2 border-indigo-500/20">
              <button onClick={() => setLoginRole(null)} className="text-slate-500 hover:text-white mb-8 font-black flex items-center gap-2 uppercase text-[9px] tracking-widest">
                <i className="fas fa-arrow-left"></i> Voltar
              </button>
              <form onSubmit={handleLoginSubmit} className="space-y-6">
                <input
                  type="text"
                  placeholder="SEU NOME"
                  value={loginName}
                  onChange={(e) => setLoginName(e.target.value.toUpperCase())}
                  className="w-full px-6 py-4 rounded-xl border-2 border-slate-700 bg-slate-800 text-white font-black outline-none focus:border-indigo-500"
                  autoFocus
                />
                <input
                  type="password"
                  placeholder="SENHA"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full px-6 py-4 rounded-xl border-2 border-slate-700 bg-slate-800 text-yellow-400 font-black text-center text-2xl tracking-widest outline-none"
                />
                {loginError && <p className="text-red-500 text-[10px] font-black text-center uppercase">{loginError}</p>}
                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-5 rounded-xl transition-all uppercase tracking-widest text-xs">Entrar</button>
              </form>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <Layout
      user={user}
      onLogout={handleLogout}
      onNavigate={(v) => { if (v === 'settings') { openSettings(); } else { setActiveView(v); setEditingReport(null); } }}
      activeView={activeView}
    >
      {loading && (
        <div className="fixed inset-0 bg-slate-950/50 z-[100] flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white p-12 rounded-[2rem] shadow-2xl text-center">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <p className="font-black text-slate-900 uppercase text-[10px] tracking-widest">Conectando ao Banco...</p>
          </div>
        </div>
      )}


      {activeView === 'dashboard' && <Dashboard reports={reports} userRole={user.role} settings={settings} />}
      {activeView === 'report-form' && <ReportForm onSubmit={handleAddOrEditReport} currentUser={user} editingReport={editingReport} onCancel={() => setActiveView('reports-list')} />}
      {activeView === 'reports-list' && <ReportsList reports={reports} onDelete={handleDeleteReport} onEdit={startEdit} userRole={user.role} currentUserName={user.name} />}
      {activeView === 'users-manager' && <UsersManager onBack={() => setActiveView('dashboard')} currentUser={user} />}
    </Layout>
  );
};

export default App;
