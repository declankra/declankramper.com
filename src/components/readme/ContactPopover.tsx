"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

// Form schema validation
const contactFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  message: z.string().min(1, { message: "Message is required" })
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

interface ContactPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  origin: { x: number; y: number };
}

export function ContactPopover({ isOpen, onClose, origin }: ContactPopoverProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema)
  });

  async function onSubmit(data: ContactFormValues) {
    setIsSubmitting(true);
    
    try {
      // Send data to Supabase
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit contact form');
      }
      
      // Success!
      setIsSuccess(true);
      reset();
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  // Function to reset the form and close the popover
  const handleClose = () => {
    setIsSuccess(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop - invisible but clickable to close */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50"
            onClick={handleClose}
          />

          {/* Popover */}
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.8,
              x: origin.x,
              y: origin.y,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              x: origin.x,
              y: origin.y,
            }}
            exit={{
              opacity: 0,
              scale: 0.8,
              x: origin.x,
              y: origin.y,
            }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 300,
            }}
            className="fixed z-50 w-80 bg-card border border-border rounded-lg shadow-lg"
            style={{
              transformOrigin: "center bottom",
              transform: "translate(-50%, 0)",
            }}
          >
            <div className="p-4">
              {isSuccess ? (
                <div className="text-center py-6 space-y-4">
                  <h3 className="text-sm font-medium">Message Sent</h3>
                  <p className="text-xs text-muted-foreground">
                    Thanks for reaching out! I can't wait to read what you had to say :)
                  </p>
                  <button
                    onClick={handleClose}
                    className="px-3 py-1.5 text-xs bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                  >
                    Have a great day!
                  </button>
                </div>
              ) : (
                <>
                  <h3 className="text-sm font-medium mb-3">Say Hello</h3>
                  
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-xs font-medium block">
                        Who are you?
                      </label>
                      <input
                        id="name"
                        placeholder="Name or email so I can reach you back!"
                        className={`w-full p-2 text-xs border rounded-md ${
                          errors.name ? "border-destructive" : "border-input"
                        } bg-background focus:outline-none focus:ring-1 focus:ring-primary`}
                        {...register("name")}
                      />
                      {errors.name && (
                        <p className="text-xs text-destructive">{errors.name.message}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="message" className="text-xs font-medium block">
                        What's on your mind?
                      </label>
                      <textarea
                        id="message"
                        placeholder="Your message"
                        rows={3}
                        className={`w-full p-2 text-xs border rounded-md ${
                          errors.message ? "border-destructive" : "border-input"
                        } bg-background focus:outline-none focus:ring-1 focus:ring-primary`}
                        {...register("message")}
                      />
                      {errors.message && (
                        <p className="text-xs text-destructive">{errors.message.message}</p>
                      )}
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      <button
                        type="button"
                        onClick={handleClose}
                        className="px-3 py-1.5 text-xs border border-input rounded-md bg-background hover:bg-accent transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-3 py-1.5 text-xs bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? "Sending..." : "Send"}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
} 