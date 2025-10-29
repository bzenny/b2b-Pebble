import React from 'react';
import type { Module } from './types';

export const MODULES: Module[] = [
  { id: 'QuoteGen', title: 'QuoteGen', description: 'Paste line items → branded PDF quote.', icon: 'document' },
  { id: 'VendorCompare', title: 'Vendor Compare', description: 'Weighted matrix with tie-breaks + export.', icon: 'scale' },
  { id: 'SOWBuilder', title: 'SOW Builder', description: 'Deliverables, milestones, acceptance—linted.', icon: 'clipboard-list' },
  { id: 'RFPTriage', title: 'RFP Triage (AI)', description: 'Light AI extraction → requirements table.', icon: 'sparkles' },
  { id: 'Compliance', title: 'Compliance Checklist', description: 'Framework checklists & gap summary.', icon: 'shield-check' },
  { id: 'Dashboards', title: 'Dashboard Builder', description: 'Composable KPIs from your artifacts.', icon: 'view-grid' },
];
