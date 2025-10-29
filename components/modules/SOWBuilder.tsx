import React, { useState } from 'react';
import type { SOWData, SOWDeliverable, SOWMilestone } from '../../types';
import { polishTextWithGemini } from '../../services/geminiService';
import { Icon } from '../common/Icon';

export const SOWBuilder: React.FC = () => {
    const today = new Date();
    const futureDate = (days: number) => {
        const future = new Date();
        future.setDate(today.getDate() + days);
        return future.toISOString().split('T')[0];
    }
    
    const [data, setData] = useState<SOWData>({
        projectTitle: 'New Website Development',
        clientName: 'Client Corporation',
        companyName: 'Pebble Services',
        goals: 'To design and develop a modern, responsive marketing website that drives user engagement and lead generation.',
        deliverables: [
            { id: 'd1', description: 'Complete UI/UX design mockups and prototypes.' },
            { id: 'd2', description: 'Development of up to 10 static pages.' },
            { id: 'd3', description: 'Integration with a headless CMS for content management.' },
        ],
        milestones: [
            { id: 'm1', description: 'Project Kick-off & Discovery', dueDate: futureDate(7) },
            { id: 'm2', description: 'Design Approval', dueDate: futureDate(14) },
            { id: 'm3', description: 'Development Complete & Staging Review', dueDate: futureDate(30) },
        ],
        acceptanceCriteria: 'The project will be considered complete when all deliverables are provided, meet the specifications outlined, and are approved by the client.',
        terms: 'Any changes to the scope of work must be submitted through a formal Change Order request, which may affect project timeline and cost. Payment is due within 15 days of invoice receipt.'
    });
    const [isPolishing, setIsPolishing] = useState<keyof SOWData | null>(null);

    const handleDataChange = <K extends keyof SOWData>(key: K, value: SOWData[K]) => {
        setData(prev => ({ ...prev, [key]: value }));
    };

    const handleDeliverableChange = (id: string, value: string) => {
        const updated = data.deliverables.map(d => d.id === id ? { ...d, description: value } : d);
        handleDataChange('deliverables', updated);
    };

    const addDeliverable = () => {
        const newItem: SOWDeliverable = { id: Date.now().toString(), description: '' };
        handleDataChange('deliverables', [...data.deliverables, newItem]);
    };

    const removeDeliverable = (id: string) => {
        handleDataChange('deliverables', data.deliverables.filter(d => d.id !== id));
    };
    
    const handleMilestoneChange = <K extends keyof SOWMilestone>(id: string, key: K, value: SOWMilestone[K]) => {
        const updated = data.milestones.map(m => m.id === id ? { ...m, [key]: value } : m);
        handleDataChange('milestones', updated);
    };

    const addMilestone = () => {
        const newItem: SOWMilestone = { id: Date.now().toString(), description: '', dueDate: new Date().toISOString().split('T')[0] };
        handleDataChange('milestones', [...data.milestones, newItem]);
    };
    
    const removeMilestone = (id: string) => {
        handleDataChange('milestones', data.milestones.filter(m => m.id !== id));
    };

    const handleAIPolish = async (field: 'goals' | 'acceptanceCriteria' | 'terms') => {
        if (!data[field]) return;
        setIsPolishing(field);
        try {
            const polishedText = await polishTextWithGemini(data[field]);
            handleDataChange(field, polishedText);
        } catch (error) {
            alert((error as Error).message);
        } finally {
            setIsPolishing(null);
        }
    };
    
    const AIPolishButton: React.FC<{field: 'goals' | 'acceptanceCriteria' | 'terms'}> = ({field}) => (
        <button onClick={() => handleAIPolish(field)} disabled={isPolishing === field} className="glass-btn p-2 rounded-lg text-xs self-start flex items-center gap-1.5 disabled:opacity-50">
            <Icon icon="sparkles" className="h-4 w-4" /> {isPolishing === field ? 'Polishing...' : 'AI Polish'}
        </button>
    );

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
            {/* Input Panel */}
            <div className="glass-card p-6 flex flex-col gap-4 overflow-y-auto">
                <h3 className="text-xl font-bold gradient-text">Statement of Work Details</h3>
                <div className="grid grid-cols-2 gap-4">
                    <input type="text" value={data.projectTitle} onChange={e => handleDataChange('projectTitle', e.target.value)} placeholder="Project Title" className="input-glass p-2 rounded-lg w-full" />
                    <input type="text" value={data.clientName} onChange={e => handleDataChange('clientName', e.target.value)} placeholder="Client Name" className="input-glass p-2 rounded-lg w-full" />
                </div>
                 <input type="text" value={data.companyName} onChange={e => handleDataChange('companyName', e.target.value)} placeholder="Your Company Name" className="input-glass p-2 rounded-lg w-full" />
                
                <div className="flex justify-between items-center"><h4 className="font-semibold">Project Goals</h4><AIPolishButton field="goals"/></div>
                <textarea value={data.goals} onChange={e => handleDataChange('goals', e.target.value)} placeholder="Describe the high-level objectives..." className="input-glass p-2 rounded-lg w-full h-24" />

                <h4 className="font-semibold">Deliverables</h4>
                {data.deliverables.map(d => (
                    <div key={d.id} className="flex gap-2 items-center">
                        <input type="text" value={d.description} onChange={e => handleDeliverableChange(d.id, e.target.value)} placeholder="Deliverable description" className="input-glass p-2 rounded-lg w-full" />
                        <button onClick={() => removeDeliverable(d.id)} className="text-red-400 hover:text-red-300 p-1"><Icon icon="trash" className="h-4 w-4" /></button>
                    </div>
                ))}
                <button onClick={addDeliverable} className="glass-btn p-2 rounded-lg text-sm self-start flex items-center gap-2">
                    <Icon icon="plus" className="h-4 w-4"/> Add Deliverable
                </button>

                <h4 className="font-semibold">Milestones</h4>
                 {data.milestones.map(m => (
                    <div key={m.id} className="grid grid-cols-[1fr,150px,auto] gap-2 items-center">
                        <input type="text" value={m.description} onChange={e => handleMilestoneChange(m.id, 'description', e.target.value)} placeholder="Milestone description" className="input-glass p-2 rounded-lg w-full" />
                        <input type="date" value={m.dueDate} onChange={e => handleMilestoneChange(m.id, 'dueDate', e.target.value)} className="input-glass p-2 rounded-lg w-full" />
                        <button onClick={() => removeMilestone(m.id)} className="text-red-400 hover:text-red-300 p-1"><Icon icon="trash" className="h-4 w-4" /></button>
                    </div>
                ))}
                <button onClick={addMilestone} className="glass-btn p-2 rounded-lg text-sm self-start flex items-center gap-2">
                    <Icon icon="plus" className="h-4 w-4"/> Add Milestone
                </button>

                <div className="flex justify-between items-center"><h4 className="font-semibold">Acceptance Criteria</h4><AIPolishButton field="acceptanceCriteria"/></div>
                <textarea value={data.acceptanceCriteria} onChange={e => handleDataChange('acceptanceCriteria', e.target.value)} placeholder="How the project will be approved..." className="input-glass p-2 rounded-lg w-full h-24" />

                <div className="flex justify-between items-center"><h4 className="font-semibold">Terms & Conditions</h4><AIPolishButton field="terms"/></div>
                <textarea value={data.terms} onChange={e => handleDataChange('terms', e.target.value)} placeholder="Payment terms, change orders..." className="input-glass p-2 rounded-lg w-full h-24" />
            </div>

            {/* Preview Panel */}
            <div className="glass-card p-8 bg-white/5 flex flex-col overflow-y-auto">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold gradient-text">Statement of Work</h2>
                    <p className="text-xl">{data.projectTitle}</p>
                </div>
                <div className="flex justify-between mb-6 text-sm">
                    <p><strong>For:</strong> {data.clientName}</p>
                    <p><strong>From:</strong> {data.companyName}</p>
                    <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
                </div>
                
                <div className="prose prose-invert max-w-none prose-headings:font-bold prose-headings:text-white prose-p:opacity-90 prose-ul:opacity-90 prose-table:opacity-90">
                    <h3 className="gradient-text">1. Project Overview & Goals</h3>
                    <p className="whitespace-pre-wrap">{data.goals}</p>

                    <h3 className="gradient-text">2. Scope of Work & Deliverables</h3>
                    <ul>{data.deliverables.map(d => d.description && <li key={d.id}>{d.description}</li>)}</ul>
                    
                    <h3 className="gradient-text">3. Project Timeline & Milestones</h3>
                    <table className="w-full">
                        <thead className="border-b border-white/20"><tr><th className="text-left p-2">Milestone</th><th className="text-left p-2">Est. Due Date</th></tr></thead>
                        <tbody>
                            {data.milestones.map(m => m.description && (
                                <tr key={m.id} className="border-b border-white/10">
                                    <td className="p-2">{m.description}</td>
                                    <td className="p-2">{new Date(m.dueDate + 'T00:00:00').toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <h3 className="gradient-text">4. Acceptance Criteria</h3>
                    <p className="whitespace-pre-wrap">{data.acceptanceCriteria}</p>
                    
                    <h3 className="gradient-text">5. Terms & Conditions</h3>
                    <p className="whitespace-pre-wrap text-xs">{data.terms}</p>
                </div>
                
                <div className="mt-auto pt-8 flex gap-4">
                    <button className="glass-btn flex-1 py-3 rounded-lg font-bold">Share Link</button>
                    <button className="glass-btn flex-1 py-3 rounded-lg font-bold bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] text-white">Export to PDF</button>
                </div>
            </div>
        </div>
    );
};
