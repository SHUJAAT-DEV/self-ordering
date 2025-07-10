import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import type { MenuItem } from "@/types";

interface MenuItemProps {
  item: MenuItem;
  onAdd: (item: MenuItem) => void;
  disabled?: boolean;
}

export function MenuItem({ item, onAdd, disabled }: MenuItemProps) {
  return (
    <Card className="hover:shadow-sm transition-shadow">
      <CardContent className="p-3">
        <div className="flex gap-3 items-start">
          {/* Menu Item Image */}
          {item.image && (
            <div className="flex-shrink-0">
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                onError={(e) => {
                  // Hide image if it fails to load
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 truncate">{item.name}</h3>
            {item.description && (
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.description}</p>
            )}
            <p className="text-primary font-semibold mt-2">${item.price}</p>
          </div>
          
          {/* Add Button */}
          <div className="flex-shrink-0">
            <Button
              size="sm"
              onClick={() => onAdd(item)}
              disabled={disabled || !item.available}
              className="touch-target"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
