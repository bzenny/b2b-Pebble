import React, { useState, useMemo } from 'react';
import type { VendorCompareData, Criterion, Vendor } from '../../types';
import { Icon } from '../common/Icon';

export const VendorCompare: React.FC = () => {
    const [data, setData] = useState<VendorCompareData>({
        criteria: [
            { id: '1', name: 'Price', weight: 40 },
            { id: '2', name: 'Features', weight: 30 },
            { id: '3', name: 'Support', weight: 20 },
            { id: '4', name: 'Integration', weight: 10 },
        ],
        vendors: [
            { id: 'v1', name: 'Vendor A', scores: { '1': 8, '2': 9, '3': 7, '4': 6 } },
            { id: 'v2', name: 'Vendor B', scores: { '1': 9, '2': 7, '3': 8, '4': 8 } },
        ]
    });

    const totalWeight = useMemo(() => data.criteria.reduce((sum, c) => sum + c.weight, 0), [data.criteria]);

    const handleCritChange = <K extends keyof Criterion,>(id: string, key: K, value: Criterion[K]) => {
        const updated = data.criteria.map(c => c.id === id ? { ...c, [key]: value } : c);
        setData(prev => ({ ...prev, criteria: updated }));
    };

    const addCriterion = () => {
        const newCrit: Criterion = { id: Date.now().toString(), name: '', weight: 0 };
        setData(prev => ({ ...prev, criteria: [...prev.criteria, newCrit] }));
    };

    const removeCriterion = (id: string) => {
        setData(prev => ({ ...prev, criteria: prev.criteria.filter(c => c.id !== id) }));
    };

    const handleVendorNameChange = (id: string, name: string) => {
        const updated = data.vendors.map(v => v.id === id ? { ...v, name } : v);
        setData(prev => ({ ...prev, vendors: updated }));
    };

    const addVendor = () => {
        const newVendor: Vendor = { id: Date.now().toString(), name: `Vendor ${data.vendors.length + 1}`, scores: {} };
        setData(prev => ({ ...prev, vendors: [...prev.vendors, newVendor] }));
    };

    const removeVendor = (id: string) => {
        setData(prev => ({ ...prev, vendors: prev.vendors.filter(v => v.id !== id) }));
    };

    const handleScoreChange = (vendorId: string, critId: string, score: number) => {
        const updated = data.vendors.map(v => {
            if (v.id === vendorId) {
                return { ...v, scores: { ...v.scores, [critId]: score } };
            }
            return v;
        });
        setData(prev => ({ ...prev, vendors: updated }));
    };

    const vendorTotals = useMemo(() => {
        return data.vendors.map(vendor => {
            const totalScore = data.criteria.reduce((acc, crit) => {
                const score = vendor.scores[crit.id] || 0;
                const weight = crit.weight / 100;
                return acc + score * weight;
            }, 0);
            return { vendorId: vendor.id, totalScore: parseFloat(totalScore.toFixed(2)) };
        });
    }, [data.criteria, data.vendors]);

    const winnerId = useMemo(() => {
        if (vendorTotals.length === 0) return null;
        return vendorTotals.reduce((winner, current) => current.totalScore > winner.totalScore ? current : winner).vendorId;
    }, [vendorTotals]);
    
    return (
        <div className="flex flex-col gap-6 h-full">
            <div className="glass-card p-6 flex flex-col md:flex-row gap-4 justify-between items-start">
                <div>
                    <h3 className="text-xl font-bold gradient-text">Criteria & Weights</h3>
                    <p className="text-sm opacity-70">Define what matters and how much. Weights must sum to 100%.</p>
                </div>
                <div className="glass-card p-3 w-full md:w-auto text-center">
                    <p className="text-sm">Total Weight</p>
                    <p className={`text-2xl font-bold ${totalWeight === 100 ? 'text-green-400' : 'text-amber-400'}`}>{totalWeight}%</p>
                </div>
            </div>
            <div className="glass-card p-6">
                 {data.criteria.map(crit => (
                    <div key={crit.id} className="grid grid-cols-[1fr,120px,auto] gap-2 items-center mb-2">
                        <input type="text" value={crit.name} onChange={e => handleCritChange(crit.id, 'name', e.target.value)} placeholder="Criterion Name" className="input-glass p-2 rounded-lg w-full" />
                        <input type="number" value={crit.weight} onChange={e => handleCritChange(crit.id, 'weight', parseInt(e.target.value) || 0)} placeholder="Weight %" className="input-glass p-2 rounded-lg w-full text-right" />
                        <button onClick={() => removeCriterion(crit.id)} className="text-red-400 hover:text-red-300 p-1"><Icon icon="trash" className="h-4 w-4" /></button>
                    </div>
                ))}
                <button onClick={addCriterion} className="glass-btn p-2 rounded-lg text-sm mt-2 flex items-center gap-2">
                    <Icon icon="plus" className="h-4 w-4"/> Add Criterion
                </button>
            </div>

            <div className="flex-1 glass-card p-6 overflow-x-auto">
                <table className="w-full min-w-[600px] text-left">
                    <thead>
                        <tr className="border-b border-white/20">
                            <th className="p-2 w-1/4">Criteria</th>
                            {data.vendors.map(vendor => (
                                <th key={vendor.id} className="p-2 text-center">
                                    <input type="text" value={vendor.name} onChange={e => handleVendorNameChange(vendor.id, e.target.value)} className="input-glass p-1 rounded-md w-full text-center font-bold"/>
                                </th>
                            ))}
                            <th className="w-12"><button onClick={addVendor} className="glass-btn p-2 rounded-lg text-sm w-full"><Icon icon="plus" className="h-4 w-4 mx-auto"/></button></th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.criteria.map(crit => (
                            <tr key={crit.id} className="border-b border-white/10">
                                <td className="p-2 font-semibold">{crit.name} <span className="text-xs opacity-60">({crit.weight}%)</span></td>
                                {data.vendors.map(vendor => (
                                    <td key={vendor.id} className="p-1">
                                        <input 
                                            type="number" 
                                            value={vendor.scores[crit.id] || ''} 
                                            onChange={e => handleScoreChange(vendor.id, crit.id, parseInt(e.target.value) || 0)} 
                                            placeholder="Score 1-10" 
                                            className="input-glass p-2 rounded-lg w-full text-center"
                                            max="10"
                                            min="0"
                                        />
                                    </td>
                                ))}
                                <td></td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr className="border-t-2 border-white/30">
                            <td className="p-2 font-bold gradient-text text-lg">Weighted Score</td>
                            {vendorTotals.map(vTotal => (
                                <td key={vTotal.vendorId} className={`p-2 text-center text-lg font-bold ${vTotal.vendorId === winnerId ? 'text-green-400' : ''}`}>
                                    {vTotal.totalScore}
                                </td>
                            ))}
                            <td></td>
                        </tr>
                        <tr >
                            <td></td>
                            {data.vendors.map(vendor => (
                                <td key={vendor.id} className="p-1 pt-2 text-center">
                                    <button onClick={() => removeVendor(vendor.id)} className="text-red-400 hover:text-red-300 text-xs inline-flex items-center gap-1"><Icon icon="trash" className="h-3 w-3" /> Remove</button>
                                </td>
                            ))}
                            <td></td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
};