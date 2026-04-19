import React from 'react';
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { PlusCircle, ArrowDownToLine, History, Copy, Zap, MessageCircle, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";
import { motion } from "framer-motion";
export function HomePage() {
  const transactions = useQuery(api.transactions.getUserTransactions) ?? [];
  const user = useQuery(api.auth.loggedInUser);
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 px-3 py-1 font-black uppercase text-[10px] tracking-widest">Approuvé</Badge>;
      case "rejected":
        return <Badge variant="destructive" className="px-3 py-1 font-black uppercase text-[10px] tracking-widest shadow-lg shadow-destructive/20">Rejeté</Badge>;
      default:
        return (
          <div className="flex flex-col items-end gap-1">
            <Badge className="bg-primary/10 text-primary border-primary/30 px-3 py-1 font-black uppercase text-[10px] tracking-widest animate-pulse">En attente</Badge>
            <span className="text-[8px] font-black text-emerald-400 uppercase tracking-tighter flex items-center gap-1 bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10">
              <CheckCircle2 className="h-2 w-2" /> WhatsApp Envoyé
            </span>
          </div>
        );
    }
  };
  const copyId = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("Référence copiée !");
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12 space-y-10 scroll-mt-[80px]">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-10"
        >
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.3em] text-xs">
              <Zap className="h-3 w-3 fill-current" /> Système Navy Elite
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-white uppercase italic leading-none drop-shadow-2xl">Tableau de Bord</h1>
            <p className="text-muted-foreground flex items-center gap-3 text-sm font-medium">
              <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_rgba(234,88,12,0.5)]" />
              {user?.email ?? "Chargement..."}
            </p>
          </div>
          <div className="flex gap-4">
            <Button asChild size="lg" className="btn-orange px-8">
              <Link to="/deposit"><PlusCircle className="mr-2 h-5 w-5" /> DÉPÔT</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="bg-[#1e3a8a]/20 border-white/10 hover:bg-[#1e3a8a]/40 text-white font-bold h-12 rounded-xl">
              <Link to="/withdraw"><ArrowDownToLine className="mr-2 h-5 w-5" /> RETRAIT</Link>
            </Button>
          </div>
        </motion.div>
        <div className="grid grid-cols-1 gap-8">
          <Card className="glass-dark border-white/10 overflow-hidden shadow-2xl rounded-3xl navy-glow">
            <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 bg-white/[0.03] px-6 sm:px-8 py-6">
              <CardTitle className="text-lg font-black uppercase tracking-tight flex items-center gap-4 text-white">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <History className="h-5 w-5 text-primary" />
                </div>
                Historique Récent
              </CardTitle>
              <div className="hidden sm:flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-4 py-2 rounded-full border border-primary/20">
                <div className="h-2 w-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(234,88,12,0.8)]" />
                Validation WhatsApp Active
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {transactions.length > 0 ? (
                <div className="divide-y divide-white/5">
                  {transactions.map((tx, idx) => (
                    <motion.div 
                      key={tx._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="px-6 sm:px-8 py-6 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-white/[0.03] transition-all duration-300 group gap-4"
                    >
                      <div className="flex flex-col gap-2">
                        <span className="font-black text-lg flex items-center gap-3 text-white tracking-tight">
                          {tx.type === "deposit" ? (
                            <PlusCircle className="h-4 w-4 text-primary" />
                          ) : (
                            <ArrowDownToLine className="h-4 w-4 text-blue-400" />
                          )}
                          {tx.type === "deposit" ? "DÉPÔT" : "RETRAIT"} <span className="text-muted-foreground font-normal mx-1">/</span> <span className={tx.type === 'deposit' ? 'text-primary' : 'text-blue-400'}>{tx.amount.toLocaleString()} FCFA</span>
                        </span>
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                          {format(tx.createdAt, "PPP 'à' p", { locale: fr })}
                        </span>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-8">
                        {tx.status === 'pending' && (
                          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 bg-primary/5 rounded-lg border border-primary/10 text-[9px] font-black text-primary uppercase">
                            <CheckCircle2 className="h-3 w-3" /> Transmis
                          </div>
                        )}
                        <button
                          onClick={() => copyId(tx.accountId)}
                          className="hidden md:flex items-center gap-2 text-[10px] font-black tracking-widest text-muted-foreground hover:text-white transition-all bg-white/5 px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 border border-white/5"
                        >
                          <Copy className="h-3 w-3" /> {tx.accountId.slice(0, 16)}
                        </button>
                        {getStatusBadge(tx.status)}
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="py-32 text-center space-y-8 px-4 bg-gradient-to-b from-[#1e3a8a]/10 to-transparent">
                  <div className="relative mx-auto w-24 h-24">
                    <div className="absolute inset-0 bg-primary/20 rounded-3xl blur-2xl animate-pulse" />
                    <div className="relative bg-white/5 w-24 h-24 rounded-3xl flex items-center justify-center border border-white/10 shadow-2xl">
                      <MessageCircle className="h-10 w-10 text-muted-foreground/40" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <p className="font-black text-2xl sm:text-3xl text-white uppercase tracking-tighter italic">Protocole Navy Elite</p>
                    <p className="text-sm text-muted-foreground max-w-sm mx-auto font-medium">Toutes vos demandes sont sécurisées et transmises automatiquement pour validation immédiate.</p>
                  </div>
                  <Button asChild size="lg" variant="outline" className="border-white/10 hover:bg-white/5 text-white font-bold h-14 px-8 rounded-xl">
                    <Link to="/deposit">COMMENCER L'AVENTURE</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}