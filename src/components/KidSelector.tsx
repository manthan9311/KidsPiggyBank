import { UserPlus } from 'lucide-react';
import type { Kid } from '../lib/types';
import { getTheme } from '../lib/themes';

interface KidSelectorProps {
  kidsList: Kid[];
  selectedKid: Kid | null;
  onSelectKid: (kid: Kid) => void;
  onAddKid: () => void;
}

export default function KidSelector({ kidsList, selectedKid, onSelectKid, onAddKid }: KidSelectorProps) {
  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-3 items-center justify-center">
        {kidsList.map((kid) => {
          const theme = getTheme(kid.theme_color);
          return (
            <button
              key={kid.id}
              onClick={() => onSelectKid(kid)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${selectedKid?.id === kid.id
                  ? `${theme.primary} text-white shadow-lg scale-105`
                  : `bg-white text-gray-700 ${theme.hover} border-2 ${theme.border}`
                }`}
            >
              {kid.name}
            </button>
          );
        })}
        <button
          onClick={onAddKid}
          className="px-6 py-3 rounded-xl font-semibold bg-green-500 text-white hover:bg-green-600 transition-colors flex items-center gap-2"
        >
          <UserPlus className="w-5 h-5" />
          Add Child
        </button>
      </div>
    </div>
  );
}
