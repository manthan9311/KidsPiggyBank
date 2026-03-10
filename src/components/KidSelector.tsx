import { UserPlus } from 'lucide-react';
import type { Kid } from '../lib/types';
 
interface KidSelectorProps {
  kids: Kid[];
  selectedKid: Kid | null;
  onSelectKid: (kid: Kid) => void;
  onAddKid: () => void;
}

export default function KidSelector({ kids, selectedKid, onSelectKid, onAddKid }: KidSelectorProps) {
  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-3 items-center justify-center">
        {kids.map((kid) => (
          <button
            key={kid.id}
            onClick={() => onSelectKid(kid)}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              selectedKid?.id === kid.id
                ? 'bg-pink-500 text-white shadow-lg scale-105'
                : 'bg-white text-gray-700 hover:bg-pink-100 border-2 border-pink-200'
            }`}
          >
            {kid.name}
          </button>
        ))}
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
