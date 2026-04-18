import React, { useState, useCallback } from 'react';
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Upload, HelpCircle, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { SuccessModal } from "@/components/SuccessModal";
export function SupportPage() {
  const navigate = useNavigate();
  const createClaim = useMutation(api.claims.createClaim);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const myClaims = useQuery(api.claims.getUserClaims) ?? [];
  const user = useQuery(api.auth.loggedInUser);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [successData, setSuccessData] = useState<any>(null);
  const onSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const description = formData.get("description") as string;
    const email = formData.get("email") as string;
    try {
      let storageId = undefined;
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
      setSuccessData({
        description,
        email,
      });
      toast.success("Votre réclamation a été soumise avec succès.");
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
      <div className="py-8 md:py-10 lg:py-12 space-y-12">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold tracking-tight">Support & Réclamations</h1>
          <p className="text-muted-foreground mt-2">
            Un problème avec un dépôt ou un retrait ? Nos agents traitent vos demandes sous 24h.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardHeader className="bg-primary/5">
                <CardTitle className="text-xl">Nouvelle Réclamation</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={onSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Adresse Email</Label>
                    <Input id="email" name="email" type="email" placeholder="votre@email.com" required disabled={loading} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description du problème</Label>
                    <Textarea id="description" name="description" placeholder="Expliquez en détail votre souci..." rows={5} required disabled={loading} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="proof">Preuve optionnelle</Label>
                    <div className="border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center gap-2 hover:bg-muted/50 cursor-pointer relative">
                      <input
                        type="file"
                        id="proof"
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                        disabled={loading}
                      />
                      <Upload className="h-5 w-5 text-muted-foreground" />
                      <span className="text-xs">{file ? file.name : "Ajouter une capture d'écran"}</span>
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : "Soumettre la réclamation"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Vos demandes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {myClaims.length > 0 ? (
                  myClaims.map((claim) => (
                    <div key={claim._id} className="p-3 border rounded-md text-sm space-y-2 bg-muted/20">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">Ticket #{claim._id.slice(-6).toUpperCase()}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                          claim.status === "pending" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
                        }`}>
                          {claim.status === "pending" ? "En attente" : "Résolu"}
                        </span>
                      </div>
                      <p className="line-clamp-2 text-muted-foreground italic text-xs">"{claim.description}"</p>
                      <div className="text-[10px] text-muted-foreground">
                        {format(claim.createdAt, "PPP", { locale: fr })}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 text-muted-foreground text-sm italic">
                    Aucune réclamation en cours.
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