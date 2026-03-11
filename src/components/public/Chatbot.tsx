"use client";

import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, ChevronRight, Minimize2, Send } from "lucide-react";
import styles from "./chatbot.module.css";

type Message = {
  id: string;
  type: "user" | "bot";
  text: string;
};

const predefinedQuestions = [
  {
    id: "q1",
    question: "Qu'est-ce que le SDM virtuel ?",
    answer:
      "Le Salon des leaders BTP au Maroc (SDM) virtuel est une plateforme interactive vous permettant de découvrir les promoteurs, leurs projets, et d'interagir avec les acteurs du secteur du bâtiment dans un environnement 360° immersif.",
  },
  {
    id: "q2",
    question: "Comment naviguer dans l'exposition ?",
    answer:
      "L'exposition est en 3D 360°. Utilisez votre souris pour faire pivoter la vue et cliquez sur les marqueurs interactifs (hotspots) pour explorer les stands, visionner des vidéos ou consulter les détails des projets.",
  },
  {
    id: "q3",
    question: "Comment contacter un exposant ?",
    answer:
      "Une fois sur le stand virtuel d'un exposant, vous trouverez des boutons de contact (email, téléphone, WhatsApp) et des liens directs vers leurs réseaux sociaux ou leurs brochures.",
  },
  {
    id: "q4",
    question: "Comment contacter l'assistance ?",
    answer:
      "Vous pouvez nous envoyer un message via la page 'Contact' accessible depuis le menu principal en haut, ou nous écrire directement à support@sdm-virtuel.ma.",
  },
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      type: "bot",
      text: "Bonjour ! 👋 Bienvenue sur le SDM Virtuel. Comment puis-je vous aider aujourd'hui ?",
    },
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleQuestionClick = (q: typeof predefinedQuestions[0]) => {
    // Add user question
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      type: "user",
      text: q.question,
    };
    
    setMessages((prev) => [...prev, userMsg]);

    // Simulate slight delay for bot answer to feel more natural
    setTimeout(() => {
      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        type: "bot",
        text: q.answer,
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 500);
  };

  return (
    <div className={styles.chatbotContainer}>
      {/* Floating Action Button */}
      <button
        className={`${styles.fab} ${isOpen ? styles.fabHidden : "animate-fade-in-up delay-500"}`}
        onClick={() => setIsOpen(true)}
        aria-label="Ouvrir le chat assistant"
      >
        <MessageCircle className={styles.fabIcon} size={28} />
        <span className={styles.notificationBadge}></span>
      </button>

      {/* Chat Window */}
      <div className={`${styles.chatWindow} ${isOpen ? styles.chatWindowOpen : ""}`}>
        {/* Header */}
        <div className={styles.chatHeader}>
          <div className={styles.chatHeaderInfo}>
            <div className={styles.botAvatar}>
              <MessageCircle size={20} />
            </div>
            <div>
              <h3 className={styles.chatTitle}>SDM Assistant</h3>
              <span className={styles.chatStatus}>En ligne</span>
            </div>
          </div>
          <button
            className={styles.closeButton}
            onClick={() => setIsOpen(false)}
            aria-label="Réduire le chat"
          >
            <X size={20} />
          </button>
        </div>

        {/* Message Area */}
        <div className={styles.chatMessages}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`${styles.messageWrapper} ${
                msg.type === "user" ? styles.messageWrapperUser : styles.messageWrapperBot
              }`}
            >
              <div
                className={`${styles.messageBubble} ${
                  msg.type === "user" ? styles.messageUser : styles.messageBot
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          
          {/* Predefined Options List (only show if last message was bot or to always prompt) */}
          <div className={styles.optionsContainer}>
            <p className={styles.optionsTitle}>Questions fréquentes :</p>
            <div className={styles.optionsList}>
              {predefinedQuestions.map((q) => (
                <button
                  key={q.id}
                  className={styles.optionButton}
                  onClick={() => handleQuestionClick(q)}
                >
                  <span>{q.question}</span>
                  <ChevronRight size={16} className={styles.optionIcon} />
                </button>
              ))}
            </div>
          </div>
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  );
}
