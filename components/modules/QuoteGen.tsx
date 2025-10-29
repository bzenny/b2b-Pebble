import React, { useState, useMemo } from 'react';
import type { QuoteData, LineItem } from '../../types';
import { polishTextWithGemini } from '../../services/geminiService';
import { Icon } from '../common/Icon';

export const QuoteGen: React.FC = () => {
    const [data, setData] = useState<QuoteData>({
        quoteTitle: 'Project Proposal',
        companyName: 'Your Company',
        clientName: 'Client Inc.',
        lineItems: [
            { id: '1', description: 'Website Design', quantity: 1, price: 2500 },
            { id: '2', description: 'Backend Development (20 hrs)', quantity: 20, price: 100 },
        ],
        terms: 'Payment due within 30 days. 50% upfront deposit required.'
    });
    const [isPolishing, setIsPolishing] = useState(false);

    const handleDataChange = <K extends keyof QuoteData,>(key: K, value: QuoteData[K]) => {
        setData(prev => ({ ...prev, [key]: value }));
    };

    const handleItemChange = <K extends keyof LineItem,>(id: string, key: K, value: LineItem[K]) => {
        const updatedItems = data.lineItems.map(item =>
            item.id === id ? { ...item, [key]: value } : item
        );
        handleDataChange('lineItems', updatedItems);
    };

    const addItem = () => {
        const newItem: LineItem = { id: Date.now().toString(), description: '', quantity: 1, price: 0 };
        handleDataChange('lineItems', [...data.lineItems, newItem]);
    };

    const removeItem = (id: string) => {
        handleDataChange('lineItems', data.lineItems.filter(item => item.id !== id));
    };

    const handleAIPolish = async () => {
        setIsPolishing(true);
        try {
            const polishedTerms = await polishTextWithGemini(data.terms);
            handleDataChange('terms', polishedTerms);
        } catch (error) {
            alert((error as Error).message);
        } finally {
            setIsPolishing(false);
        }
    };

    const subtotal = useMemo(() => data.lineItems.reduce((acc, item) => acc + (item.quantity * item.price), 0), [data.lineItems]);
    const tax = subtotal * 0.08; // Example 8% tax
    const total = subtotal + tax;
    
    const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
            {/* Input Panel */}
            <div className="glass-card p-6 flex flex-col gap-4 overflow-y-auto">
                <h3 className="text-xl font-bold gradient-text">Quote Details</h3>
                <div className="grid grid-cols-2 gap-4">
                    <input type="text" value={data.quoteTitle} onChange={e => handleDataChange('quoteTitle', e.target.value)} placeholder="Quote Title" className="input-glass p-2 rounded-lg w-full" />
                    <input type="text" value={data.companyName} onChange={e => handleDataChange('companyName', e.target.value)} placeholder="Your Company" className="input-glass p-2 rounded-lg w-full" />
                </div>
                <input type="text" value={data.clientName} onChange={e => handleDataChange('clientName', e.target.value)} placeholder="Client Name" className="input-glass p-2 rounded-lg w-full" />
                
                <h4 className="font-semibold mt-2">Line Items</h4>
                <div className="flex flex-col gap-2">
                    {data.lineItems.map(item => (
                        <div key={item.id} className="grid grid-cols-[1fr,80px,100px,auto] gap-2 items-center">
                            <input type="text" value={item.description} onChange={e => handleItemChange(item.id, 'description', e.target.value)} placeholder="Description" className="input-glass p-2 rounded-lg w-full" />
                            <input type="number" value={item.quantity} onChange={e => handleItemChange(item.id, 'quantity', parseFloat(e.target.value))} placeholder="Qty" className="input-glass p-2 rounded-lg w-full text-center" />
                            <input type="number" value={item.price} onChange={e => handleItemChange(item.id, 'price', parseFloat(e.target.value))} placeholder="Price" className="input-glass p-2 rounded-lg w-full text-right" />
                            <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-300 p-1"><Icon icon="trash" className="h-4 w-4" /></button>
                        </div>
                    ))}
                </div>
                <button onClick={addItem} className="glass-btn p-2 rounded-lg text-sm self-start flex items-center gap-2">
                    <Icon icon="plus" className="h-4 w-4"/> Add Item
                </button>

                <h4 className="font-semibold mt-2">Terms & Conditions</h4>
                <textarea value={data.terms} onChange={e => handleDataChange('terms', e.target.value)} placeholder="Payment terms..." className="input-glass p-2 rounded-lg w-full h-24" />
                <button onClick={handleAIPolish} disabled={isPolishing} className="glass-btn p-2 rounded-lg text-sm self-start flex items-center gap-2 disabled:opacity-50">
                    <Icon icon="sparkles" className="h-4 w-4" /> {isPolishing ? 'Polishing...' : 'AI Polish Terms'}
                </button>
            </div>

            {/* Preview Panel */}
            <div className="glass-card p-8 bg-white/5 flex flex-col">
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h2 className="text-3xl font-bold gradient-text">{data.quoteTitle}</h2>
                        <p>For: {data.clientName}</p>
                    </div>
                    <div className="text-right">
                        <h3 className="text-xl font-bold">{data.companyName}</h3>
                        <p className="text-sm opacity-70">Quote #{new Date().getFullYear()}-001</p>
                    </div>
                </div>

                <div className="flex-1">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/20">
                                <th className="p-2">Description</th>
                                <th className="p-2 text-center">Qty</th>
                                <th className="p-2 text-right">Unit Price</th>
                                <th className="p-2 text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.lineItems.map(item => (
                                <tr key={item.id} className="border-b border-white/10">
                                    <td className="p-2">{item.description}</td>
                                    <td className="p-2 text-center">{item.quantity}</td>
                                    <td className="p-2 text-right">{formatCurrency(item.price)}</td>
                                    <td className="p-2 text-right font-semibold">{formatCurrency(item.quantity * item.price)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-8 text-right">
                    <div className="inline-block text-left">
                        <p className="flex justify-between gap-8"><span>Subtotal:</span> <span>{formatCurrency(subtotal)}</span></p>
                        <p className="flex justify-between gap-8"><span>Tax (8%):</span> <span>{formatCurrency(tax)}</span></p>
                        <p className="flex justify-between gap-8 text-xl font-bold mt-2 border-t border-white/20 pt-2"><span className="gradient-text">Total:</span> <span>{formatCurrency(total)}</span></p>
                    </div>
                </div>
                
                <div className="mt-8">
                    <h4 className="font-semibold mb-2">Terms:</h4>
                    <p className="text-xs opacity-80 whitespace-pre-wrap">{data.terms}</p>
                </div>
                
                <div className="mt-auto pt-8 flex gap-4">
                    <button className="glass-btn flex-1 py-3 rounded-lg font-bold">Share Link</button>
                    <button className="glass-btn flex-1 py-3 rounded-lg font-bold bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] text-white">Export to PDF</button>
                </div>
            </div>
        </div>
    );
};
