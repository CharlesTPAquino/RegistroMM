import {
  ClipboardDocumentListIcon,
  ChartBarIcon,
  CalendarIcon,
  UserGroupIcon,
  DocumentTextIcon,
  ClockIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  DocumentDuplicateIcon
} from '@heroicons/react/24/outline';

export const navigation = [
  { name: 'TIMESHEET', icon: ClipboardDocumentListIcon, current: true },
  { name: 'TIME TRACKER', icon: ClockIcon, current: false },
  { name: 'CALENDAR', icon: CalendarIcon, current: false },
  { name: 'KIOSK', icon: BuildingOfficeIcon, current: false },
  { name: 'REPORTS', icon: ChartBarIcon, current: false },
  { name: 'PROJECTS', icon: DocumentTextIcon, current: false },
  { name: 'EXPENSES', icon: CurrencyDollarIcon, current: false },
  { name: 'INVOICES', icon: DocumentDuplicateIcon, current: false },
  { name: 'TEAM', icon: UserGroupIcon, current: false }
];
