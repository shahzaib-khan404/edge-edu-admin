interface Props { icon?: React.ReactNode; title: string; description?: string; action?: React.ReactNode; }

export default function EmptyState({ icon, title, description, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {icon && <div className="text-4xl mb-3 text-gray-300">{icon}</div>}
      <p className="text-sm font-semibold text-gray-500">{title}</p>
      {description && <p className="text-xs text-gray-400 mt-1 max-w-xs">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
