
import React, { useState } from 'react';
import { ChurchReport, UserRole, ServiceType, TitheEntry } from '../types';

const SHAKE_ANIMATION = `
  @keyframes shake {
    0%, 100% { transform: rotate(0deg); }
    25% { transform: rotate(-10deg); }
    75% { transform: rotate(10deg); }
  }
  .group-hover\/del:shake-animation {
    animation: shake 0.2s ease-in-out infinite;
  }
`;

interface ReportsListProps {
  reports: ChurchReport[];
  onDelete: (id: string) => void;
  onEdit: (report: ChurchReport) => void;
  userRole: UserRole;
  currentUserName: string;
}

const ReportsList: React.FC<ReportsListProps> = ({ reports, onDelete, onEdit, userRole, currentUserName }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<ServiceType | 'TODOS'>('TODOS');
  const [expandedReportId, setExpandedReportId] = useState<string | null>(null);

  const filteredReports = reports.filter(r => {
    const matchesSearch = r.deaconName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.titheEntries?.some(te => te.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = typeFilter === 'TODOS' || r.serviceType === typeFilter;
    return matchesSearch && matchesType;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handlePrint = () => {
    window.print();
  };

  const getBadgeColor = (type: ServiceType) => {
    switch (type) {
      case 'DOMINGO': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'SANTA_CEIA': return 'bg-red-100 text-red-700 border-red-200';
      case 'QUARTA_FEIRA': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'ESPECIAL': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedReportId(expandedReportId === id ? null : id);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <style>{SHAKE_ANIMATION}</style>
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 print:hidden">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Histórico de Atas</h2>
          <p className="text-slate-500 font-black text-[10px] tracking-[0.4em] uppercase mt-2">Registros de Caixa e Presença</p>
        </div>

        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[150px]">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Tipo de Culto</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="w-full px-5 py-3.5 bg-white border-2 border-slate-900 rounded-2xl font-black text-black outline-none focus:ring-4 focus:ring-indigo-100 transition-all"
            >
              <option value="TODOS">TODOS</option>
              <option value="DOMINGO">DOMINGO</option>
              <option value="QUARTA_FEIRA">QUARTA-FEIRA</option>
              <option value="SANTA_CEIA">SANTA CEIA</option>
              <option value="ESPECIAL">ESPECIAL</option>
            </select>
          </div>
          <div className="flex-1 min-w-[250px] relative">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Buscar no Banco (Dizimista/Ata)</label>
            <i className="fas fa-search absolute left-5 top-[58px] text-slate-400"></i>
            <input
              type="text"
              placeholder="NOME OU PALAVRA..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-5 py-3.5 bg-white border-2 border-slate-900 rounded-2xl font-black text-black outline-none focus:ring-4 focus:ring-indigo-100 transition-all placeholder:text-slate-300"
            />
          </div>
          <button
            onClick={handlePrint}
            className="bg-slate-900 text-white p-4 rounded-2xl hover:bg-black transition-all shadow-xl active:scale-95 h-[54px] w-[54px] flex items-center justify-center"
          >
            <i className="fas fa-print"></i>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] shadow-2xl border-2 border-slate-900 overflow-hidden print:border-none print:shadow-none">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-900 text-white">
              <tr>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest min-w-[180px]">Informações</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest min-w-[150px]">Relator</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-center min-w-[150px]">Dados</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-right min-w-[200px]">Financeiro</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-center print:hidden sticky right-0 bg-slate-900 border-l border-slate-800 shadow-[-10px_0_15px_-3px_rgba(0,0,0,0.1)] z-10 w-[180px]">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-slate-100">
              {filteredReports.map((report) => (
                <React.Fragment key={report.id}>
                  <tr className={`hover:bg-indigo-50/30 transition-all cursor-pointer ${expandedReportId === report.id ? 'bg-indigo-50/50' : ''}`} onClick={() => toggleExpand(report.id)}>
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-4">
                        <div className="text-center bg-slate-900 text-white p-3 rounded-2xl min-w-[70px]">
                          <p className="text-[9px] font-black opacity-50 uppercase leading-none mb-1">Dia</p>
                          <p className="text-xl font-black">
                            {new Date(report.date).toLocaleDateString('pt-BR', { day: '2-digit' })}
                          </p>
                        </div>
                        <div>
                          <div className="font-black text-slate-900 text-lg uppercase leading-tight">
                            {new Date(report.date).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })}
                          </div>
                          <span className={`inline-block px-3 py-1 rounded-full text-[9px] font-black border-2 mt-1 ${getBadgeColor(report.serviceType)}`}>
                            {report.serviceType.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-100 text-indigo-700 rounded-xl flex items-center justify-center font-black">
                          {report.deaconName.charAt(0)}
                        </div>
                        <span className="font-black text-slate-900 uppercase text-xs tracking-tight">{report.deaconName}</span>
                      </div>
                    </td>
                    <td className="px-10 py-8 text-center">
                      <div className="inline-flex gap-6">
                        <div className="text-center">
                          <p className="text-[9px] font-black text-slate-400 uppercase">Membros</p>
                          <p className="text-md font-black text-slate-900">{report.attendance}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-[9px] font-black text-slate-400 uppercase">Visitas</p>
                          <p className="text-md font-black text-orange-600">{report.visitors}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8 text-right">
                      <div className="font-black text-emerald-700 text-2xl tracking-tighter">
                        {report.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </div>
                      <div className="text-[9px] font-black text-slate-400 mt-1 uppercase">
                        Diz: {report.tithes.toFixed(2)} | Ofer: {report.offerings.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-10 py-8 text-center print:hidden sticky right-0 bg-white/95 backdrop-blur-md border-l border-slate-100 shadow-[-10px_0_15px_-3px_rgba(0,0,0,0.05)] z-10 group-hover:bg-indigo-50/95 transition-all" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-center items-center gap-3">
                        <button
                          onClick={() => toggleExpand(report.id)}
                          className={`w-11 h-11 rounded-2xl transition-all shadow-md active:scale-90 flex items-center justify-center ${expandedReportId === report.id ? 'bg-indigo-600 text-white scale-110 shadow-indigo-200' : 'bg-white border-2 border-slate-200 text-slate-400 hover:border-indigo-400 hover:text-indigo-600'}`}
                          title="Ver Detalhes"
                        >
                          <i className={`fas ${expandedReportId === report.id ? 'fa-chevron-up' : 'fa-list-ul'}`}></i>
                        </button>
                        {(userRole === UserRole.PASTOR || report.deaconName === currentUserName) && (
                          <button
                            onClick={() => onEdit(report)}
                            className="w-11 h-11 bg-white border-2 border-slate-900 rounded-2xl text-slate-900 hover:bg-black hover:text-white transition-all shadow-md active:scale-90 flex items-center justify-center group/edit"
                            title="Editar Ata"
                          >
                            <i className="fas fa-edit group-hover/edit:rotate-12 transition-transform"></i>
                          </button>
                        )}
                        {userRole === UserRole.PASTOR && (
                          <button
                            onClick={() => onDelete(report.id)}
                            className="w-11 h-11 bg-white border-2 border-red-600 rounded-2xl text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-md active:scale-90 flex items-center justify-center group/del"
                            title="Excluir Ata"
                          >
                            <i className="fas fa-trash-alt group-hover/del:shake-animation transition-transform"></i>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>

                  {/* Expanded Detail View */}
                  {expandedReportId === report.id && (
                    <tr className="bg-slate-50 animate-in slide-in-from-top-4 duration-300">
                      <td colSpan={5} className="px-10 py-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                          <div className="space-y-6">
                            <h5 className="font-black text-slate-400 text-[10px] uppercase tracking-widest border-b pb-2">Rol de Dizimistas</h5>
                            <div className="grid gap-3">
                              {report.titheEntries?.length > 0 ? report.titheEntries.map(entry => (
                                <div key={entry.id} className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                                  <div className="flex items-center gap-4">
                                    <span className={`px-2 py-0.5 rounded text-[8px] font-black ${entry.method === 'PIX' ? 'bg-cyan-100 text-cyan-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                      {entry.method}
                                    </span>
                                    <span className="font-black text-slate-800 text-xs uppercase">{entry.name}</span>
                                  </div>
                                  <span className="font-black text-indigo-600 text-xs">
                                    {entry.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                  </span>
                                </div>
                              )) : <p className="text-slate-400 text-xs font-bold italic">Nenhum dízimo registrado.</p>}
                            </div>
                          </div>

                          <div className="space-y-6">
                            <h5 className="font-black text-slate-400 text-[10px] uppercase tracking-widest border-b pb-2">Detalhes da Oferta e Ata</h5>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center">
                                <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Espécie</p>
                                <p className="font-black text-emerald-600">{(report.offeringsCash || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                              </div>
                              <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center">
                                <p className="text-[9px] font-black text-slate-400 uppercase mb-1">PIX</p>
                                <p className="font-black text-cyan-600">{(report.offeringsPix || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                              </div>
                            </div>
                            <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm text-sm text-slate-700 leading-relaxed font-medium">
                              {report.notes || 'Nenhuma observação registrada nesta ata.'}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="bg-slate-100 p-4 rounded-2xl border border-slate-200 text-center">
                                <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Total Ofertas</p>
                                <p className="font-black text-emerald-700">{(report.offerings || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                              </div>
                              <div className="bg-slate-100 p-4 rounded-2xl border border-slate-200 text-center">
                                <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Total Dízimos</p>
                                <p className="font-black text-indigo-700">{report.tithes.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
              {filteredReports.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-10 py-40 text-center">
                    <div className="flex flex-col items-center gap-6 opacity-20">
                      <i className="fas fa-database text-8xl"></i>
                      <p className="font-black text-2xl uppercase tracking-[0.2em]">Banco de dados vazio</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="hidden print:block text-center text-[10px] font-black text-slate-400 uppercase mt-10">
        Extrato oficial gerado pelo Eclésia DB em {new Date().toLocaleString('pt-BR')}
      </p>
    </div>
  );
};

export default ReportsList;
