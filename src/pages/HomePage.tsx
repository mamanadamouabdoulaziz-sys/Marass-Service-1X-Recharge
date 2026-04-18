import React from 'react';
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Authenticated, Unauthenticated } from "convex/react";
import { SignInForm } from "../components/SignInForm";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { PlusCircle, ArrowDownToLine, History, User, MessageCircle, Copy } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";
export function HomePage() {
  const transactions = useQuery(api.transactions.getUserTransactions) ?? [];
  const user = useQuery(api.auth.loggedInUser);
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved": return <Badge className="bg-emerald-500 hover:bg-emerald-600 px-3 py-0.5">Approuvé</Badge>;
      case "rejected": return <Badge variant="destructive" className="px-3 py-0.5">Rejeté</Badge>;
      default: return <Badge variant="secondary" className="bg-amber-100 text-amber-700 hover:bg-amber-100 px-3 py-0.5">En attente</Badge>;
    }
  };
  const copyId = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("ID copié !");
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12 space-y-8">
        <Authenticated>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">Tableau de bord</h1>
              <p className="text-muted-foreground mt-1 flex items-center gap-2">
                <User className="h-4 w-4" /> {user?.email}
              </p>
            </div>
            <div className="flex gap-2">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/10">
                <Link to="/deposit"><PlusCircle className="mr-2 h-5 w-5" /> Dépôt</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/withdraw"><ArrowDownToLine className="mr-2 h-5 w-5" /> Retrait</Link>
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6">
            <Card className="shadow-md border-0 ring-1 ring-border overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/30">
                <div>
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <History className="h-5 w-5 text-muted-foreground" /> Activité Récente
                  </CardTitle>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  Live Support
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {transactions.length > 0 ? (
                  <div className="divide-y">
                    {transactions.map((tx) => (
                      <div key={tx._id} className="p-4 flex items-center justify-between hover:bg-muted/40 transition-all duration-200 group">
                        <div className="flex flex-col gap-1">
                          <span className="font-semibold text-sm flex items-center gap-2">
                            {tx.type === "deposit" ? (
                              <PlusCircle className="h-3.5 w-3.5 text-emerald-500" />
                            ) : (
                              <ArrowDownToLine className="h-3.5 w-3.5 text-blue-500" />
                            )}
                            {tx.type === "deposit" ? "Dépôt" : "Retrait"} - {tx.amount.toLocaleString()} FCFA
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {format(tx.createdAt, "PPP 'à' p", { locale: fr })}
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <button 
                            onClick={() => copyId(tx.accountId)}
                            className="hidden sm:flex items-center gap-1 text-[10px] font-mono text-muted-foreground hover:text-primary transition-colors bg-muted px-2 py-0.5 rounded opacity-0 group-hover:opacity-100"
                          >
                            <Copy className="h-3 w-3" /> {tx.accountId.slice(0, 8)}...
                          </button>
                          {getStatusBadge(tx.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-20 text-center space-y-4">
                    <div className="bg-muted w-12 h-12 rounded-full flex items-center justify-center mx-auto">
                      <History className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="text-muted-foreground max-w-xs mx-auto">
                      <p className="font-medium text-foreground">Aucune transaction</p>
                      <p className="text-sm">Vos futures recharges et retraits apparaîtront ici en temps réel.</p>
                    </div>
                    <Button asChild variant="outline" size="sm">
                      <Link to="/deposit">Faire un premier dépôt</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </Authenticated>
        <Unauthenticated>
          <div className="max-w-md mx-auto mt-12">
            <Card className="shadow-2xl border-0 ring-1 ring-border">
              <CardHeader className="text-center pb-2">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                   <PlusCircle className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-2xl font-bold">Connexion DemoBet</CardTitle>
                <CardDescription>Accédez à votre compte de recharge sécurisé</CardDescription>
              </CardHeader>
              <CardContent>
                <SignInForm />
              </CardContent>
            </Card>
            <p className="text-center text-[10px] text-muted-foreground mt-8 uppercase tracking-widest font-bold">
              Sécurisé par DemoBet Intermediary
            </p>
          </div>
        </Unauthenticated>
      </div>
    </div>
  );
}