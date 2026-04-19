import React, { useEffect, useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, Copy, MessageCircle, ExternalLink, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { Progress } from "@/components/ui/progress";
interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "deposit" | "withdraw" | "claim";
  data: {
    accountId?: string;
    amount?: number;
    destinationNumber?: string;
    description?: string;
    email?: string;
    storageId?: Id<"_storage">;
  };
  userEmail?: string;
}
export function SuccessModal({ isOpen, onClose, type, data, userEmail }: SuccessModalProps) {
  const adminWhatsApp = "22780484830";
  const [countdown, setCountdown] = useState(3);
  const [hasForwarded, setHasForwarded] = useState(false);
  const autoForwardRef = useRef<boolean>(false);
  const publicUrl = useQuery(api.files.getFileUrl,
    data.storageId ? { storageId: data.storageId } : "skip"
  );
  const getMessage = () => {
    const timestamp = new Date().toLocaleString("fr-FR");
    const title = type === "deposit" ? "💰 DÉPÔT" : type === "withdraw" ? "💸 RETRAIT" : "⚠️ RÉCLAMATION";
    let msg = `*${title} - DEMOBET INTERMEDIARY*\n\n`;
    if (data.accountId) msg += `🆔 *ID/Code:* ${data.accountId}\n`;
    if (data.amount) msg += `💵 *Montant:* ${data.amount.toLocaleString()} FCFA\n`;
    if (data.destinationNumber) msg += `📱 *Destinataire:* ${data.destinationNumber}\n`;
    if (data.email) msg += `📧 *Email:* ${data.email}\n`;
    if (data.description) msg += `📝 *Description:* ${data.description}\n`;
    if (publicUrl) msg += `🖼️ *Preuve:* ${publicUrl}\n`;
    msg += `👤 *Client:* ${userEmail || "Anonyme"}\n`;
    msg += `🕒 *Date:* ${timestamp}`;
    return msg;
  };
  const handleWhatsApp = () => {
    const encoded = encodeURIComponent(getMessage());
    window.open(`https://wa.me/${adminWhatsApp}?text=${encoded}`, "_blank");
    setHasForwarded(true);
  };
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getMessage());
      toast.success("Message copié avec succès !");
    } catch (err) {
      toast.error("Échec de la copie");
    }
  };
  useEffect(() => {
    if (isOpen) {
      // Haptic feedback
      if ("vibrate" in navigator) {
        navigator.vibrate(200);
      }
      toast.info("Validation automatique en cours...");
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            if (!autoForwardRef.current) {
              autoForwardRef.current = true;
              handleWhatsApp();
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => {
        clearInterval(timer);
        autoForwardRef.current = false;
        setCountdown(3);
      };
    }
  }, [isOpen]);
  const handleManualClose = () => {
    if (!hasForwarded && countdown > 0) {
      if (confirm("Veuillez envoyer le message WhatsApp pour valider votre transaction. Fermer quand même ?")) {
        onClose();
      }
    } else {
      onClose();
    }
  };
  const isImageLoading = data.storageId && publicUrl === undefined;
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleManualClose()}>
      <DialogContent className="sm:max-w-md glass-dark border-white/10 text-white shadow-2xl p-0 overflow-hidden outline-none">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-500 via-primary to-emerald-500 z-50" />
        <div className="p-6">
          <DialogHeader className="flex flex-col items-center gap-4 py-4">
            <div className="h-16 w-16 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              <CheckCircle className="h-10 w-10 text-emerald-500" />
            </div>
            <div className="space-y-1 text-center">
              <DialogTitle className="text-2xl font-black uppercase tracking-tighter italic">Soumission Réussie</DialogTitle>
              <DialogDescription className="text-muted-foreground font-bold text-xs uppercase tracking-widest">
                Action requise pour validation immédiate
              </DialogDescription>
            </div>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 flex flex-col items-center gap-3">
              <div className="flex items-center gap-3 text-primary animate-pulse">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Redirection WhatsApp dans {countdown}s</span>
              </div>
              <Progress value={(3 - countdown) * 33.33} className="h-1 bg-white/5" />
            </div>
            <div className="bg-white/5 rounded-xl p-5 space-y-4 border border-white/5 backdrop-blur-md relative overflow-hidden">
               <div className="absolute top-0 right-0 p-2 opacity-10">
                 <MessageCircle className="h-12 w-12" />
               </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm relative z-10">
                <span className="text-muted-foreground font-bold uppercase text-[10px] tracking-widest">Type</span>
                <span className="font-black text-right uppercase text-white tracking-tight">{type}</span>
                {data.amount && (
                  <>
                    <span className="text-muted-foreground font-bold uppercase text-[10px] tracking-widest">Montant</span>
                    <span className="font-black text-emerald-400 text-right text-lg">{data.amount.toLocaleString()} FCFA</span>
                  </>
                )}
              </div>
              <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Statut Preuve</span>
                {isImageLoading ? (
                  <span className="text-[10px] text-primary animate-pulse font-black">CHARGEMENT...</span>
                ) : publicUrl ? (
                  <span className="text-[10px] text-emerald-400 font-black flex items-center gap-1 uppercase">Prête <ExternalLink className="h-2 w-2" /></span>
                ) : (
                  <span className="text-[10px] text-destructive font-black">NON DISPONIBLE</span>
                )}
              </div>
            </div>
          </div>
          <DialogFooter className="flex flex-col gap-3 mt-8">
            <Button
              onClick={handleWhatsApp}
              disabled={isImageLoading}
              className="w-full h-14 bg-[#25D366] hover:bg-[#128C7E] text-white border-none shadow-[0_0_30px_rgba(37,211,102,0.3)] font-black text-lg transition-all duration-300 animate-glow"
            >
              {isImageLoading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <MessageCircle className="h-6 w-6 mr-3" />}
              VALIDER SUR WHATSAPP
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleCopy}
                className="flex-1 h-12 border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-widest"
              >
                <Copy className="h-4 w-4 mr-2" /> COPIER
              </Button>
              <Button 
                variant="ghost" 
                className="flex-1 h-12 text-muted-foreground hover:text-white text-[10px] font-black tracking-widest uppercase" 
                onClick={handleManualClose}
              >
                Fermer
              </Button>
            </div>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}