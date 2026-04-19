import React, { useState, useCallback } from 'react';
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Upload, ArrowLeft, Loader2, ArrowDownToLine } from "lucide-react";
import { Link } from "react-router-dom";
export function WithdrawPage() {
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
      toast.error("Veuillez télécharger une preuve de retrait");
      return;
    }
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const amount = Number(formData.get("amount"));
    const accountId = formData.get("accountId") as string;
    const destinationNumber = formData.get("destinationNumber") as string;
    try {
      const uploadUrl = await generateUploadUrl();
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!result.ok) throw new Error("File upload failed");
      const { storageId } = await result.json();
      await createTransaction({
        type: "withdraw",
        amount,
        accountId,
        proofStorageId: storageId,
        destinationNumber,
      });
      const publicUrl = await getPublicUrl({ storageId });
      const message = `*DEMANDE DE RETRAIT*\n\n` +
        `• Type: Retrait DemoBet\n` +
        `• Code de Retrait: ${accountId}\n` +
        `• Numéro Réception: ${destinationNumber}\n` +
        `• Montant: ${amount.toLocaleString()} FCFA\n` +
        `• Preuve: ${publicUrl || "Lien indisponible"}\n` +
        `• Client: ${user?.email || "Anonyme"}\n` +
        `• Date: ${new Date().toLocaleString('fr-FR')}\n\n` +
        `_Validation automatique générée par DemoBet Intermediary_`;
      const waUrl = `https://wa.me/22780484830?text=${encodeURIComponent(message)}`;
      window.open(waUrl, '_blank', 'noopener,noreferrer');
      toast.success("📱 Demande de retrait transmise via WhatsApp !");
      if ('vibrate' in navigator) navigator.vibrate(200);
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      console.error(err);
      toast.error("Une erreur est survenue lors de votre retrait");
    } finally {
      setLoading(false);
    }
  }, [file, generateUploadUrl, getPublicUrl, createTransaction, user, navigate]);
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12">
        <Button asChild variant="ghost" className="mb-6 hover:bg-white/5 group">
          <Link to="/"><ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Retour au tableau de bord</Link>
        </Button>
        <div className="max-w-2xl mx-auto space-y-6">
          <Card className="glass-dark border-white/10 overflow-hidden">
            <CardHeader className="bg-primary/10 border-b border-white/5 px-8 py-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/20 rounded-xl">
                  <ArrowDownToLine className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-white uppercase tracking-tight">Demande de Retrait</CardTitle>
                  <CardDescription className="text-muted-foreground/80">Convertissez vos gains DemoBet en argent réel simulé.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={onSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="accountId" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Code de Retrait DemoBet</Label>
                  <Input id="accountId" name="accountId" placeholder="Entrez le code généré" required disabled={loading} className="bg-white/5 border-white/10 h-12" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="destinationNumber" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Numéro de réception (MyNita/Wave)</Label>
                  <Input id="destinationNumber" name="destinationNumber" type="tel" placeholder="Ex: 80 48 48 30" required disabled={loading} className="bg-white/5 border-white/10 h-12" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Montant (FCFA)</Label>
                  <Input id="amount" name="amount" type="number" placeholder="10000" min="1000" required disabled={loading} className="bg-white/5 border-white/10 h-12" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="proof" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Capture du code de retrait</Label>
                  <div className="border-2 border-dashed border-white/20 rounded-xl p-8 flex flex-col items-center justify-center gap-3 hover:bg-white/5 transition-all cursor-pointer relative group">
                    <input
                      type="file"
                      id="proof"
                      accept="image/*"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      required
                      disabled={loading}
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                    />
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                      <Upload className="h-6 w-6 text-primary" />
                    </div>
                    <span className="text-sm font-bold text-foreground text-center">{file ? file.name : "Cliquez pour uploader le screenshot"}</span>
                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">JPG, PNG - Max 5MB</span>
                  </div>
                </div>
                <Button type="submit" className="w-full h-14 text-lg btn-gradient border-none mt-4" disabled={loading}>
                  {loading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> ENVOI EN COURS...</> : "CONFIRMER LE RETRAIT"}
                </Button>
              </form>
            </CardContent>
          </Card>
          <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/5">
             <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
             <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest leading-none">
               Traitement prioritaire activé pour ce compte
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}