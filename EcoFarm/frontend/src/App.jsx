import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import LoadingScreen from './components/LoadingScreen';
import Home from './components/Home';

function App() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <Router>
            <AnimatePresence>
                {isLoading && (
                    <motion.div
                        key="loading-screen"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        style={{ position: 'relative', zIndex: 100000 }}
                    >
                        <LoadingScreen />
                    </motion.div>
                )}
            </AnimatePresence>
            {!isLoading && (
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/game" element={<Home />} />
                    <Route path="*" element={<Home />} />
                </Routes>
            )}
        </Router>
    );
}

export default App;
