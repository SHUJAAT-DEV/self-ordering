import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Play, CheckCircle } from "lucide-react";
import type { OrderWithItems } from "@/types";

interface OrderCardProps {
  order: OrderWithItems;
  onStatusChange?: (orderId: number, status: string) => void;
  status: "pending" | "cooking" | "ready";
}

export function OrderCard({ order, onStatusChange, status }: OrderCardProps) {
  const formatTime = (date: Date | string | null) => {
    if (!date) return "--:--";
    const d = new Date(date);
    return d.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getStatusConfig = () => {
    switch (status) {
      case "pending":
        return {
          borderColor: "border-l-warning",
          icon: <Clock className="text-gray-400 mr-2 w-4 h-4" />,
          time: formatTime(order.createdAt),
          buttonText: "Start Cooking",
          buttonIcon: <Play className="mr-2 w-4 h-4" />,
          buttonAction: () => onStatusChange?.(order.id, "cooking"),
        };
      case "cooking":
        return {
          borderColor: "border-l-primary",
          icon: <Clock className="text-gray-400 mr-2 w-4 h-4" />,
          time: formatTime(order.startedAt),
          buttonText: "Mark Ready",
          buttonIcon: <CheckCircle className="mr-2 w-4 h-4" />,
          buttonAction: () => onStatusChange?.(order.id, "ready"),
          buttonClass: "bg-secondary hover:bg-secondary/90",
        };
      case "ready":
        return {
          borderColor: "border-l-secondary",
          icon: <Clock className="text-secondary mr-2 w-4 h-4" />,
          time: formatTime(order.readyAt),
          buttonText: null,
          buttonIcon: null,
          buttonAction: null,
        };
    }
  };

  const config = getStatusConfig();

  return (
    <Card className={`border-l-4 ${config.borderColor}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            {config.icon}
            <span className="text-sm text-gray-600">{config.time}</span>
          </div>
          <div className="flex items-center">
            <span className="font-medium">{order.table.name}</span>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between items-center">
              <span className="text-gray-900">{item.menuItem.name}</span>
              <Badge variant="secondary">×{item.quantity}</Badge>
            </div>
          ))}
        </div>

        {config.buttonText && (
          <Button
            onClick={config.buttonAction || undefined}
            className={`w-full ${config.buttonClass || ""}`}
          >
            {config.buttonIcon}
            {config.buttonText}
          </Button>
        )}

        {status === "ready" && (
          <div className="bg-green-50 rounded-lg p-3">
            <div className="flex items-center">
              <CheckCircle className="text-secondary mr-2 w-5 h-5" />
              <span className="text-secondary font-medium">Order Ready!</span>
            </div>
            <div className="text-sm text-gray-600 mt-1">Waiting for pickup...</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
