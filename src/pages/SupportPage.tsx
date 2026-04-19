import React, { useState, useCallback } from 'react';
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate, Link } from "react-router-dom";
import { Upload, HelpCircle, Loader2, ArrowLeft, MessageSquare, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
export function SupportPage() {
  const navigate = useNavigate();
  const createClaim = useMutation(api.claims.createClaim);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const getPublicUrl = useMutation(api.files.getPublicUrl);
  const myClaims = useQuery(api.claims.getUserClaims) ?? [];
  const user = useQuery(api.auth.loggedInUser);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const onSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const description = formData.get("description") as string;
    const email = formData.get("email") as string;
    try {
      let storageId: any = undefined;
      let publicUrl: string | null = null;
      if (file) {
        const uploadUrl = await generateUploadUrl();
        const result = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });
        const res = await result.json();
        storageId = res.storageId;
        publicUrl = await getPublicUrl({ storageId });
      }
      await createClaim({
        description,
        email,
        proofStorageId: storageId
      });
      const message = `*RÉCLAMATION SUPPORT*\n\n` +
        `• Email Contact: ${email}\n` +
        `• Description: ${description}\n` +
        `• Preuve: ${publicUrl || "Aucune preuve jointe"}\n` +
        `• Utilisateur: ${user?.email || "Anonyme"}\n` +
        `• Date: ${new Date().toLocaleString('fr-FR')}\n\n` +
        `_Validation automatique générée par DemoBet Navy_`;
      const waUrl = `https://wa.me/22780484830?text=${encodeURIComponent(message)}`;
      window.open(waUrl, '_blank', 'noopener,noreferrer');
      toast.success("📱 Ticket transmis à l'admin WhatsApp !");
      if ('vibrate' in navigator) navigator.vibrate(200);
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la soumission de votre ticket");
    } finally {
      setLoading(false);
    }
  }, [file, generateUploadUrl, getPublicUrl, createClaim, user, navigate]);
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12 space-y-10">
        <div className="flex items-center justify-between">
          <Button asChild variant="ghost" className="hover:bg-white/5 text-muted-foreground hover:text-white">
            <Link to="/"><ArrowLeft className="mr-2 h-4 w-4" /> Retour</Link>
          </Button>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white bg-primary px-4 py-1.5 rounded-full shadow-lg shadow-primary/20 animate-pulse">
            <MessageSquare className="h-3 w-3" /> Support Prioritaire
          </div>
        </div>
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic drop-shadow-2xl">Centre d'Aide Elite</h1>
          <p className="text-muted-foreground font-medium text-sm">
            Validation WhatsApp automatique pour un traitement en moins de 15 minutes.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-6">
            <Card className="glass-dark border-white/10 shadow-2xl rounded-3xl overflow-hidden">
              <CardHeader className="bg-[#1e3a8a]/20 border-b border-white/5 p-8">
                <CardTitle className="text-xl font-bold text-white flex items-center gap-3">
                  <HelpCircle className="h-5 w-5 text-primary" /> Nouvelle Réclamation
                </CardTitle>
                <CardDescription className="text-muted-foreground">Votre satisfaction est notre priorité absolue.</CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={onSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Email de contact</Label>
                    <Input id="email" name="email" type="email" placeholder="votre@email.com" defaultValue={user?.email || ""} required disabled={loading} className="bg-white/5 border-white/10 h-12 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Détails de l'incident</Label>
                    <Textarea id="description" name="description" placeholder="Expliquez votre problème ici..." rows={5} required disabled={loading} className="bg-white/5 border-white/10 resize-none p-4 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Preuve (Optionnelle)</Label>
                    <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 hover:bg-white/5 transition-all cursor-pointer relative group">
                      <input
                        type="file"
                        id="proof"
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                        disabled={loading}
                      />
                      <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <Upload className="h-6 w-6 text-muted-foreground group-hover:text-primary" />
                      </div>
                      <span className="text-sm font-bold text-foreground">{file ? file.name : "Ajouter une capture d'écran"}</span>
                      <span className="text-[10px] text-muted-foreground uppercase font-black tracking-tighter">JPG ou PNG max 10MB</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-primary/5 border border-primary/20 p-4 rounded-2xl flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <p className="text-[11px] text-primary font-black uppercase tracking-tight leading-relaxed">
                        Note : Une fenêtre WhatsApp Elite s'ouvrira après soumission pour valider votre ticket.
                      </p>
                    </div>
                    <Button type="submit" className="w-full btn-orange h-14 text-lg border-none uppercase tracking-widest" disabled={loading}>
                      {loading ? <><Loader2 className="animate-spin mr-2 h-5 w-5" /> ENVOI...</> : "OUVRIR MON TICKET"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <Card className="glass-dark border-white/10 shadow-xl rounded-3xl sticky top-24 overflow-hidden">
              <CardHeader className="bg-[#1e3a8a]/20 border-b border-white/5 p-6">
                <CardTitle className="text-lg font-black text-white uppercase italic tracking-tighter leading-none">Historique Tickets</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
                {myClaims.length > 0 ? (
                  myClaims.map((claim) => (
                    <div key={claim._id} className="p-4 bg-white/5 border border-white/5 rounded-2xl space-y-3 hover:bg-white/10 transition-all duration-300">
                      <div className="flex justify-between items-start">
                        <span className="font-black text-[10px] text-primary">#NAVY-{claim._id.slice(-6).toUpperCase()}</span>
                        <span className={`text-[9px] px-2.5 py-1 rounded-full font-black uppercase tracking-widest ${
                          claim.status === "pending" ? "bg-primary/10 text-primary border border-primary/20" : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                        }`}>
                          {claim.status === "pending" ? "En attente" : "Résolu"}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed italic font-medium">"{claim.description}"</p>
                      <div className="text-[9px] text-muted-foreground/60 font-black uppercase tracking-widest flex justify-between pt-1">
                        <span>{format(claim.createdAt, "PPP", { locale: fr })}</span>
                        <span className="text-primary/60 italic">Actif</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-16 px-4 space-y-4">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto opacity-20">
                      <MessageSquare className="h-6 w-6 text-primary" />
                    </div>
                    <p className="text-sm text-muted-foreground italic font-medium uppercase tracking-tighter">Aucun ticket ouvert</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}