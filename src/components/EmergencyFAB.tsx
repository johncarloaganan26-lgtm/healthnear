/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Siren } from 'lucide-react';
import { motion } from 'motion/react';

interface EmergencyFABProps {
  onClick: () => void;
  isDarkMode?: boolean;
}

export default function EmergencyFAB({ onClick, isDarkMode }: EmergencyFABProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      onClick={onClick}
      className={`fixed bottom-8 right-8 z-[1000] w-20 h-20 bg-[#C85C5C] text-white rounded-full flex flex-col items-center justify-center shadow-2xl ring-8 ring-[#C85C5C]/20 hover:scale-105 transition-all group ${
        isDarkMode ? 'border-2 border-white/10' : ''
      }`}
    >
      <Siren className="group-hover:animate-pulse" size={28} />
      <span className="text-[10px] font-bold mt-1 uppercase tracking-tighter">SOS</span>
      <span className="absolute right-24 bg-[#C85C5C] text-white px-4 py-2 rounded-xl text-xs font-bold opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap pointer-events-none shadow-xl border border-white/20">
        Emergency Quick Access
      </span>
    </motion.button>
  );
}
