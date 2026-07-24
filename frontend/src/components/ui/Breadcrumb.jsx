import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

function Breadcrumb({ items }) {
  return (
    <nav className="flex items-center text-sm text-zinc-400 whitespace-nowrap overflow-x-auto pb-2 scrollbar-hide">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            {item.href && !isLast ? (
              <Link to={item.href} className="hover:text-indigo-400 transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? "text-zinc-100 font-medium" : "text-zinc-400"}>
                {item.label}
              </span>
            )}
            
            {!isLast && <ChevronRight size={14} className="mx-2 shrink-0 text-zinc-600" />}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

export default Breadcrumb;
