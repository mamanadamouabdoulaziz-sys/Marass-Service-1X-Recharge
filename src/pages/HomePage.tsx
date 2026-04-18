import React from 'react';
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Authenticated, Unauthenticated } from "convex/react";
import { SignInForm } from "../components/SignInForm";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { PlusCircle, ArrowDownToLine, History, User, Copy, ShieldCheck } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";
export function HomePage() {
  const transactions = useQuery(api.transactions.getUserTransactions) ?? [];
  const user = useQuery(api.auth.loggedInUser);
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved": return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 px-3 py-1 font-bold">Approuvé</Badge>;
      case "rejected": return <Badge variant="destructive" className="px-3 py-1 font-bold">Rejeté</Badge>;
      default: return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 px-3 py-1 font-bold">En attente</Badge>;
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
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-8">
            <div className="space-y-1">
              <h1 className="text-4xl font-black tracking-tighter text-white uppercase">Tableau de bord</h1>
              <p className="text-muted-foreground flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-primary" /> {user?.email}
              </p>
            </div>
            <div className="flex gap-4">
              <Button asChild size="lg" className="btn-gradient">
                <Link to="/deposit"><PlusCircle className="mr-2 h-5 w-5" /> Dépôt</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="bg-white/5 border-white/10 hover:bg-white/10 text-white">
                <Link to="/withdraw"><ArrowDownToLine className="mr-2 h-5 w-5" /> Retrait</Link>
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-8">
            <Card className="glass-dark border-white/10 overflow-hidden shadow-2xl">
              <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 bg-white/5 px-6 py-5">
                <div>
                  <CardTitle className="text-lg font-bold flex items-center gap-3 text-white">
                    <History className="h-5 w-5 text-primary" /> Activité Récente
                  </CardTitle>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  Live Support
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {transactions.length > 0 ? (
                  <div className="divide-y divide-white/5">
                    {transactions.map((tx) => (
                      <div key={tx._id} className="p-6 flex items-center justify-between hover:bg-white/[0.02] transition-all duration-300 group">
                        <div className="flex flex-col gap-2">
                          <span className="font-bold text-base flex items-center gap-3 text-white">
                            {tx.type === "deposit" ? (
                              <PlusCircle className="h-4 w-4 text-emerald-500" />
                            ) : (
                              <ArrowDownToLine className="h-4 w-4 text-primary" />
                            )}
                            {tx.type === "deposit" ? "Dépôt" : "Retrait"} - <span className={tx.type === 'deposit' ? 'text-emerald-500' : 'text-primary'}>{tx.amount.toLocaleString()} FCFA</span>
                          </span>
                          <span className="text-xs font-medium text-muted-foreground">
                            {format(tx.createdAt, "PPP 'à' p", { locale: fr })}
                          </span>
                        </div>
                        <div className="flex items-center gap-6">
                          <button
                            onClick={() => copyId(tx.accountId)}
                            className="hidden sm:flex items-center gap-2 text-[10px] font-black tracking-widest text-muted-foreground hover:text-white transition-all bg-white/5 px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100"
                          >
                            <Copy className="h-3 w-3" /> {tx.accountId.slice(0, 12)}
                          </button>
                          {getStatusBadge(tx.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-24 text-center space-y-6">
                    <div className="bg-white/5 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto border border-white/10">
                      <History className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div className="space-y-2">
                      <p className="font-black text-xl text-white uppercase tracking-tighter">Aucune transaction</p>
                      <p className="text-sm text-muted-foreground max-w-xs mx-auto">Vos futures recharges et retraits apparaîtront ici instantanément.</p>
                    </div>
                    <Button asChild variant="outline" className="border-white/10 hover:bg-white/5">
                      <Link to="/deposit">Lancer un premier dépôt</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </Authenticated>
        <Unauthenticated>
          <div className="max-w-md mx-auto mt-20">
            <Card className="glass-dark border-white/10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-primary" />
              <CardHeader className="text-center pb-6 pt-10">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 border border-primary/20 shadow-inner">
                   <ShieldCheck className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-3xl font-black text-white uppercase tracking-tighter">Connexion</CardTitle>
                <CardDescription className="text-muted-foreground font-medium">Portail de Recharge Sécurisé DemoBet</CardDescription>
              </CardHeader>
              <CardContent className="pb-10">
                <SignInForm />
              </CardContent>
            </Card>
            <div className="text-center space-y-2 mt-12 opacity-40">
              <p className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.3em]">
                DemoBet Intermediary
              </p>
              <p className="text-[9px] text-muted-foreground font-bold italic underline">Elite Financial Protection Tier 4</p>
            </div>
          </div>
        </Unauthenticated>
      </div>
    </div>
  );
}