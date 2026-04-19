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
        `_Validation automatique générée par DemoBet Navy_`;
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
        <Button asChild variant="ghost" className="mb-6 hover:bg-white/5 text-muted-foreground hover:text-white">
          <Link to="/"><ArrowLeft className="mr-2 h-4 w-4" /> Retour au tableau de bord</Link>
        </Button>
        <div className="max-w-2xl mx-auto space-y-6">
          <Alert className="bg-[#1e3a8a]/40 border-primary animate-pulse shadow-[0_0_20px_rgba(234,88,12,0.1)]">
            <AlertTriangle className="h-5 w-5 text-primary" />
            <AlertDescription className="text-sm font-bold leading-relaxed text-white">
              SVP Effectuer un Compte à Compte <span className="text-primary underline font-black">MyNita, Amanata ou Wave</span> au <span className="text-lg text-primary">80 48 48 30</span> avant de soumettre.
            </AlertDescription>
          </Alert>
          <Card className="glass-dark border-white/10 overflow-hidden rounded-3xl">
            <CardHeader className="bg-[#1e3a8a]/20 border-b border-white/5 p-8">
              <CardTitle className="text-2xl font-black text-white uppercase italic tracking-tighter">Effectuer un Dépôt</CardTitle>
              <CardDescription className="text-muted-foreground/80 font-medium">Validation Navy Elite après transfert réel simulé.</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={onSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="accountId" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">ID Compte DemoBet</Label>
                  <Input id="accountId" name="accountId" placeholder="Entrez votre ID Compte" required disabled={loading} className="bg-white/5 border-white/10 h-12 rounded-xl focus:ring-primary focus:border-primary" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Montant (FCFA)</Label>
                  <Input id="amount" name="amount" type="number" placeholder="5000" min="500" required disabled={loading} className="bg-white/5 border-white/10 h-12 rounded-xl focus:ring-primary focus:border-primary" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Preuve de paiement (Screenshot)</Label>
                  <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 hover:bg-white/5 transition-all cursor-pointer relative group">
                    <input
                      type="file"
                      id="proof"
                      accept="image/*"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      required
                      disabled={loading}
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                    />
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Upload className="h-6 w-6 text-primary" />
                    </div>
                    <span className="text-sm font-bold text-foreground">{file ? file.name : "Cliquez pour télécharger la preuve"}</span>
                    <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">JPG, PNG (Max 5MB)</span>
                  </div>
                </div>
                <Button type="submit" className="w-full h-14 text-lg btn-gradient border-none mt-4" disabled={loading}>
                  {loading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> ENVOI EN COURS...</> : "CONFIRMER LE DÉPÔT"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}