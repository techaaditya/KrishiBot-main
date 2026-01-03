"use client"

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Script from 'next/script';
import { AnimatePresence, motion } from 'framer-motion';
import LoadingScreen from '@/components/ecofarm/original/LoadingScreen';

// Dynamically import the original Home component to ensure it only runs in the browser
const OriginalEcoFarm = dynamic(() => import('@/components/ecofarm/original/Home'), {
    ssr: false,
    loading: () => <LoadingScreen />
});

export default function GamePage() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Match the exact 3-second loading experience from the original App.jsx
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            {/* Inject the original markdown dependency required by Home.jsx */}
            <Script
                src="https://cdnjs.cloudflare.com/ajax/libs/markdown.js/0.5.0/markdown.min.js"
                strategy="lazyOnload"
            />

            <AnimatePresence mode="wait">
                {isLoading && (
                    <motion.div
                        key="loading-screen"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="fixed inset-0 z-[100000]"
                    >
                        <LoadingScreen />
                    </motion.div>
                )}
            </AnimatePresence>

            {!isLoading && (
                <main className="min-h-screen bg-black overflow-hidden">
                    <OriginalEcoFarm />
                </main>
            )}

            <style jsx global>{`
                /* Ensure leaflet and original EcoFarm styles don't conflict with KrishiBot */
                .leaflet-container {
                    z-index: 1 !important;
                }
                /* Hide the Next.js/Tailwind scrollbar for a cleaner simulation look */
                ::-webkit-scrollbar {
                    display: none;
                }
                * {
                    scrollbar-width: none;
                }
            `}</style>
        </>
    );
}
