import React, { useState, useCallback } from 'react';
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Upload, ArrowLeft, Loader2, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
export function DepositPage() {
  const navigate = useNavigate();
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const getPublicUrl = useMutation(api.files.getPublicUrl);
  const createTransaction = useMutation(api.transactions.createTransaction);
  const user = useQuery(api.auth.loggedInUser);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const onSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      toast.error("Veuillez télécharger une preuve de paiement");
      return;
    }
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const amount = Number(formData.get("amount"));
    const accountId = formData.get("accountId") as string;
    try {
      const uploadUrl = await generateUploadUrl();
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!result.ok) throw new Error("Upload failed");
      const { storageId } = await result.json();
      await createTransaction({
        type: "deposit",
        amount,
        accountId,
        proofStorageId: storageId,
      });
      const publicUrl = await getPublicUrl({ storageId });
      const message = `*DEMANDE DE DÉPÔT*\n\n` +
        `• Type: Dépôt DemoBet\n` +
        `• ID Compte: ${accountId}\n` +
        `• Montant: ${amount.toLocaleString()} FCFA\n` +
        `• Preuve: ${publicUrl || "Lien indisponible"}\n` +
        `• Client: ${user?.email || "Anonyme"}\n` +
        `• Date: ${new Date().toLocaleString('fr-FR')}\n\n` +
        `_Validation automatique générée par DemoBet Intermediary_`;
      const waUrl = `https://wa.me/22780484830?text=${encodeURIComponent(message)}`;
      window.open(waUrl, '_blank', 'noopener,noreferrer');
      toast.success("📱 Demande transmise à l'admin WhatsApp !");
      if ('vibrate' in navigator) navigator.vibrate(200);
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      console.error(err);
      toast.error("Une erreur est survenue lors du dépôt");
    } finally {
      setLoading(false);
    }
  }, [file, generateUploadUrl, getPublicUrl, createTransaction, user, navigate]);
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12">
        <Button asChild variant="ghost" className="mb-6 hover:bg-white/5">
          <Link to="/"><ArrowLeft className="mr-2 h-4 w-4" /> Retour au tableau de bord</Link>
        </Button>
        <div className="max-w-2xl mx-auto space-y-6">
          <Alert variant="destructive" className="bg-destructive/20 border-destructive animate-pulse shadow-lg">
            <AlertTriangle className="h-5 w-5" />
            <AlertDescription className="text-sm font-bold leading-relaxed">
              SVP Effectuer un Compte à Compte <span className="underline">MyNita, Amanata ou Wave</span> au <span className="text-lg">80 48 48 30</span> avant d'envoyer la Demande.
            </AlertDescription>
          </Alert>
          <Card className="glass-dark border-white/10">
            <CardHeader className="bg-primary/10 border-b border-white/5">
              <CardTitle className="text-2xl font-bold text-white">Effectuer un Dépôt</CardTitle>
              <CardDescription className="text-muted-foreground/80">Remplissez les informations après avoir effectué votre transfert réel simulé.</CardDescription>
            </CardHeader>
            <CardContent className="pt-8">
              <form onSubmit={onSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="accountId" className="text-foreground">ID Compte DemoBet</Label>
                  <Input id="accountId" name="accountId" placeholder="Entrez votre ID Compte" required disabled={loading} className="bg-white/5 border-white/10" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-foreground">Montant (FCFA)</Label>
                  <Input id="amount" name="amount" type="number" placeholder="5000" min="500" required disabled={loading} className="bg-white/5 border-white/10" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="proof" className="text-foreground">Preuve de paiement (Screenshot)</Label>
                  <div className="border-2 border-dashed border-white/20 rounded-lg p-6 flex flex-col items-center justify-center gap-2 hover:bg-white/5 transition-colors cursor-pointer relative">
                    <input
                      type="file"
                      id="proof"
                      accept="image/*"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      required
                      disabled={loading}
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                    />
                    <Upload className="h-8 w-8 text-primary" />
                    <span className="text-sm font-medium text-foreground">{file ? file.name : "Cliquez pour télécharger ou glissez-déposez"}</span>
                    <span className="text-xs text-muted-foreground">Format JPG, PNG (Max 5MB)</span>
                  </div>
                </div>
                <Button type="submit" className="w-full h-12 text-lg btn-gradient border-none" disabled={loading}>
                  {loading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Traitement...</> : "Soumettre le Dépôt"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}