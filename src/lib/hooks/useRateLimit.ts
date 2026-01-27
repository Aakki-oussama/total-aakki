import { useState, useEffect, useCallback } from 'react';

interface RateLimitState {
    attempts: number;
    blockedUntil: number | null;
}

/**
 * HOOK: useRateLimit
 * Gère le blocage local des tentatives de connexion pour protéger contre le brute force.
 */
export function useRateLimit(key: string = 'auth_limit', maxAttempts: number = 5, blockDurationMinutes: number = 60) {
    const [state, setState] = useState<RateLimitState>(() => {
        const saved = localStorage.getItem(key);
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch {
                return { attempts: 0, blockedUntil: null };
            }
        }
        return { attempts: 0, blockedUntil: null };
    });

    const [isBlocked, setIsBlocked] = useState(false);
    const [timeLeft, setTimeLeft] = useState<number>(0);

    // Vérification du blocage en temps réel
    useEffect(() => {
        const checkStatus = () => {
            if (state.blockedUntil && Date.now() < state.blockedUntil) {
                setIsBlocked(true);
                setTimeLeft(Math.ceil((state.blockedUntil - Date.now()) / 1000));
            } else {
                if (isBlocked) {
                    setIsBlocked(false);
                    // On Reset les tentatives après la fin du blocage
                    const newState = { attempts: 0, blockedUntil: null };
                    setState(newState);
                    localStorage.setItem(key, JSON.stringify(newState));
                }
            }
        };

        checkStatus();
        const timer = setInterval(checkStatus, 1000);
        return () => clearInterval(timer);
    }, [state.blockedUntil, isBlocked, key]);

    const recordAttempt = useCallback(() => {
        setState(prev => {
            const newAttempts = prev.attempts + 1;
            let newState: RateLimitState;

            if (newAttempts >= maxAttempts) {
                // On bloque pour la durée spécifiée
                const blockedUntil = Date.now() + (blockDurationMinutes * 60 * 1000);
                newState = { attempts: newAttempts, blockedUntil };
            } else {
                newState = { ...prev, attempts: newAttempts };
            }

            localStorage.setItem(key, JSON.stringify(newState));
            return newState;
        });
    }, [key, maxAttempts, blockDurationMinutes]);

    const resetAttempts = useCallback(() => {
        const newState = { attempts: 0, blockedUntil: null };
        setState(newState);
        localStorage.setItem(key, JSON.stringify(newState));
    }, [key]);

    // Formatage du temps restant (Minutes:Secondes)
    const formatTimeLeft = () => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        if (minutes > 0) return `${minutes}m ${seconds}s`;
        return `${seconds}s`;
    };

    return {
        isBlocked,
        timeLeft,
        formatTimeLeft: formatTimeLeft(),
        attemptsLeft: Math.max(0, maxAttempts - state.attempts),
        recordAttempt,
        resetAttempts
    };
}
