import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  ToastProgressBar,
} from "@/components/ui/toast"
import { useToast } from "@/lib/hooks/use-toast"
import { CheckCircle2, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"

const styles = `
@keyframes iconSlideIn {
  0% {
    transform: translateX(-10px) scale(0.9);
    opacity: 0;
  }
  100% {
    transform: translateX(0) scale(1);
    opacity: 1;
  }
}
`

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      <style>{styles}</style>
      {toasts.map(function ({ id, title, description, action, variant = "default", ...props }) {
        return (
          <Toast key={id} {...props} variant={variant}>
            <div className="flex items-start gap-3">
              <div className="pt-3 pl-1">
                {variant === "destructive" ? (
                  <XCircle className={cn(
                    "h-5 w-5 text-red-500 dark:text-red-400",
                    "animate-[iconSlideIn_0.3s_ease-in-out]"
                  )} />
                ) : (
                  <CheckCircle2 className={cn(
                    "h-5 w-5 text-emerald-500 dark:text-emerald-400",
                    "animate-[iconSlideIn_0.3s_ease-in-out]"
                  )} />
                )}
              </div>
              <div className="grid gap-1">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
              </div>
            </div>
            {action}
            <ToastClose />
            <ToastProgressBar variant={variant || 'default'} />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
