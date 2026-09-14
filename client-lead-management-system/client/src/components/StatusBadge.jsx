const STATUS_CLASS = {
  New: 'badge badge-new',
  Contacted: 'badge badge-contacted',
  Converted: 'badge badge-converted',
  Lost: 'badge badge-lost',
};

export default function StatusBadge({ status }) {
  return <span className={STATUS_CLASS[status] || 'badge'}>{status}</span>;
}
