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
import { CheckCircle, Copy, MessageCircle, ExternalLink } from "lucide-react";
import { toast } from "sonner";
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
    imageUrl?: string;
  };
  userEmail?: string;
}
export function SuccessModal({ isOpen, onClose, type, data, userEmail }: SuccessModalProps) {
  const adminWhatsApp = "80484830";
  const timestamp = new Date().toLocaleString("fr-FR");
  const getMessage = () => {
    const title = type === "deposit" ? "DÉPÔT" : type === "withdraw" ? "RETRAIT" : "RÉCLAMATION";
    let msg = `*Nouvelle demande: ${title}*\n`;
    if (data.accountId) msg += `ID/Code: ${data.accountId}\n`;
    if (data.amount) msg += `Montant: ${data.amount.toLocaleString()} FCFA\n`;
    if (data.destinationNumber) msg += `Dest: ${data.destinationNumber}\n`;
    if (data.email) msg += `Email: ${data.email}\n`;
    if (data.description) msg += `Desc: ${data.description}\n`;
    if (data.imageUrl) msg += `Preuve: ${data.imageUrl}\n`;
    msg += `Utilisateur: ${userEmail || "Anonyme"}\n`;
    msg += `Date: ${timestamp}`;
    return msg;
  };
  const handleWhatsApp = () => {
    const encoded = encodeURIComponent(getMessage());
    window.open(`https://wa.me/${adminWhatsApp}?text=${encoded}`, "_blank");
  };
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getMessage());
      toast.success("Message copié dans le presse-papier");
    } catch (err) {
      toast.error("Échec de la copie");
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md border-2 border-primary/20">
        <DialogHeader className="flex flex-col items-center gap-2">
          <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center mb-2">
            <CheckCircle className="h-8 w-8 text-emerald-600" />
          </div>
          <DialogTitle className="text-2xl font-bold text-center">Soumission Réussie</DialogTitle>
          <DialogDescription className="text-center">
            Votre demande a été enregistrée. Pour un traitement prioritaire, envoyez les détails via WhatsApp.
          </DialogDescription>
        </DialogHeader>
        <div className="bg-muted/50 rounded-lg p-4 space-y-3 border border-border">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <span className="text-muted-foreground">Type:</span>
            <span className="font-semibold capitalize">{type}</span>
            {data.accountId && (
              <>
                <span className="text-muted-foreground">{type === "withdraw" ? "Code:" : "ID Compte:"}</span>
                <span className="font-mono font-bold">{data.accountId}</span>
              </>
            )}
            {data.amount && (
              <>
                <span className="text-muted-foreground">Montant:</span>
                <span className="font-bold text-primary">{data.amount.toLocaleString()} FCFA</span>
              </>
            )}
            {data.destinationNumber && (
              <>
                <span className="text-muted-foreground">Destination:</span>
                <span className="font-semibold">{data.destinationNumber}</span>
              </>
            )}
          </div>
          {data.imageUrl && (
            <div className="pt-2 border-t">
              <a 
                href={data.imageUrl} 
                target="_blank" 
                rel="noreferrer"
                className="text-xs text-primary flex items-center gap-1 hover:underline"
              >
                <ExternalLink className="h-3 w-3" /> Voir la preuve de paiement
              </a>
            </div>
          )}
        </div>
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            onClick={handleCopy}
            className="flex-1 gap-2"
          >
            <Copy className="h-4 w-4" /> Copier
          </Button>
          <Button 
            onClick={handleWhatsApp}
            className="flex-1 gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white border-none shadow-lg shadow-emerald-500/20"
          >
            <MessageCircle className="h-4 w-4" /> WhatsApp
          </Button>
        </DialogFooter>
        <Button variant="ghost" className="w-full text-muted-foreground mt-2" onClick={onClose}>
          Fermer et retourner à l'accueil
        </Button>
      </DialogContent>
    </Dialog>
  );
}