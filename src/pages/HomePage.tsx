import React from 'react';
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { PlusCircle, ArrowDownToLine, History, Copy, Zap, ShieldCheck, CheckCircle2, ChevronRight } from "lucide-react";
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
        return (
          <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 px-3 py-1 font-black uppercase text-[10px] tracking-widest shadow-[0_0_15px_rgba(16,185,129,0.1)]">
            Approuvé
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="destructive" className="px-3 py-1 font-black uppercase text-[10px] tracking-widest shadow-lg shadow-destructive/20">
            Rejeté
          </Badge>
        );
      default:
        return (
          <div className="flex flex-col items-end gap-1.5">
            <Badge className="bg-primary/10 text-primary border-primary/30 px-3 py-1 font-black uppercase text-[10px] tracking-widest animate-pulse border-dashed">
              En attente
            </Badge>
            <span className="text-[8px] font-black text-emerald-400 uppercase tracking-tighter flex items-center gap-1 bg-emerald-500/5 px-2.5 py-1 rounded-md border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.15)] transition-all hover:bg-emerald-500/10">
              <ShieldCheck className="h-2.5 w-2.5 fill-emerald-400/20" /> WhatsApp Vérifié
            </span>
          </div>
        );
    }
  };
  const copyId = (id: string) => {
    if ("vibrate" in navigator) navigator.vibrate(30);
    navigator.clipboard.writeText(id);
    toast.success("Référence copiée !");
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12 space-y-10 md:space-y-14">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-8 md:gap-12"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.3em] text-[10px] sm:text-xs">
              <div className="h-1 w-8 bg-primary/30 rounded-full" />
              <Zap className="h-3.3 w-3.3 fill-current animate-pulse" /> Système Navy Elite v3.5
            </div>
            <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter text-white uppercase italic leading-[0.8] drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
              BIENVENUE
            </h1>
            <p className="text-muted-foreground/60 flex items-center gap-3 text-xs sm:text-sm font-bold uppercase tracking-widest bg-white/5 w-fit px-4 py-1.5 rounded-full border border-white/5 backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {user?.email ?? "Session Sécurisée"}
            </p>
          </div>
          <div className="flex flex-wrap gap-3 sm:gap-4">
            <Button asChild size="lg" className="btn-orange px-10 h-14 sm:h-16 rounded-2xl flex-1 sm:flex-none shadow-orange-900/40">
              <Link to="/deposit"><PlusCircle className="mr-2 h-6 w-6" /> DÉPÔT</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="bg-white/5 border-white/10 hover:bg-white/10 text-white font-black h-14 sm:h-16 px-10 rounded-2xl flex-1 sm:flex-none uppercase tracking-widest backdrop-blur-md">
              <Link to="/withdraw"><ArrowDownToLine className="mr-2 h-6 w-6" /> RETRAIT</Link>
            </Button>
          </div>
        </motion.div>
        <div className="grid grid-cols-1 gap-10">
          <Card className="glass-dark border-white/10 overflow-hidden shadow-[0_40px_80px_-15px_rgba(0,0,0,0.7)] rounded-[2.5rem] navy-glow">
            <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 bg-white/[0.03] px-6 sm:px-12 py-8 sm:py-10">
              <CardTitle className="text-lg sm:text-xl font-black uppercase tracking-tight flex items-center gap-5 text-white">
                <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20 shadow-inner">
                  <History className="h-6 w-6 text-primary" />
                </div>
                Historique Elite
              </CardTitle>
              <div className="hidden sm:flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-primary bg-primary/5 px-6 py-3 rounded-full border border-primary/10 shadow-lg backdrop-blur-md">
                <div className="h-2 w-2 rounded-full bg-primary animate-pulse shadow-[0_0_12px_rgba(234,88,12,1)]" />
                Protocole Actif
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
                      transition={{ delay: idx * 0.05, ease: "easeOut" }}
                      className="px-6 sm:px-12 py-8 sm:py-10 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-white/[0.04] transition-all duration-300 group gap-6 cursor-default relative overflow-hidden"
                    >
                      <div className="flex flex-col gap-3 relative z-10">
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-xl transition-colors ${tx.type === 'deposit' ? 'bg-primary/10 group-hover:bg-primary/20' : 'bg-blue-500/10 group-hover:bg-blue-500/20'}`}>
                            {tx.type === "deposit" ? (
                              <PlusCircle className="h-5 w-5 text-primary" />
                            ) : (
                              <ArrowDownToLine className="h-5 w-5 text-blue-400" />
                            )}
                          </div>
                          <span className="font-black text-xl sm:text-2xl text-white tracking-tighter flex items-center gap-3 italic">
                            {tx.type === "deposit" ? "DÉPÔT" : "RETRAIT"}
                            <span className="text-muted-foreground/20 font-thin not-italic">/</span>
                            <span className={tx.type === 'deposit' ? 'text-primary' : 'text-blue-400'}>
                              {tx.amount.toLocaleString()} <span className="text-[10px] sm:text-xs font-black opacity-60">FCFA</span>
                            </span>
                          </span>
                        </div>
                        <span className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.3em] flex items-center gap-3 ml-12">
                          <div className="h-[1px] w-4 bg-muted-foreground/20" />
                          {format(tx.createdAt, "PPP 'à' HH:mm", { locale: fr })}
                        </span>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-6 sm:gap-12 relative z-10 ml-12 sm:ml-0">
                        <button
                          onClick={() => copyId(tx.accountId)}
                          className="hidden lg:flex items-center gap-3 text-[10px] font-black tracking-[0.2em] text-muted-foreground/30 hover:text-white transition-all bg-white/5 px-5 py-2.5 rounded-xl border border-white/5 hover:border-white/10 group/btn shadow-sm"
                        >
                          <Copy className="h-3.5 w-3.5 group-hover/btn:scale-110 transition-transform text-primary/40" /> {tx.accountId.slice(0, 14)}...
                        </button>
                        <div className="flex items-center gap-6">
                          {getStatusBadge(tx.status)}
                          <ChevronRight className="h-5 w-5 text-white/10 group-hover:translate-x-1 group-hover:text-white/40 transition-all" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="py-28 sm:py-36 text-center space-y-12 px-8 bg-gradient-to-b from-white/[0.02] to-transparent">
                  <div className="relative mx-auto w-32 h-32">
                    <div className="absolute inset-0 bg-primary/20 rounded-[2.5rem] blur-3xl animate-pulse" />
                    <div className="relative bg-white/[0.03] w-32 h-32 rounded-[2.5rem] flex items-center justify-center border border-white/10 shadow-2xl backdrop-blur-sm">
                      <Zap className="h-14 w-14 text-primary/30" />
                    </div>
                  </div>
                  <div className="space-y-5">
                    <h3 className="font-black text-3xl sm:text-5xl text-white uppercase tracking-tighter italic leading-none drop-shadow-lg">Aucune Activité</h3>
                    <p className="text-sm sm:text-base text-muted-foreground/60 max-w-sm mx-auto font-bold uppercase tracking-widest leading-relaxed">
                      Initiez votre premier transfert via le protocole Navy Elite pour débloquer votre historique.
                    </p>
                  </div>
                  <Button asChild size="lg" className="btn-orange h-16 sm:h-20 px-12 rounded-[1.5rem] text-xl group shadow-2xl">
                    <Link to="/deposit">
                      DÉBUTER LE PROTOCOLE
                      <ChevronRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform" />
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