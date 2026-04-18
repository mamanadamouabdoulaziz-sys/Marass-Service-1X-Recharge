import React from 'react';
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Authenticated, Unauthenticated } from "convex/react";
import { SignInForm } from "../components/SignInForm";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { PlusCircle, ArrowDownToLine, History, Wallet, User } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
export function HomePage() {
  const transactions = useQuery(api.transactions.getUserTransactions) ?? [];
  const user = useQuery(api.auth.loggedInUser);
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved": return <Badge className="bg-emerald-500 hover:bg-emerald-600">Approuvé</Badge>;
      case "rejected": return <Badge variant="destructive">Rejeté</Badge>;
      default: return <Badge variant="secondary" className="bg-amber-100 text-amber-700 hover:bg-amber-100">En attente</Badge>;
    }
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
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                <Link to="/deposit"><PlusCircle className="mr-2 h-5 w-5" /> Dépôt</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/withdraw"><ArrowDownToLine className="mr-2 h-5 w-5" /> Retrait</Link>
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="shadow-sm border-2">
              <CardHeader className="pb-2">
                <CardDescription className="uppercase font-semibold text-2xs tracking-wider">Solde Démo</CardDescription>
                <CardTitle className="text-3xl font-bold flex items-center gap-2">
                  <Wallet className="h-6 w-6 text-primary" /> 50,000 FCFA
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground italic">*Ceci est un solde fictif pour démonstration.*</p>
              </CardContent>
            </Card>
          </div>
          <Card className="shadow-md border-0 ring-1 ring-border">
            <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/30">
              <div>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <History className="h-5 w-5 text-muted-foreground" /> Activité Récente
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {transactions.length > 0 ? (
                <div className="divide-y overflow-hidden rounded-b-xl">
                  {transactions.map((tx) => (
                    <div key={tx._id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                      <div className="flex flex-col gap-1">
                        <span className="font-semibold text-sm">
                          {tx.type === "deposit" ? "Dépôt" : "Retrait"} - {tx.amount.toLocaleString()} FCFA
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {format(tx.createdAt, "PPP 'à' p", { locale: fr })}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="hidden sm:inline text-xs font-mono text-muted-foreground">ID: {tx.accountId.slice(0, 8)}...</span>
                        {getStatusBadge(tx.status)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-16 text-center text-muted-foreground">
                  Aucune transaction trouvée. Commencez par un dépôt !
                </div>
              )}
            </CardContent>
          </Card>
        </Authenticated>
        <Unauthenticated>
          <div className="max-w-md mx-auto mt-12">
            <Card className="shadow-2xl">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">Connexion DemoBet</CardTitle>
                <CardDescription>Accédez à votre compte de recharge sécurisé</CardDescription>
              </CardHeader>
              <CardContent>
                <SignInForm />
              </CardContent>
            </Card>
          </div>
        </Unauthenticated>
      </div>
    </div>
  );
}