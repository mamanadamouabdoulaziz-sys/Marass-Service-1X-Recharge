import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, Copy, MessageCircle, ExternalLink, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { cn } from "@/lib/utils";
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
  // Region-specific country code for Niger (+227) as these are local services
  const adminWhatsApp = "22780484830";
  const timestamp = new Date().toLocaleString("fr-FR");
  const publicUrl = useQuery(api.files.getFileUrl,
    data.storageId ? { storageId: data.storageId } : "skip"
  );
  const getMessage = () => {
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
  };
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getMessage());
      toast.success("Message copié avec succès !");
    } catch (err) {
      toast.error("Échec de la copie");
    }
  };
  const isImageLoading = data.storageId && publicUrl === undefined;
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md glass-dark border-white/10 text-white shadow-2xl p-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-primary to-emerald-500" />
        <div className="p-6">
          <DialogHeader className="flex flex-col items-center gap-4 py-4">
            <div className="h-16 w-16 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
              <CheckCircle className="h-10 w-10 text-emerald-500" />
            </div>
            <div className="space-y-1 text-center">
              <DialogTitle className="text-2xl font-black uppercase tracking-tighter">Soumission Réussie</DialogTitle>
              <DialogDescription className="text-muted-foreground font-medium">
                Demande enregistrée. Contactez un agent WhatsApp pour accélérer la validation.
              </DialogDescription>
            </div>
          </DialogHeader>
          <div className="bg-white/5 rounded-xl p-5 space-y-4 border border-white/5 backdrop-blur-md">
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
              <span className="text-muted-foreground font-bold uppercase text-[10px] tracking-widest">Opération</span>
              <span className="font-black text-right uppercase text-white tracking-tight">{type}</span>
              {data.accountId && (
                <>
                  <span className="text-muted-foreground font-bold uppercase text-[10px] tracking-widest">Référence</span>
                  <span className="font-mono font-bold text-right text-primary truncate pl-4">{data.accountId}</span>
                </>
              )}
              {data.amount && (
                <>
                  <span className="text-muted-foreground font-bold uppercase text-[10px] tracking-widest">Montant</span>
                  <span className="font-black text-emerald-400 text-right text-lg">{data.amount.toLocaleString()} FCFA</span>
                </>
              )}
              {data.destinationNumber && (
                <>
                  <span className="text-muted-foreground font-bold uppercase text-[10px] tracking-widest">Vers</span>
                  <span className="font-bold text-right text-white">{data.destinationNumber}</span>
                </>
              )}
            </div>
            {data.description && (
              <div className="pt-3 border-t border-white/5">
                <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest block mb-2">Message</span>
                <p className="text-xs text-white/80 leading-relaxed bg-black/40 p-3 rounded-lg border border-white/5 italic">
                  "{data.description}"
                </p>
              </div>
            )}
            <div className="pt-3 border-t border-white/5 flex items-center justify-between">
              <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Preuve de Transfert</span>
              {isImageLoading ? (
                <div className="flex items-center gap-2 text-xs text-primary animate-pulse font-bold">
                  <Loader2 className="h-3 w-3 animate-spin" /> GÉNÉRATION...
                </div>
              ) : publicUrl ? (
                <a
                  href={publicUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-emerald-400 font-black flex items-center gap-1 hover:text-emerald-300 transition-colors bg-emerald-500/10 px-2 py-1 rounded"
                >
                  <ExternalLink className="h-3 w-3" /> VOIR
                </a>
              ) : (
                <span className="text-[10px] text-destructive font-black">INDIQPONIBLE</span>
              )}
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-3 mt-8">
            <Button
              variant="outline"
              onClick={handleCopy}
              className="flex-1 h-12 border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold"
            >
              <Copy className="h-4 w-4 mr-2" /> COPIER
            </Button>
            <Button
              onClick={handleWhatsApp}
              disabled={isImageLoading}
              className="flex-1 h-12 bg-[#25D366] hover:bg-[#128C7E] text-white border-none shadow-lg shadow-emerald-500/20 font-black"
            >
              {isImageLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <MessageCircle className="h-4 w-4 mr-2" />}
              WHATSAPP
            </Button>
          </DialogFooter>
          <Button variant="ghost" className="w-full text-muted-foreground hover:text-white mt-4 text-[10px] font-black tracking-widest uppercase" onClick={onClose}>
            Fermer la fenêtre
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}