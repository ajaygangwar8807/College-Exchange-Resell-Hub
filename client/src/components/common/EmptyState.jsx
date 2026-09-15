import React from 'react';
import { PackageOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

const EmptyState = ({
  icon: Icon = PackageOpen,
  title = 'No items found',
  message = 'There are no listings matching your criteria.',
  actionText,
  actionLink,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-slate-200/80 shadow-sm max-w-md mx-auto my-6">
      <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-4">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
      <p className="text-slate-500 text-sm mb-6 leading-relaxed max-w-xs">{message}</p>
      {actionText && (
        actionLink ? (
          <Link
            to={actionLink}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-xl transition-all shadow-md hover:shadow-indigo-200"
          >
            {actionText}
          </Link>
        ) : (
          <button
            onClick={onAction}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-xl transition-all shadow-md hover:shadow-indigo-200"
          >
            {actionText}
          </button>
        )
      )}
    </div>
  );
};

export default EmptyState;
