// src/components/ReminderConfirmationPopup.jsx
"use client"

import { motion, AnimatePresence } from "framer-motion";

const ReminderConfirmationPopup = ({ isOpen, onClose }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={onClose} // Optional: close when clicking backdrop
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gradient-to-br from-purple-700 to-pink-600 p-6 rounded-lg shadow-xl text-white max-w-sm w-full text-center"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside popup
          >
            <h3 className="text-xl font-semibold mb-4">Reminder Request Sent!</h3>
            <p className="mb-6">You'll get a little nudge soon.</p>
            <button
              onClick={onClose}
              className="bg-white text-purple-700 py-2 px-6 rounded-full font-medium hover:bg-purple-100 transition-colors"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ReminderConfirmationPopup;
