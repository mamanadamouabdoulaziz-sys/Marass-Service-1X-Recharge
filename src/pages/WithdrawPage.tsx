import React, { useState, useCallback } from 'react';
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Upload, ArrowLeft, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { SuccessModal } from "@/components/SuccessModal";
import { Id } from "../../convex/_generated/dataModel";
interface WithdrawSuccessData {
  accountId: string;
  amount: number;
  destinationNumber: string;
  storageId: Id<"_storage">;
}
export function WithdrawPage() {
  const navigate = useNavigate();
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const createTransaction = useMutation(api.transactions.createTransaction);
  const user = useQuery(api.auth.loggedInUser);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [successData, setSuccessData] = useState<WithdrawSuccessData | null>(null);
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
      if (!result.ok) throw new Error("Upload failed");
      const { storageId } = await result.json();
      await createTransaction({
        type: "withdraw",
        amount,
        accountId,
        proofStorageId: storageId,
        destinationNumber,
      });
      setSuccessData({
        accountId,
        amount,
        destinationNumber,
        storageId,
      });
      toast.success("Demande de retrait enregistrée !");
    } catch (err) {
      console.error(err);
      toast.error("Une erreur est survenue lors du retrait");
    } finally {
      setLoading(false);
    }
  }, [file, generateUploadUrl, createTransaction]);
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12">
        <Button asChild variant="ghost" className="mb-6">
          <Link to="/"><ArrowLeft className="mr-2 h-4 w-4" /> Retour au tableau de bord</Link>
        </Button>
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-lg border-2">
            <CardHeader className="bg-destructive/5 border-b border-destructive/10">
              <CardTitle className="text-2xl font-bold">Demande de Retrait</CardTitle>
              <CardDescription>Convertissez vos gains DemoBet en argent MobilePay réel.</CardDescription>
            </CardHeader>
            <CardContent className="pt-8">
              <form onSubmit={onSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="accountId">Code de Retrait DemoBet</Label>
                  <Input id="accountId" name="accountId" placeholder="Entrez le code généré par l'app DemoBet" required disabled={loading} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="destinationNumber">Numéro de réception (Orange/MTN)</Label>
                  <Input id="destinationNumber" name="destinationNumber" type="tel" placeholder="Ex: 6XXXXXXXX" required disabled={loading} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Montant à retirer (FCFA)</Label>
                  <Input id="amount" name="amount" type="number" placeholder="10000" min="1000" required disabled={loading} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="proof">Preuve du code de retrait (Screenshot)</Label>
                  <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-2 hover:bg-muted/50 transition-colors cursor-pointer relative">
                    <input
                      type="file"
                      id="proof"
                      accept="image/*"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      required
                      disabled={loading}
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                    />
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <span className="text-sm font-medium">{file ? file.name : "Capture du code de retrait"}</span>
                  </div>
                </div>
                <Button type="submit" variant="default" className="w-full h-12 text-lg" disabled={loading}>
                  {loading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Envoi...</> : "Envoyer la demande de retrait"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      <SuccessModal
        isOpen={!!successData}
        onClose={() => navigate("/")}
        type="withdraw"
        data={successData || {}}
        userEmail={user?.email}
      />
    </div>
  );
}