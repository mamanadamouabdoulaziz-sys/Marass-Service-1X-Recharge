import React from 'react';
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { PlusCircle, ArrowDownToLine, History, Copy, Zap, MessageCircle, CheckCircle2, ChevronRight } from "lucide-react";
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
        return <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 px-3 py-1 font-black uppercase text-[10px] tracking-widest shadow-[0_0_10px_rgba(16,185,129,0.1)]">Approuvé</Badge>;
      case "rejected":
        return <Badge variant="destructive" className="px-3 py-1 font-black uppercase text-[10px] tracking-widest shadow-lg shadow-destructive/20">Rejeté</Badge>;
      default:
        return (
          <div className="flex flex-col items-end gap-1.5">
            <Badge className="bg-primary/10 text-primary border-primary/30 px-3 py-1 font-black uppercase text-[10px] tracking-widest animate-pulse border-dashed">En attente</Badge>
            <span className="text-[8px] font-black text-emerald-400 uppercase tracking-tighter flex items-center gap-1 bg-emerald-500/5 px-2 py-0.5 rounded-sm border border-emerald-500/10 transition-colors hover:bg-emerald-500/10">
              <CheckCircle2 className="h-2 w-2" /> Transmission WhatsApp
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
      <div className="py-6 md:py-10 lg:py-12 space-y-8 md:space-y-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-10"
        >
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.3em] text-[10px] sm:text-xs">
              <Zap className="h-3 w-3 fill-current animate-pulse" /> Système Navy Elite v3
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter text-white uppercase italic leading-[0.9] drop-shadow-2xl">Dashboard</h1>
            <p className="text-muted-foreground/60 flex items-center gap-3 text-xs sm:text-sm font-bold uppercase tracking-widest">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {user?.email ?? "Session Active"}
            </p>
          </div>
          <div className="flex flex-wrap gap-3 sm:gap-4">
            <Button asChild size="lg" className="btn-orange px-8 h-12 sm:h-14 rounded-2xl flex-1 sm:flex-none">
              <Link to="/deposit"><PlusCircle className="mr-2 h-5 w-5" /> DÉPÔT</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="bg-white/5 border-white/10 hover:bg-white/10 text-white font-black h-12 sm:h-14 px-8 rounded-2xl flex-1 sm:flex-none uppercase tracking-widest">
              <Link to="/withdraw"><ArrowDownToLine className="mr-2 h-5 w-5" /> RETRAIT</Link>
            </Button>
          </div>
        </motion.div>
        <div className="grid grid-cols-1 gap-8">
          <Card className="glass-dark border-white/10 overflow-hidden shadow-2xl rounded-[2rem] navy-glow">
            <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 bg-white/[0.02] px-6 sm:px-10 py-6 sm:py-8">
              <CardTitle className="text-base sm:text-lg font-black uppercase tracking-tight flex items-center gap-4 text-white">
                <div className="p-2.5 bg-primary/10 rounded-xl border border-primary/20">
                  <History className="h-5 w-5 text-primary" />
                </div>
                Historique Elite
              </CardTitle>
              <div className="hidden sm:flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-primary bg-primary/5 px-5 py-2.5 rounded-full border border-primary/10">
                <div className="h-2 w-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(234,88,12,1)]" />
                Protocole Actif
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {transactions.length > 0 ? (
                <div className="divide-y divide-white/5">
                  {transactions.map((tx, idx) => (
                    <motion.div
                      key={tx._id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.04 }}
                      className="px-6 sm:px-10 py-6 sm:py-8 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-white/[0.04] transition-all duration-300 group gap-5 cursor-default"
                    >
                      <div className="flex flex-col gap-2.5">
                        <div className="flex items-center gap-3">
                          <div className={`p-1.5 rounded-lg ${tx.type === 'deposit' ? 'bg-primary/10' : 'bg-blue-500/10'}`}>
                            {tx.type === "deposit" ? (
                              <PlusCircle className="h-4 w-4 text-primary" />
                            ) : (
                              <ArrowDownToLine className="h-4 w-4 text-blue-400" />
                            )}
                          </div>
                          <span className="font-black text-lg sm:text-xl text-white tracking-tight flex items-center gap-2">
                            {tx.type === "deposit" ? "DÉPÔT" : "RETRAIT"} 
                            <span className="text-muted-foreground/30 font-thin">|</span> 
                            <span className={tx.type === 'deposit' ? 'text-primary' : 'text-blue-400'}>
                              {tx.amount.toLocaleString()} <span className="text-[10px] sm:text-xs">FCFA</span>
                            </span>
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-[0.2em] flex items-center gap-2">
                          {format(tx.createdAt, "PPP 'à' HH:mm", { locale: fr })}
                        </span>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-6 sm:gap-10">
                        <button
                          onClick={() => copyId(tx.accountId)}
                          className="hidden lg:flex items-center gap-2 text-[9px] font-black tracking-[0.2em] text-muted-foreground/40 hover:text-white transition-all bg-white/5 px-4 py-2 rounded-xl border border-white/5 hover:border-white/10 group/btn"
                        >
                          <Copy className="h-3 w-3 group-hover/btn:scale-110 transition-transform" /> {tx.accountId.slice(0, 12)}...
                        </button>
                        <div className="flex items-center gap-4">
                          {getStatusBadge(tx.status)}
                          <ChevronRight className="h-4 w-4 text-white/10 group-hover:translate-x-1 group-hover:text-white/30 transition-all" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="py-24 sm:py-32 text-center space-y-10 px-6 bg-gradient-to-b from-[#1e3a8a]/5 to-transparent">
                  <div className="relative mx-auto w-28 h-28">
                    <div className="absolute inset-0 bg-primary/10 rounded-[2rem] blur-3xl animate-pulse" />
                    <div className="relative bg-white/[0.03] w-28 h-28 rounded-[2rem] flex items-center justify-center border border-white/10 shadow-inner">
                      <Zap className="h-12 w-12 text-primary/30" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-black text-2xl sm:text-4xl text-white uppercase tracking-tighter italic leading-none">Aucune Activité</h3>
                    <p className="text-sm text-muted-foreground max-w-sm mx-auto font-medium leading-relaxed">Initiez votre premier transfert via le protocole Navy Elite pour voir vos transactions apparaître ici.</p>
                  </div>
                  <Button asChild size="lg" className="btn-orange h-14 sm:h-16 px-10 rounded-2xl text-lg group">
                    <Link to="/deposit">
                      DÉBUTER LE PROTOCOLE 
                      <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
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