/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, User, ChevronRight, Activity, X, ShieldCheck, ArrowLeft } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Translation } from '../translations';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type AuthMode = 'login' | 'signup' | 'forgot';

interface AuthScreenProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  isDarkMode?: boolean;
  t: Translation;
}

export default function AuthScreen({ isOpen, onClose, onSuccess, isDarkMode, t }: AuthScreenProps) {
  const [mode, setMode] = useState<AuthMode>('login');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Mock authentication delay
    setTimeout(() => {
      setIsLoading(false);
      onSuccess();
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[2000] flex items-center justify-center p-4 sm:p-6"
      >
        <div 
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" 
          onClick={onClose}
        />
        
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          className={cn(
            "w-full max-w-md rounded-[2.5rem] natural-shadow overflow-hidden relative border",
            isDarkMode ? "bg-dark-surface border-dark-border text-dark-text" : "bg-white border-medical-border text-medical-text"
          )}
        >
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full hover:bg-black/5 transition-colors z-10"
          >
            <X size={20} className="text-medical-accent" />
          </button>

          <div className="p-8 sm:p-10">
            {/* Header */}
            <div className="mb-8 flex flex-col items-center text-center">
              <div className="bg-medical-primary p-3 rounded-2xl text-white natural-shadow mb-4">
                <Activity size={32} />
              </div>
              <h2 className="text-2xl font-black tracking-tight mb-2">
                {mode === 'login' && t.welcomeBack}
                {mode === 'signup' && t.createAccount}
                {mode === 'forgot' && t.resetPassword}
              </h2>
              <p className="text-sm text-medical-accent font-medium">
                {mode === 'login' && 'Login to access your saved healthcare pulse.'}
                {mode === 'signup' && 'Join HealthPulse to track your medical locations.'}
                {mode === 'forgot' && 'Enter your email to receive a reset link.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-medical-accent group-focus-within:text-medical-primary transition-colors" size={18} />
                  <input 
                    type="text" 
                    placeholder={t.fullNamePlaceholder}
                    required
                    className={cn(
                      "w-full pl-12 pr-4 py-4 rounded-2xl border outline-none transition-all focus:ring-2 focus:ring-medical-primary",
                      isDarkMode ? "bg-dark-bg border-dark-border text-dark-text" : "bg-medical-surface border-medical-border text-medical-text"
                    )}
                  />
                </div>
              )}

              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-medical-accent group-focus-within:text-medical-primary transition-colors" size={18} />
                <input 
                  type="email" 
                  placeholder={t.emailPlaceholder}
                  required
                  className={cn(
                    "w-full pl-12 pr-4 py-4 rounded-2xl border outline-none transition-all focus:ring-2 focus:ring-medical-primary",
                    isDarkMode ? "bg-dark-bg border-dark-border text-dark-text" : "bg-medical-surface border-medical-border text-medical-text"
                  )}
                />
              </div>

              {mode !== 'forgot' && (
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-medical-accent group-focus-within:text-medical-primary transition-colors" size={18} />
                  <input 
                    type="password" 
                    placeholder={t.passwordPlaceholder}
                    required
                    className={cn(
                      "w-full pl-12 pr-4 py-4 rounded-2xl border outline-none transition-all focus:ring-2 focus:ring-medical-primary",
                      isDarkMode ? "bg-dark-bg border-dark-border text-dark-text" : "bg-medical-surface border-medical-border text-medical-text"
                    )}
                  />
                </div>
              )}

              {mode === 'login' && (
                <div className="flex justify-end">
                  <button 
                    type="button" 
                    onClick={() => setMode('forgot')}
                    className="text-xs font-bold text-medical-primary hover:underline"
                  >
                    {t.forgotPassword}
                  </button>
                </div>
              )}

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-medical-primary text-white rounded-2xl font-bold natural-shadow hover:bg-[#5A7A50] transition-all active:scale-[0.98] mt-4 flex items-center justify-center gap-2 group disabled:opacity-70"
              >
                {isLoading ? (
                  <Activity className="animate-spin" size={20} />
                ) : (
                  <>
                    {mode === 'login' && t.login}
                    {mode === 'signup' && t.signup}
                    {mode === 'forgot' && 'Send Reset Link'}
                    <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Footer Options */}
            <div className="mt-8 pt-6 border-t border-medical-border/50 text-center">
              {mode === 'login' && (
                <p className="text-sm font-medium">
                  Don't have an account? {' '}
                  <button 
                    onClick={() => setMode('signup')}
                    className="text-medical-primary font-bold hover:underline"
                  >
                    {t.signup}
                  </button>
                </p>
              )}
              {(mode === 'signup' || mode === 'forgot') && (
                <button 
                  onClick={() => setMode('login')}
                  className="text-medical-primary font-bold text-sm flex items-center justify-center gap-2 hover:underline mx-auto"
                >
                  <ArrowLeft size={14} />
                  Back to Login
                </button>
              )}
            </div>

            <div className="mt-6 flex justify-center items-center gap-2 text-[10px] text-medical-accent font-bold uppercase tracking-wider">
              <ShieldCheck size={14} />
              Secure Data Guaranteed
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
