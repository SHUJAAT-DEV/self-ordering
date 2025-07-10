import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Table } from "@/types";

interface TableCardProps {
  table: Table;
  isSelected?: boolean;
  onSelect: (table: Table) => void;
}

const statusConfig = {
  available: {
    color: "bg-green-50 border-green-200 hover:bg-green-100",
    badgeVariant: "default" as const,
    badgeClass: "bg-green-100 text-green-800",
    disabled: false,
  },
  occupied: {
    color: "bg-orange-50 border-orange-200 hover:bg-orange-100",
    badgeVariant: "secondary" as const,
    badgeClass: "bg-orange-100 text-orange-800",
    disabled: false,
  },
  cleaning: {
    color: "bg-red-50 border-red-200 hover:bg-red-100",
    badgeVariant: "destructive" as const,
    badgeClass: "bg-red-100 text-red-800",
    disabled: true,
  },
};

export function TableCard({ table, isSelected, onSelect }: TableCardProps) {
  const config = statusConfig[table.status as keyof typeof statusConfig] || statusConfig.available;

  return (
    <Button
      variant="outline"
      className={cn(
        "h-auto p-4 flex flex-col items-start justify-between text-left touch-target",
        config.color,
        isSelected && "ring-2 ring-primary",
        config.disabled && "opacity-60"
      )}
      onClick={() => onSelect(table)}
      disabled={config.disabled}
    >
      <div className="w-full flex items-center justify-between">
        <span className="font-medium text-gray-900">{table.name}</span>
        <Badge className={config.badgeClass}>
          {table.status.charAt(0).toUpperCase() + table.status.slice(1)}
        </Badge>
      </div>
      <div className="text-sm text-gray-600 mt-1">
        {table.seats} seats
      </div>
    </Button>
  );
}
