import React, { useState, useCallback } from 'react';
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Upload, ArrowLeft, Loader2, ArrowDownToLine, Zap } from "lucide-react";
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
        `_Validation automatique générée par DemoBet Navy_`;
      const waUrl = `https://wa.me/22780484830?text=${encodeURIComponent(message)}`;
      toast.success("📱 Demande de retrait transmise via WhatsApp !");
      if ('vibrate' in navigator) navigator.vibrate(200);
      // Use window.location.href for better mobile deep-link triggering
      window.location.href = waUrl;
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
        <Button asChild variant="ghost" className="mb-6 hover:bg-white/5 group text-muted-foreground hover:text-white">
          <Link to="/"><ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Retour au tableau de bord</Link>
        </Button>
        <div className="max-w-2xl mx-auto space-y-6">
          <Card className="glass-dark border-white/10 overflow-hidden rounded-3xl">
            <CardHeader className="bg-[#1e3a8a]/20 border-b border-white/5 px-8 py-10">
              <div className="flex items-center gap-5">
                <div className="p-3 bg-primary/20 rounded-xl shadow-[0_0_15px_rgba(234,88,12,0.2)]">
                  <ArrowDownToLine className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-3xl font-black text-white uppercase tracking-tight italic leading-none">Demande de Retrait</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={onSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="accountId" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Code de Retrait DemoBet</Label>
                  <Input id="accountId" name="accountId" placeholder="Entrez le code généré" required disabled={loading} className="bg-white/5 border-white/10 h-12 rounded-xl focus:ring-primary focus:border-primary" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="destinationNumber" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Numéro de réception (MyNita/Wave)</Label>
                  <Input id="destinationNumber" name="destinationNumber" type="tel" placeholder="Ex: 80 48 48 30" required disabled={loading} className="bg-white/5 border-white/10 h-12 rounded-xl focus:ring-primary focus:border-primary" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Montant (FCFA)</Label>
                  <Input id="amount" name="amount" type="number" placeholder="10000" min="1000" required disabled={loading} className="bg-white/5 border-white/10 h-12 rounded-xl focus:ring-primary focus:border-primary" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Capture du code de retrait</Label>
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
                    <div className="w-14 h-14 rounded-full bg-[#1e40af]/20 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Upload className="h-6 w-6 text-primary" />
                    </div>
                    <span className="text-sm font-bold text-foreground text-center">{file ? file.name : "Cliquez pour uploader le screenshot"}</span>
                    <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">JPG, PNG - Max 5MB</span>
                  </div>
                </div>
                <Button type="submit" className="w-full h-14 text-lg btn-gradient border-none mt-4 uppercase tracking-widest" disabled={loading}>
                  {loading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> ENVOI EN COURS...</> : "CONFIRMER LE RETRAIT"}
                </Button>
              </form>
            </CardContent>
          </Card>
          <div className="flex items-center gap-3 p-4 bg-[#1e3a8a]/20 rounded-2xl border border-white/5 shadow-xl">
             <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
             <p className="text-[10px] font-black text-primary uppercase tracking-widest leading-none flex items-center gap-2">
               <Zap className="h-3 w-3 fill-current" /> Traitement Elite Navy Activé
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}