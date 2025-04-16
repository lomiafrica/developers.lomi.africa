import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  ImagePlus,
  CheckCircle,
  FileIcon,
  X,
  ArrowRight,
  Loader2,
  ChevronDown,
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { ButtonExpand } from "@/components/ui/button-expand";
import { useToast } from "@/lib/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const categories = [
  { value: "account", label: "Account" },
  { value: "billing", label: "Billing" },
  { value: "technical", label: "Technical Issue" },
  { value: "other", label: "Other" },
];

interface SelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
}

const CustomSelect = ({ value, onChange, options }: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectRef]);

  return (
    <div ref={selectRef} className="relative">
      <button
        type="button"
        className={cn(
          "w-full bg-background text-foreground p-2 cursor-pointer border border-border",
          "hover:bg-accent dark:hover:bg-accent/50 transition-colors duration-200 flex items-center justify-between",
          "text-sm font-medium rounded-sm focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring",
          isOpen ? "ring-1 ring-ring border-ring" : "",
        )}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span>
          {value
            ? options.find((opt: SelectOption) => opt.value === value)?.label ||
            ""
            : "Select a category"}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 opacity-50 transition-transform duration-200",
            isOpen ? "rotate-180" : "",
          )}
        />
      </button>
      {isOpen && (
        <div
          className="absolute top-full left-0 w-full bg-background border border-border mt-1 z-10 shadow-md rounded-sm py-1"
          role="listbox"
        >
          {options.map((option: SelectOption) => (
            <div
              key={option.value}
              className="px-2 py-1.5 hover:bg-accent dark:hover:bg-accent/50 cursor-pointer text-sm font-medium rounded-sm transition-colors duration-150 focus:outline-none focus:bg-accent dark:focus:bg-accent/50"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              role="option"
              aria-selected={value === option.value}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  onChange(option.value);
                  setIsOpen(false);
                }
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

interface ModalSupportFormProps {
  isOpen: boolean;
  onClose: () => void;
  contextData?: {
    linkId?: string;
    subject?: string;
    productId?: string;
    planId?: string;
    transactionId?: string;
    customerId?: string;
    webhookId?: string;
    payoutId?: string;
  };
}

interface DeveloperInfo {
  userId: string;
  merchantId: string;
  organizationId: string | null;
}

export default function ModalSupportForm({
  isOpen,
  onClose,
  contextData,
}: ModalSupportFormProps) {
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    setSubmitError(null);
  }, [isOpen, category, message, image]);

  useEffect(() => {
    if (isOpen && contextData) {
      let messagePrefix = "";

      if (contextData.productId) {
        messagePrefix = `Product ID: ${contextData.productId}\n\n`;
      } else if (contextData.planId) {
        messagePrefix = `Plan ID: ${contextData.planId}\n\n`;
      } else if (contextData.transactionId) {
        messagePrefix = `Transaction ID: ${contextData.transactionId}\n\n`;
      } else if (contextData.customerId) {
        messagePrefix = `Customer ID: ${contextData.customerId}\n\n`;
      } else if (contextData.webhookId) {
        messagePrefix = `Webhook ID: ${contextData.webhookId}\n\n`;
      } else if (contextData.linkId) {
        messagePrefix = `Payment Link ID: ${contextData.linkId}\n\n`;
      } else if (contextData.payoutId) {
        messagePrefix = `Payout ID: ${contextData.payoutId}\n\n`;
      }

      setMessage((prevMessage) =>
        prevMessage.startsWith("Issue description:") ||
          !prevMessage ||
          prevMessage.startsWith(messagePrefix)
          ? `${messagePrefix}Issue description: `
          : prevMessage,
      );
    } else if (
      isOpen &&
      !message.trim().replace("Issue description:", "").trim()
    ) {
      setMessage("Issue description: ");
    }
  }, [contextData, isOpen, message]);

  const fetchDeveloperInfo = async (): Promise<DeveloperInfo | null> => {
    setSubmitError(null);
    try {
      const response = await fetch("/api/developer-info");
      if (!response.ok) {
        let errorMsg = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMsg = errorData.error || errorMsg;
        } catch (jsonError) {
          // Ignore if response is not JSON
        }
        throw new Error(errorMsg);
      }
      const data: DeveloperInfo = await response.json();
      if (!data.merchantId || !data.userId) {
        throw new Error("User or Merchant ID not found in API response.");
      }
      return data;
    } catch (error) {
      console.error("Error fetching developer info:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to fetch user details.";
      setSubmitError(errorMessage);
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
      return null;
    }
  };

  const resetForm = useCallback(() => {
    setCategory("");
    setMessage("");
    setImage(null);
    setIsSubmitted(false);
    setUploadProgress(0);
    setIsSubmitting(false);
    setIsUploading(false);
    setSubmitError(null);
    setMessage("Issue description: ");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [
    setCategory,
    setMessage,
    setImage,
    setIsSubmitted,
    setUploadProgress,
    setIsSubmitting,
    setIsUploading,
    setSubmitError,
  ]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    const developerInfo = await fetchDeveloperInfo();

    if (!developerInfo) {
      setIsSubmitting(false);
      return;
    }

    const { userId, merchantId, organizationId } = developerInfo;
    const effectiveOrganizationId = organizationId || merchantId;

    let imageUrl: string | null = null;
    let progressInterval: ReturnType<typeof setInterval> | undefined =
      undefined;

    if (image) {
      setIsUploading(true);
      setUploadProgress(0);
      const sanitizedFileName = image.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const fileName = `support-uploads/${userId}/${Date.now()}_${sanitizedFileName}`;

      try {
        progressInterval = setInterval(() => {
          setUploadProgress((prev) => Math.min(prev + 15, 95));
        }, 150);

        const { error: uploadError } = await supabase.storage
          .from("support_request_images")
          .upload(fileName, image);

        if (progressInterval) clearInterval(progressInterval);
        setUploadProgress(100);

        if (uploadError) {
          console.error("Error uploading image:", uploadError);
          throw new Error(`Failed to upload image: ${uploadError.message}`);
        }

        const { data: urlData } = supabase.storage
          .from("support_request_images")
          .getPublicUrl(fileName);

        imageUrl = urlData?.publicUrl ?? null;

        if (!imageUrl) {
          console.warn(
            "Could not retrieve public URL for uploaded image:",
            fileName,
          );
        }
      } catch (uploadError) {
        if (progressInterval) clearInterval(progressInterval);
        setIsUploading(false);
        setUploadProgress(0);
        const errorMsg =
          uploadError instanceof Error
            ? uploadError.message
            : "Image upload failed.";
        toast({
          variant: "destructive",
          title: "Upload Error",
          description: errorMsg,
        });
        setSubmitError(errorMsg);
        setIsSubmitting(false);
        return;
      } finally {
        if (progressInterval) clearInterval(progressInterval);
        setIsUploading(false);
      }
    }

    try {
      const { data: supportRequestData, error: supportRequestError } =
        await supabase.rpc("create_support_request", {
          p_merchant_id: merchantId,
          p_organization_id: effectiveOrganizationId,
          p_category: category as
            | "billing"
            | "other"
            | "account"
            | "technical"
            | "feature",
          p_message: message,
          p_image_url: imageUrl ?? undefined,
          p_subject: contextData?.subject || "Support Request",
        });

      if (supportRequestError) {
        console.error("Error submitting support request:", supportRequestError);
        throw new Error(`Submission failed: ${supportRequestError.message}`);
      }

      console.log("Support request submitted:", supportRequestData);
      setIsSubmitted(true);
      setTimeout(() => {
        onClose();
        setTimeout(resetForm, 150);
      }, 3000);
    } catch (error) {
      console.error("Error in support request submission:", error);
      const errorMsg =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.";
      toast({
        variant: "destructive",
        title: "Submission Error",
        description: errorMsg,
      });
      setSubmitError(errorMsg);
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        resetForm();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, resetForm]);

  const handleDrop = (e: React.DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setSubmitError(null);
      setImage(file);
      setIsUploading(false);
      setUploadProgress(0);
    } else if (file) {
      toast({
        variant: "destructive",
        title: "Invalid File",
        description: "Please drop an image file.",
      });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setSubmitError(null);
      setImage(file);
      setIsUploading(false);
      setUploadProgress(0);
    } else if (file) {
      toast({
        variant: "destructive",
        title: "Invalid File",
        description: "Please select an image file.",
      });
    }
  };

  const isSubmitDisabled =
    !category ||
    !message.replace("Issue description:", "").trim() ||
    isSubmitting;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-md w-full max-h-[90vh] overflow-y-auto p-2 rounded-sm border bg-background shadow-lg">
        <DialogHeader className="p-3 border-b">
          <DialogTitle className="text-base font-semibold">
            Contact Support
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {contextData?.subject
              ? `Need help with ${contextData.subject}? Describe the issue below.`
              : "Describe the issue you are facing or ask your question below."}
          </DialogDescription>
        </DialogHeader>

        {isSubmitted ? (
          <div className="flex flex-col items-center justify-center space-y-3 py-10 px-4">
            <CheckCircle className="h-12 w-12 text-green-500 mb-2" />
            <p className="text-base font-medium">Request Submitted!</p>
            <p className="text-sm text-muted-foreground text-center">
              We&apos;ve received your request and will get back to you shortly.
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-3 p-3 pb-2">
              <CustomSelect
                value={category}
                onChange={setCategory}
                options={categories}
              />
              <div className="relative">
                <Textarea
                  placeholder="Please describe the issue in detail..."
                  value={message}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setMessage(e.target.value)
                  }
                  onDrop={handleDrop}
                  onDragOver={(e: React.DragEvent<HTMLTextAreaElement>) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onDragEnter={(e: React.DragEvent<HTMLTextAreaElement>) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  className={cn(
                    "min-h-[120px] max-h-[240px] text-sm placeholder:text-sm placeholder:text-muted-foreground",
                    "pr-10 w-full resize-y rounded-sm border bg-background",
                    "focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring transition-colors duration-200",
                  )}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute bottom-1.5 right-1.5 h-7 w-7 text-muted-foreground hover:text-foreground rounded-sm"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    fileInputRef.current?.click();
                  }}
                  aria-label="Attach image"
                >
                  <ImagePlus className="h-4 w-4" />
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>
              {image && (
                <div className="border rounded-none p-2 relative bg-background max-w-full overflow-hidden">
                  <div className="flex items-center space-x-2">
                    <div
                      className={`p-1.5 rounded-sm flex-shrink-0 ${image.type.includes("png") ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400" : "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"}`}
                    >
                      <FileIcon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0 overflow-hidden">
                      <p className="text-xs font-medium truncate w-full">
                        {image.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {(image.size / 1024).toFixed(0)} KB
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setImage(null);
                        setUploadProgress(0);
                        setIsUploading(false);
                        if (fileInputRef.current) {
                          fileInputRef.current.value = "";
                        }
                      }}
                      className="text-muted-foreground hover:text-foreground flex-shrink-0 p-1 -m-1 rounded-full focus:outline-none focus:ring-1 focus:ring-ring"
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remove image</span>
                    </button>
                  </div>
                  {(isUploading || (isSubmitting && image && !submitError)) &&
                    uploadProgress > 0 && (
                      <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 h-1 rounded-full overflow-hidden">
                        <div
                          className={`h-1 rounded-full transition-all duration-300 ease-out ${uploadProgress === 100 ? "bg-green-500" : "bg-blue-500"}`}
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    )}
                </div>
              )}
              {submitError && (
                <p className="text-xs text-red-600 dark:text-red-500 px-1">
                  Error: {submitError}
                </p>
              )}
            </div>

            <DialogFooter className=" p-3 flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
              <DialogClose asChild>
                <Button
                  variant="outline"
                  disabled={isSubmitting}
                  className="rounded-sm w-full sm:w-auto"
                >
                  Cancel
                </Button>
              </DialogClose>
              <ButtonExpand
                text={isSubmitting ? "Submitting..." : "Submit Request"}
                customIcon={
                  isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ArrowRight className="h-4 w-4" />
                  )
                }
                bgColor="bg-blue-600 dark:bg-blue-700"
                textColor="text-white"
                hoverBgColor="hover:bg-blue-700 dark:hover:bg-blue-800"
                hoverTextColor="hover:text-white"
                className="h-9 shadow-none w-full sm:w-auto rounded-sm text-sm px-3"
                onClick={handleSubmit}
                disabled={isSubmitDisabled}
              />
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
