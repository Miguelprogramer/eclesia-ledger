
import React, { useState, useEffect, useMemo } from 'react';
import { ChurchReport, User, ServiceType, TitheEntry, PaymentMethod } from '../types';

interface ReportFormProps {
  onSubmit: (report: Omit<ChurchReport, 'id' | 'total' | 'timestamp' | 'offerings'>) => void;
  currentUser: User;
  editingReport?: ChurchReport | null;
  onCancel?: () => void;
}

const ReportForm: React.FC<ReportFormProps> = ({ onSubmit, currentUser, editingReport, onCancel }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    serviceType: 'DOMINGO' as ServiceType,
    deaconName: currentUser.name,
    attendance: 0,
    visitors: 0,
    offeringsPix: 0,
    offeringsCash: 0,
    notes: ''
  });

  const [titheEntries, setTitheEntries] = useState<TitheEntry[]>([]);
  const [newTithe, setNewTithe] = useState({ name: '', amount: 0, method: 'ESPECIE' as PaymentMethod });

  useEffect(() => {
    if (editingReport) {
      setFormData({
        date: editingReport.date,
        serviceType: editingReport.serviceType,
        deaconName: editingReport.deaconName,
        attendance: editingReport.attendance,
        visitors: editingReport.visitors,
        offeringsPix: editingReport.offeringsPix || 0,
        offeringsCash: editingReport.offeringsCash || 0,
        notes: editingReport.notes || ''
      });
      setTitheEntries(editingReport.titheEntries || []);
    }
  }, [editingReport]);

  const totalTithes = useMemo(() => titheEntries.reduce((acc, curr) => acc + curr.amount, 0), [titheEntries]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['notes', 'date', 'deaconName', 'serviceType'].includes(name) ? value : Math.max(0, Number(value))
    }));
  };

  const addTitheEntry = () => {
    if (!newTithe.name || newTithe.amount <= 0) return;
    setTitheEntries(prev => [...prev, { ...newTithe, id: Date.now().toString() }]);
    setNewTithe({ name: '', amount: 0, method: 'ESPECIE' });
  };

  const removeTitheEntry = (id: string) => {
    setTitheEntries(prev => prev.filter(e => e.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      titheEntries,
      tithes: totalTithes
    });
  };

  const inputBase = "w-full px-5 py-4 rounded-2xl border-2 border-slate-700 bg-slate-800 text-white font-bold focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/10 transition-all outline-none placeholder:text-slate-500 shadow-inner";
  const labelClasses = "text-xs font-black text-slate-300 block mb-2 uppercase tracking-[0.2em]";

  return (
    <div className="bg-slate-900 rounded-[3rem] shadow-2xl border-2 border-slate-800 overflow-hidden max-w-4xl mx-auto animate-in fade-in zoom-in-95 duration-300 mb-20">
      <div className={`p-10 text-white flex justify-between items-center ${editingReport ? 'bg-orange-600' : 'bg-indigo-700'}`}>
        <div>
          <h2 className="text-3xl font-black tracking-tighter">{editingReport ? 'EDITAR ATA' : 'NOVO RELATÓRIO'}</h2>
          <p className="text-white/70 font-bold text-[10px] uppercase tracking-[0.3em] mt-1">Escrituração Eclesiástica Oficial</p>
        </div>
        <div className="w-16 h-16 bg-black/20 rounded-3xl flex items-center justify-center border border-white/10">
          <i className={`fas ${editingReport ? 'fa-pen-to-square' : 'fa-feather-pointed'} text-3xl`}></i>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-10 space-y-10">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <label className={labelClasses}>Data do Culto</label>
            <input type="date" name="date" value={formData.date} onChange={handleChange} className={inputBase} required />
          </div>
          <div>
            <label className={labelClasses}>Categoria de Evento</label>
            <select name="serviceType" value={formData.serviceType} onChange={handleChange} className={`${inputBase} appearance-none`}>
              <option value="DOMINGO">DOMINGO</option>
              <option value="QUARTA_FEIRA">QUARTA-FEIRA</option>
              <option value="SANTA_CEIA">SANTA CEIA</option>
              <option value="ESPECIAL">EVENTO ESPECIAL</option>
            </select>
          </div>
        </div>

        {/* Attendance */}
        <div className="grid grid-cols-2 gap-10">
          <div>
            <label className={labelClasses}>Membros Presentes</label>
            <input type="number" name="attendance" value={formData.attendance || ''} onChange={handleChange} placeholder="0" className={`${inputBase} text-blue-400`} required />
          </div>
          <div>
            <label className={labelClasses}>Novos Visitantes</label>
            <input type="number" name="visitors" value={formData.visitors || ''} onChange={handleChange} placeholder="0" className={`${inputBase} text-orange-400`} required />
          </div>
        </div>

        {/* Tithes Section */}
        <div className="bg-black/30 p-8 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-yellow-500 font-black text-[10px] uppercase tracking-[0.4em]">Rol de Dizimistas</h3>
            <span className="bg-yellow-500/10 text-yellow-500 px-4 py-1 rounded-full text-[10px] font-black border border-yellow-500/20">
              SOMA: {totalTithes.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end bg-slate-800/50 p-6 rounded-3xl border border-white/5">
            <div className="md:col-span-5">
              <label className={labelClasses}>Nome do Dizimista</label>
              <input
                type="text"
                value={newTithe.name}
                onChange={e => setNewTithe({ ...newTithe, name: e.target.value.toUpperCase() })}
                placeholder="NOME COMPLETO"
                className={`${inputBase} py-3 text-sm`}
              />
            </div>
            <div className="md:col-span-3">
              <label className={labelClasses}>Valor (R$)</label>
              <input
                type="number"
                value={newTithe.amount || ''}
                onChange={e => setNewTithe({ ...newTithe, amount: Number(e.target.value) })}
                placeholder="0,00"
                className={`${inputBase} py-3 text-sm text-yellow-400`}
              />
            </div>
            <div className="md:col-span-3">
              <label className={labelClasses}>Meio</label>
              <select
                value={newTithe.method}
                onChange={e => setNewTithe({ ...newTithe, method: e.target.value as PaymentMethod })}
                className={`${inputBase} py-3 text-sm appearance-none`}
              >
                <option value="ESPECIE">ESPÉCIE</option>
                <option value="PIX">PIX</option>
              </select>
            </div>
            <div className="md:col-span-1">
              <button
                type="button"
                onClick={addTitheEntry}
                className="w-full h-[52px] bg-yellow-500 hover:bg-yellow-400 text-black rounded-xl transition-all flex items-center justify-center shadow-lg"
              >
                <i className="fas fa-plus"></i>
              </button>
            </div>
          </div>

          <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
            {titheEntries.map(entry => (
              <div key={entry.id} className="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/5 group hover:bg-white/10 transition-all">
                <div className="flex gap-4 items-center">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-[10px] font-black ${entry.method === 'PIX' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                    {entry.method === 'PIX' ? 'PIX' : 'ESP'}
                  </div>
                  <div>
                    <p className="text-white font-black text-xs uppercase tracking-tight">{entry.name}</p>
                    <p className="text-yellow-500 font-bold text-[10px]">{entry.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeTitheEntry(entry.id)}
                  className="text-slate-500 hover:text-red-500 transition-colors p-2"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Offerings Section Breakdown */}
        <div className="bg-emerald-900/10 p-8 rounded-[2.5rem] border border-emerald-500/20 space-y-6">
          <h3 className="text-emerald-500 font-black text-[10px] uppercase tracking-[0.4em]">Ofertas Gerais</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className={labelClasses}>Ofertas em Espécie (Dinheiro)</label>
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-500/50 font-black">R$</span>
                <input
                  type="number"
                  step="0.01"
                  name="offeringsCash"
                  value={formData.offeringsCash || ''}
                  onChange={handleChange}
                  placeholder="0,00"
                  className={`${inputBase} pl-14 text-emerald-400 text-2xl tracking-tighter focus:border-emerald-500`}
                  required
                />
              </div>
            </div>
            <div>
              <label className={labelClasses}>Ofertas em PIX</label>
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-cyan-500/50 font-black">R$</span>
                <input
                  type="number"
                  step="0.01"
                  name="offeringsPix"
                  value={formData.offeringsPix || ''}
                  onChange={handleChange}
                  placeholder="0,00"
                  className={`${inputBase} pl-14 text-cyan-400 text-2xl tracking-tighter focus:border-cyan-500`}
                  required
                />
              </div>
            </div>
          </div>
          <div className="pt-4 text-right">
            <span className="text-slate-500 font-black text-[10px] uppercase tracking-widest mr-4">Subtotal Ofertas:</span>
            <span className="text-emerald-500 font-black text-xl">
              {(formData.offeringsCash + formData.offeringsPix).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
          </div>
        </div>

        <div>
          <label className={labelClasses}>Observações e Ocorrências (Ata)</label>
          <textarea name="notes" value={formData.notes} onChange={handleChange} className={`${inputBase} min-h-[120px] resize-none text-sm leading-relaxed text-slate-100 font-medium`} placeholder="Resumo da pregação, avisos ou intercorrências..."></textarea>
        </div>

        <div className="flex gap-6 pt-6">
          {onCancel && (
            <button type="button" onClick={onCancel} className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-black py-5 rounded-2xl transition-all uppercase tracking-widest text-[10px]">
              CANCELAR
            </button>
          )}
          <button type="submit" className={`flex-[2] text-white font-black py-5 rounded-2xl shadow-2xl transition-all flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-xs ${editingReport ? 'bg-orange-600 hover:bg-orange-500' : 'bg-indigo-600 hover:bg-indigo-500'}`}>
            <i className="fas fa-save text-lg"></i>
            {editingReport ? 'SALVAR ALTERAÇÕES' : 'FINALIZAR ATA'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReportForm;
