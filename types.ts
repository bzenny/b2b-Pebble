import type { IconName } from './components/common/Icon';

export type ModuleType = 'QuoteGen' | 'VendorCompare' | 'SOWBuilder' | 'RFPTriage' | 'SLAComposer' | 'POInvoice' | 'Minutes' | 'Compliance' | 'Dashboards';

export interface Module {
  id: ModuleType;
  title: string;
  description: string;
  icon: IconName;
}

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
}

export interface QuoteData {
  lineItems: LineItem[];
  terms: string;
  companyName: string;
  clientName: string;
  quoteTitle: string;
}

export interface Criterion {
  id: string;
  name: string;
  weight: number;
}

export interface Vendor {
  id: string;
  name: string;
  scores: Record<string, number>; // { [criterionId]: score }
}

export interface VendorCompareData {
  criteria: Criterion[];
  vendors: Vendor[];
}

export interface SOWDeliverable {
  id: string;
  description: string;
}

export interface SOWMilestone {
  id: string;
  description: string;
  dueDate: string;
}

export interface SOWData {
  projectTitle: string;
  clientName: string;
  companyName: string;
  goals: string;
  deliverables: SOWDeliverable[];
  milestones: SOWMilestone[];
  acceptanceCriteria: string;
  terms: string;
}
