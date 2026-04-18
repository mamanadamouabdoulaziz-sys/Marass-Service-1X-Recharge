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
  const adminWhatsApp = "80484830";
  const timestamp = new Date().toLocaleString("fr-FR");
  // Fetch the public URL if storageId is provided
  const publicUrl = useQuery(api.files.getFileUrl, 
    data.storageId ? { storageId: data.storageId } : "skip"
  );
  const getMessage = () => {
    const title = type === "deposit" ? "DÉPÔT" : type === "withdraw" ? "RETRAIT" : "RÉCLAMATION";
    let msg = `*Nouvelle demande: ${title}*\n`;
    if (data.accountId) msg += `ID/Code: ${data.accountId}\n`;
    if (data.amount) msg += `Montant: ${data.amount.toLocaleString()} FCFA\n`;
    if (data.destinationNumber) msg += `Dest: ${data.destinationNumber}\n`;
    if (data.email) msg += `Email: ${data.email}\n`;
    if (data.description) msg += `Desc: ${data.description}\n`;
    if (publicUrl) msg += `Preuve: ${publicUrl}\n`;
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
  const isImageLoading = data.storageId && publicUrl === undefined;
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
        <div className="bg-muted/50 rounded-lg p-4 space-y-3 border border-border max-h-[40vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-x-2 gap-y-3 text-sm">
            <span className="text-muted-foreground">Type:</span>
            <span className="font-semibold capitalize text-right">{type}</span>
            {data.accountId && (
              <>
                <span className="text-muted-foreground">{type === "withdraw" ? "Code:" : "ID Compte:"}</span>
                <span className="font-mono font-bold text-right">{data.accountId}</span>
              </>
            )}
            {data.amount && (
              <>
                <span className="text-muted-foreground">Montant:</span>
                <span className="font-bold text-primary text-right">{data.amount.toLocaleString()} FCFA</span>
              </>
            )}
            {data.destinationNumber && (
              <>
                <span className="text-muted-foreground">Destination:</span>
                <span className="font-semibold text-right">{data.destinationNumber}</span>
              </>
            )}
            {data.email && (
              <>
                <span className="text-muted-foreground">Email:</span>
                <span className="font-semibold text-right truncate">{data.email}</span>
              </>
            )}
          </div>
          {data.description && (
            <div className="pt-2 border-t mt-2">
              <span className="text-xs text-muted-foreground block mb-1">Description:</span>
              <p className="text-sm italic text-foreground whitespace-pre-wrap leading-relaxed bg-background/50 p-2 rounded">
                {data.description}
              </p>
            </div>
          )}
          {data.storageId && (
            <div className="pt-2 border-t flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Preuve:</span>
              {isImageLoading ? (
                <div className="flex items-center gap-1 text-xs text-muted-foreground animate-pulse">
                  <Loader2 className="h-3 w-3 animate-spin" /> Préparation du lien...
                </div>
              ) : publicUrl ? (
                <a
                  href={publicUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-primary font-medium flex items-center gap-1 hover:underline"
                >
                  <ExternalLink className="h-3 w-3" /> Voir le fichier
                </a>
              ) : (
                <span className="text-xs text-destructive">Lien indisponible</span>
              )}
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
            disabled={isImageLoading}
            className="flex-1 gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white border-none shadow-lg shadow-emerald-500/20"
          >
            {isImageLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageCircle className="h-4 w-4" />}
            WhatsApp
          </Button>
        </DialogFooter>
        <Button variant="ghost" className="w-full text-muted-foreground mt-2" onClick={onClose}>
          Fermer et retourner à l'accueil
        </Button>
      </DialogContent>
    </Dialog>
  );
}