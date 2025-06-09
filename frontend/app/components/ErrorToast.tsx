import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSidebar } from '../context/SidebarContext';

interface ErrorToastProps {
  message: string | null;
  onDismiss: () => void;
  duration?: number;
}

export default function ErrorToast({ message, onDismiss, duration = 4000 }: ErrorToastProps) {
  const { sidebarOpen } = useSidebar();
  
  useEffect(() => {
    if (message) {
      const timer = setTimeout(onDismiss, duration);
      return () => clearTimeout(timer);
    }
  }, [message, duration, onDismiss]);

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className={`fixed bottom-28 z-50 ${sidebarOpen ? 'left-[calc(50%+32px)]' : 'left-1/2'} -translate-x-1/2`}
        >
          <div className="bg-destructive/10 text-destructive font-medium text-sm py-3 px-6 rounded-lg border border-destructive/20 shadow-lg whitespace-nowrap">
            {message}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 