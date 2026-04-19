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
import { Upload, HelpCircle, Loader2, ArrowLeft, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { SuccessModal } from "@/components/SuccessModal";
import { Id } from "../../convex/_generated/dataModel";
interface ClaimSuccessData {
  description: string;
  email: string;
  storageId?: Id<"_storage">;
}
export function SupportPage() {
  const navigate = useNavigate();
  const createClaim = useMutation(api.claims.createClaim);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const myClaims = useQuery(api.claims.getUserClaims) ?? [];
  const user = useQuery(api.auth.loggedInUser);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [successData, setSuccessData] = useState<ClaimSuccessData | null>(null);
  const onSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const description = formData.get("description") as string;
    const email = formData.get("email") as string;
    try {
      let storageId: Id<"_storage"> | undefined = undefined;
      if (file) {
        const uploadUrl = await generateUploadUrl();
        const result = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });
        const res = await result.json();
        storageId = res.storageId;
      }
      await createClaim({ description, email, proofStorageId: storageId });
      setSuccessData({ description, email, storageId });
      toast.success("Réclamation soumise avec succès.");
      (e.target as HTMLFormElement).reset();
      setFile(null);
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la soumission");
    } finally {
      setLoading(false);
    }
  }, [file, generateUploadUrl, createClaim]);
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12 space-y-10">
        <div className="flex items-center justify-between">
          <Button asChild variant="ghost" className="hover:bg-white/5 text-muted-foreground hover:text-white">
            <Link to="/"><ArrowLeft className="mr-2 h-4 w-4" /> Retour</Link>
          </Button>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20">
            <MessageSquare className="h-3 w-3" /> Support Prioritaire
          </div>
        </div>
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic">Centre d'Aide</h1>
          <p className="text-muted-foreground font-medium text-sm">
            Un problème avec un dépôt ou un retrait ? Nos agents traitent vos demandes sous 24h ouvrées.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-6">
            <Card className="glass-dark border-white/10 shadow-2xl">
              <CardHeader className="bg-primary/10 border-b border-white/5 p-6">
                <CardTitle className="text-xl font-bold text-white flex items-center gap-3">
                  <HelpCircle className="h-5 w-5 text-primary" /> Nouvelle Réclamation
                </CardTitle>
                <CardDescription className="text-muted-foreground">Expliquez précisément votre problème pour une résolution rapide.</CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={onSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Adresse Email de contact</Label>
                    <Input id="email" name="email" type="email" placeholder="votre@email.com" required disabled={loading} className="bg-white/5 border-white/10 h-12" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Détails de l'incident</Label>
                    <Textarea id="description" name="description" placeholder="Montant, Date, ID Compte, etc..." rows={5} required disabled={loading} className="bg-white/5 border-white/10 resize-none p-4" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Preuve optionnelle</Label>
                    <div className="border-2 border-dashed border-white/10 rounded-xl p-8 flex flex-col items-center justify-center gap-3 hover:bg-white/5 transition-all cursor-pointer relative group">
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
                      <span className="text-sm font-bold text-foreground">{file ? file.name : "Cliquez pour ajouter une capture d'écran"}</span>
                      <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">PNG, JPG ou PDF max 10MB</span>
                    </div>
                  </div>
                  <Button type="submit" className="w-full btn-gradient h-14 text-lg border-none" disabled={loading}>
                    {loading ? <><Loader2 className="animate-spin mr-2 h-5 w-5" /> ENVOI EN COURS...</> : "SOUMETTRE MON TICKET"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <Card className="glass-dark border-white/10 shadow-xl sticky top-24">
              <CardHeader className="border-b border-white/5 p-6">
                <CardTitle className="text-lg font-bold text-white uppercase tracking-tight">Historique Tickets</CardTitle>
                <CardDescription className="text-xs">Suivez le statut de vos demandes</CardDescription>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                {myClaims.length > 0 ? (
                  myClaims.map((claim) => (
                    <div key={claim._id} className="p-4 bg-white/5 border border-white/5 rounded-xl space-y-3 hover:bg-white/10 transition-all duration-300">
                      <div className="flex justify-between items-start">
                        <span className="font-black text-xs text-white">#TICKET-{claim._id.slice(-6).toUpperCase()}</span>
                        <span className={`text-[9px] px-2.5 py-1 rounded-full font-black uppercase tracking-widest ${
                          claim.status === "pending" ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                        }`}>
                          {claim.status === "pending" ? "En attente" : "Résolu"}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed italic">"{claim.description}"</p>
                      <div className="text-[10px] text-muted-foreground/60 font-bold flex justify-between pt-1">
                        <span>{format(claim.createdAt, "PPP", { locale: fr })}</span>
                        <span className="text-primary/60">Demobet Support</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-16 px-4 space-y-4">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto opacity-20">
                      <MessageSquare className="h-6 w-6" />
                    </div>
                    <p className="text-sm text-muted-foreground italic font-medium">Aucun ticket ouvert pour le moment.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <SuccessModal
        isOpen={!!successData}
        onClose={() => setSuccessData(null)}
        type="claim"
        data={successData || {}}
        userEmail={user?.email}
      />
    </div>
  );
}