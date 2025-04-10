"use client";

import * as React from "react";
import {
  Dialog,
  DialogOverlay,
  DialogContent,
  DialogPortal,
} from "@radix-ui/react-dialog";
import { UserAuthForm } from "@/components/auth/user-auth-form";
import { motion, AnimatePresence } from "framer-motion";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  React.useEffect(() => {
    if (isOpen) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }

    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <AnimatePresence>
        {isOpen && (
          <DialogPortal forceMount>
            <DialogOverlay asChild forceMount onClick={onClose}>
              <motion.div
                className="fixed inset-0 z-[100] bg-black/30"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{ backdropFilter: "blur(1px)" }}
                onClick={(e) => {
                  if (e.target === e.currentTarget) {
                    onClose();
                  }
                }}
              />
            </DialogOverlay>
            <DialogContent asChild forceMount>
              <motion.div
                className="fixed inset-0 z-[101] flex items-center justify-center p-4"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                onClick={(e) => {
                  if (e.target === e.currentTarget) {
                    onClose();
                  }
                }}
              >
                <div className="relative w-[425px] max-w-md rounded-lg shadow-lg bg-background p-6">
                  <UserAuthForm />
                </div>
              </motion.div>
            </DialogContent>
          </DialogPortal>
        )}
      </AnimatePresence>
    </Dialog>
  );
}

/*
.modal-open {
  overflow: hidden;
}
*/
