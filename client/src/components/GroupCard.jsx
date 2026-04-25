import React from "react";
import { ArrowRight, Users } from "lucide-react";

const GroupCard = ({ name, members, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white p-6 rounded-2xl shadow-bento border border-slate-100 hover:border-brand-indigo group transition-all cursor-pointer"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="bg-indigo-50 w-12 h-12 rounded-xl flex items-center justify-center text-brand-indigo">
          <Users size={24} />
        </div>
        <ArrowRight
          className="text-slate-200 group-hover:text-brand-indigo transition-colors"
          size={20}
        />
      </div>
      <h3 className="font-bold text-xl text-slate-800 mb-1">{name}</h3>
      <p className="text-slate-400 text-sm flex items-center gap-1">
        {members} active contributors
      </p>

      <div className="mt-6 pt-6 border-t border-slate-50 flex -space-x-2">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500"
          >
            U{i}
          </div>
        ))}
        <div className="w-8 h-8 rounded-full border-2 border-white bg-indigo-50 flex items-center justify-center text-[10px] font-bold text-brand-indigo">
          +
        </div>
      </div>
    </div>
  );
};

export default GroupCard;
