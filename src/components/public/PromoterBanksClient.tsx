"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import BankContactModal from "./BankContactModal";

interface Bank {
    id: string;
    nom: string;
    logo: string | null;
    contact: string | null;
}

interface PromoterBanksClientProps {
    banks: Bank[];
    promoterName: string;
}

export default function PromoterBanksClient({ banks, promoterName }: PromoterBanksClientProps) {
    const [selectedBank, setSelectedBank] = useState<Bank | null>(null);

    return (
        <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
                {banks.map((bank) => (
                    <div 
                        key={bank.id} 
                        style={{ 
                            background: "rgba(255, 255, 255, 0.03)", 
                            border: "1px solid rgba(255, 255, 255, 0.1)", 
                            padding: "1.25rem", 
                            borderRadius: "12px",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            transition: "all 0.3s ease"
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
                            {bank.logo ? (
                                <img src={bank.logo} alt={bank.nom} style={{ width: "40px", height: "40px", objectFit: "contain", borderRadius: "8px", background: "white", padding: "4px" }} />
                            ) : (
                                <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: "rgba(59, 232, 176, 0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-primary)", fontWeight: "bold" }}>
                                    {bank.nom.charAt(0)}
                                </div>
                            )}
                            <div>
                                <h3 style={{ fontSize: "1rem", color: "var(--color-primary)", marginBottom: "0.25rem" }}>
                                    {bank.nom}
                                </h3>
                                <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>Taux préférentiels</p>
                            </div>
                        </div>
                        
                        {bank.contact && (
                            <button
                                onClick={() => setSelectedBank(bank)}
                                style={{ 
                                    padding: "0.6rem 1rem", 
                                    background: "rgba(59, 232, 176, 0.1)", 
                                    color: "var(--color-primary)", 
                                    border: "1px solid rgba(59, 232, 176, 0.3)",
                                    borderRadius: "6px",
                                    fontSize: "0.85rem",
                                    fontWeight: "600",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "0.5rem",
                                    transition: "all 0.2s ease",
                                    width: "100%"
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.background = "rgba(59, 232, 176, 0.2)";
                                    e.currentTarget.style.transform = "translateY(-1px)";
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.background = "rgba(59, 232, 176, 0.1)";
                                    e.currentTarget.style.transform = "none";
                                }}
                            >
                                Plus d'infos <ChevronRight size={14} />
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {selectedBank && (
                <BankContactModal
                    isOpen={!!selectedBank}
                    onClose={() => setSelectedBank(null)}
                    bankName={selectedBank.nom}
                    promoterName={promoterName}
                />
            )}
        </>
    );
}
