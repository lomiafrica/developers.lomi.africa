"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { UserAuthForm } from "@/components/auth/user-auth-form";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-0 rounded-lg border-0 sm:max-w-lg [&>button]:hidden">
        <div className="p-6 sm:p-8">
          <DialogHeader className="text-left mb-6">
            <DialogTitle className="text-2xl font-semibold tracking-tight">
              Welcome back
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Sign in to your account to continue
            </DialogDescription>
          </DialogHeader>
          <UserAuthForm />
        </div>
      </DialogContent>
    </Dialog>
  );
}
