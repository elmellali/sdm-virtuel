"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./login.module.css";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (res?.error) {
            setError("Identifiants incorrects");
            setLoading(false);
        } else {
            router.push("/admin");
        }
    };

    return (
        <div className={styles.container}>
            <div className={`glass-panel ${styles.loginBox}`}>
                <h1 className="title-gradient">SDM virtuel Admin</h1>
                <p className={styles.subtitle}>Connectez-vous pour gérer la plateforme</p>

                {error && <div className={styles.error}>{error}</div>}

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className={styles.input}
                            placeholder="admin@sdm.ma"
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="password">Mot de passe</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className={styles.input}
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        className={styles.button}
                        disabled={loading}
                    >
                        {loading ? "Connexion..." : "Se connecter"}
                    </button>
                </form>
            </div>
        </div>
    );
}
