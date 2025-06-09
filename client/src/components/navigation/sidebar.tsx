import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { 
  BarChart3, 
  FlaskRound, 
  ChevronDown, 
  ChevronRight,
  Home,
  Settings,
  Mountain,
  Car,
  Building2,
  Target,
  Layers,
  Scale,
  LucideIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

interface MenuChild {
  label: string;
  icon: LucideIcon;
  href: string;
  active?: boolean;
  disabled?: boolean;
}

interface MenuItem {
  label: string;
  icon: LucideIcon;
  href?: string;
  active?: boolean;
  expandable?: boolean;
  expanded?: boolean;
  onToggle?: () => void;
  children?: MenuChild[];
}

export default function Sidebar({ isOpen }: SidebarProps) {
  const [location] = useLocation();
  const [solosOpen, setSolosOpen] = useState(true);
  const [asfaltoOpen, setAsfaltoOpen] = useState(false);
  const [concretoOpen, setConcretoOpen] = useState(false);

  const menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: Home,
      href: '/',
      active: location === '/'
    },
    {
      label: 'Analytics',
      icon: BarChart3,
      href: '/analytics',
      active: location === '/analytics'
    },
    {
      label: 'Solos',
      icon: Mountain,
      expandable: true,
      expanded: solosOpen,
      onToggle: () => setSolosOpen(!solosOpen),
      children: [
        {
          label: 'Densidade In Situ',
          icon: Target,
          href: '/solos/densidade-in-situ',
          active: location === '/solos/densidade-in-situ'
        },
        {
          label: 'Densidade Real',
          icon: Layers,
          href: '/solos/densidade-real',
          active: location === '/solos/densidade-real'
        },
        {
          label: 'Densidade Máx/Mín',
          icon: Scale,
          href: '/solos/densidade-max-min',
          active: location === '/solos/densidade-max-min'
        }
      ]
    },
    {
      label: 'Asfalto',
      icon: Car,
      expandable: true,
      expanded: asfaltoOpen,
      onToggle: () => setAsfaltoOpen(!asfaltoOpen),
      children: [
        {
          label: 'Em Desenvolvimento',
          icon: Settings,
          href: '/asfalto',
          disabled: true
        }
      ]
    },
    {
      label: 'Concreto',
      icon: Building2,
      expandable: true,
      expanded: concretoOpen,
      onToggle: () => setConcretoOpen(!concretoOpen),
      children: [
        {
          label: 'Em Desenvolvimento',
          icon: Settings,
          href: '/concreto',
          disabled: true
        }
      ]
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed left-0 top-0 z-40 h-screen w-64 bg-white border-r border-gray-200 shadow-lg">
      {/* Header */}
      <div className="flex items-center gap-3 p-6 border-b border-gray-200">
        <div className="p-2 bg-blue-100 rounded-lg">
          <FlaskRound className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Laboratório Ev.C.S</h2>
          <p className="text-sm text-gray-500">Sistema Geotécnico</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => (
          <div key={item.label}>
            {item.expandable ? (
              <Collapsible open={item.expanded} onOpenChange={item.onToggle}>
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-between px-3 py-2 h-auto text-left font-normal",
                      "hover:bg-gray-100 text-gray-700"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </div>
                    {item.expanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-1 mt-1">
                  {item.children?.map((child) => {
                    const content = (
                      <Button
                        variant="ghost"
                        disabled={child.disabled}
                        className={cn(
                          "w-full justify-start px-3 py-2 h-auto text-left font-normal ml-6",
                          child.active
                            ? "bg-blue-100 text-blue-700 border-l-2 border-blue-500"
                            : "hover:bg-gray-100 text-gray-600",
                          child.disabled && "opacity-50 cursor-not-allowed"
                        )}
                      >
                        <child.icon className="h-4 w-4 mr-3" />
                        <span className="text-sm">{child.label}</span>
                      </Button>
                    );

                    return child.disabled ? (
                      <div key={child.label}>{content}</div>
                    ) : (
                      <Link key={child.label} href={child.href}>
                        {content}
                      </Link>
                    );
                  })}
                </CollapsibleContent>
              </Collapsible>
            ) : (
              <Link href={item.href || '#'}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start px-3 py-2 h-auto text-left font-normal",
                    item.active
                      ? "bg-blue-100 text-blue-700 border-l-2 border-blue-500"
                      : "hover:bg-gray-100 text-gray-700"
                  )}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  <span>{item.label}</span>
                </Button>
              </Link>
            )}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          <div>Versão 1.0.0</div>
          <div>ABNT NBR 6457/9813</div>
        </div>
      </div>
    </div>
  );
}