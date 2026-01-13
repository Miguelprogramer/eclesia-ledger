
import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { ChurchReport, UserRole, ChurchSettings } from '../types';
import { getFinancialInsights } from '../services/geminiService';

interface DashboardProps {
  reports: ChurchReport[];
  userRole: UserRole;
  settings: ChurchSettings;
}

const Dashboard: React.FC<DashboardProps> = ({ reports, userRole, settings }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(false);

  // Consolidação de dados
  const totals = reports.reduce((acc, r) => ({
    tithes: acc.tithes + (r.tithes || 0),
    offerings: acc.offerings + (r.offerings || 0),
    pix: acc.pix + (r.offeringsPix || 0) + ((r.titheEntries || []).filter(te => te.method === 'PIX').reduce((s, e) => s + e.amount, 0)),
    cash: acc.cash + (r.offeringsCash || 0) + ((r.titheEntries || []).filter(te => te.method === 'ESPECIE').reduce((s, e) => s + e.amount, 0))
  }), { tithes: 0, offerings: 0, pix: 0, cash: 0 });

  const currentMonthTotal = reports
    .filter(r => new Date(r.date).getMonth() === new Date().getMonth())
    .reduce((acc, curr) => acc + curr.total, 0);

  const goalProgress = settings.monthlyGoal > 0 ? (currentMonthTotal / settings.monthlyGoal) * 100 : 0;

  const distributionData = [
    { name: 'PIX', value: totals.pix },
    { name: 'Espécie', value: totals.cash },
  ];

  const COLORS = ['#06b6d4', '#10b981']; // Cyan para PIX, Emerald para Dinheiro

  const chartData = [...reports]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-8)
    .map(r => ({
      name: new Date(r.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      total: r.total,
    }));

  const handleGetInsights = async () => {
    setLoadingInsight(true);
    const result = await getFinancialInsights(reports);
    setInsight(result);
    setLoadingInsight(false);
  };

  return (
    <div className="space-y-10 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">{settings.churchName}</h1>
          <p className="text-slate-500 font-bold uppercase text-xs tracking-[0.4em] mt-2">Painel Consolidado de Gestão</p>
        </div>
        {userRole === UserRole.PASTOR && (
          <div className="flex gap-4">
            <button
              onClick={() => (window as any).onNavigate('report-form')}
              className="group inline-flex items-center gap-3 bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black transition-all hover:bg-indigo-500 shadow-2xl"
            >
              <i className="fas fa-file-circle-plus"></i>
              NOVA ATA
            </button>
            <button
              onClick={handleGetInsights}
              className="group inline-flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black transition-all hover:bg-indigo-600 shadow-2xl"
            >
              <i className={`fas ${loadingInsight ? 'fa-spinner fa-spin' : 'fa-wand-magic-sparkles'}`}></i>
              GERAR RELATÓRIO IA
            </button>
          </div>
        )}
      </header>

      {/* Cards de Métricas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="bg-white p-8 rounded-[2rem] border-2 border-slate-900 shadow-lg">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Entradas em PIX</p>
          <p className="text-2xl font-black text-cyan-600">{totals.pix.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
        </div>
        <div className="bg-white p-8 rounded-[2rem] border-2 border-slate-900 shadow-lg">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Entradas em Dinheiro</p>
          <p className="text-2xl font-black text-emerald-600">{totals.cash.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
        </div>
        <div className="bg-indigo-600 p-8 rounded-[2rem] text-white shadow-lg md:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Arrecadação do Mês</p>
            <span className="text-xs font-black">{Math.round(goalProgress)}% da meta</span>
          </div>
          <p className="text-3xl font-black mb-4">{currentMonthTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
          <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-white transition-all duration-1000" style={{ width: `${Math.min(100, goalProgress)}%` }}></div>
          </div>
        </div>
      </div>

      {insight && (
        <div className="bg-slate-900 text-white p-10 rounded-[3rem] shadow-2xl border-l-8 border-indigo-500">
          <h4 className="font-black text-xl uppercase tracking-tighter mb-4 flex items-center gap-3">
            <i className="fas fa-microchip text-indigo-400"></i> Análise Gerencial
          </h4>
          <p className="text-indigo-50 font-medium leading-relaxed">{insight}</p>
        </div>
      )}

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] border-2 border-slate-100 shadow-xl">
          <h4 className="font-black text-slate-900 mb-10 flex items-center gap-3 uppercase text-[10px] tracking-widest">
            <div className="w-2 h-6 bg-indigo-600 rounded-full"></div> Fluxo de Caixa Recente
          </h4>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontWeight: 700, fontSize: 10 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontWeight: 700, fontSize: 10 }} />
                <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }} />
                <Area type="monotone" dataKey="total" stroke="#4338ca" strokeWidth={4} fill="#4338ca10" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-10 rounded-[3rem] border-2 border-slate-100 shadow-xl">
          <h4 className="font-black text-slate-900 mb-10 flex items-center gap-3 uppercase text-[10px] tracking-widest">
            <div className="w-2 h-6 bg-cyan-500 rounded-full"></div> Meios de Recebimento
          </h4>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={distributionData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={10} dataKey="value">
                  {distributionData.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
