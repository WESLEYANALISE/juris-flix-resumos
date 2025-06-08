
import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
  isActive?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  if (items.length === 0) return null;

  return (
    <Breadcrumb className="mb-6">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink 
            onClick={items[0]?.onClick}
            className="flex items-center gap-2 text-netflix-lightGray hover:text-white cursor-pointer"
          >
            <Home className="h-4 w-4" />
            {items[0]?.label}
          </BreadcrumbLink>
        </BreadcrumbItem>
        
        {items.slice(1).map((item, index) => (
          <React.Fragment key={index}>
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              {item.isActive ? (
                <BreadcrumbPage className="text-netflix-red font-medium">
                  {item.label}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink 
                  onClick={item.onClick}
                  className="text-netflix-lightGray hover:text-white cursor-pointer"
                >
                  {item.label}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default Breadcrumbs;
