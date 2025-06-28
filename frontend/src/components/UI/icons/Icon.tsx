import { Billing, Table, Dashboard } from '../../../assets/icons';

const iconObject = {
  table: <Table />,
  dashboard: <Dashboard />,
  billing: <Billing />
}

type IconProperties = {
  type: 'table' | 'dashboard' | 'billing',
  color?: string
}
export const Icon = ({ type, color }: IconProperties) => iconObject[type];



