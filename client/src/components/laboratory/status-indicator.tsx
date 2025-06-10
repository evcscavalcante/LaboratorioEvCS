import { Clock, Check, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatusIndicatorProps {
  status: "AGUARDANDO" | "APROVADO" | "REPROVADO";
  description?: string;
}

export default function StatusIndicator({ status, description }: StatusIndicatorProps) {
  const getStatusConfig = () => {
    switch (status) {
      case "APROVADO":
        return {
          icon: Check,
          bgColor: "bg-green-600",
          textColor: "text-white",
          label: "APROVADO"
        };
      case "REPROVADO":
        return {
          icon: X,
          bgColor: "bg-red-600",
          textColor: "text-white",
          label: "REPROVADO"
        };
      default:
        return {
          icon: Clock,
          bgColor: "bg-orange-500",
          textColor: "text-white",
          label: "AGUARDANDO"
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-gray-900">Status do Ensaio</CardTitle>
            {description && (
              <p className="text-sm text-gray-500 mt-1">{description}</p>
            )}
          </div>
          <div className="text-right">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.bgColor} ${config.textColor}`}>
              <Icon className="mr-2" size={16} />
              {config.label}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
