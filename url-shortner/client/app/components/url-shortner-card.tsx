"use client"
import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Snackbar,
    Alert as MuiAlert,
    Stack,
    Link,
    IconButton,
} from '@mui/material';
import Card from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import StatsPage from './stats-page';

// Define the type for a single click entry
interface ClickEntry {
    timestamp: number;
    source: string;
    geo: string;
}

// Define the type for a single URL entry in the map
interface UrlEntry {
    longUrl: string;
    validUntil: number;
    createdAt: number;
    clicks?: ClickEntry[];
}

interface LogEntry {
    stack: string;
    level: string;
    package: string;
    message: string;
}

const Log = (stack: string, level: string, sourcePackage: string, message: string) => {
    const logData: LogEntry = {
        stack: stack,
        level: level,
        package: sourcePackage,
        message: message,
    };
    
    // Simulate API call to the Test Server
    console.log("Logging Middleware:", logData);

    return logData;
};

const UrlShortnerCard = () => {
    const [longUrl, setLongUrl] = useState('');
    const [customShortcode, setCustomShortcode] = useState('');
    const [shortenedUrl, setShortenedUrl] = useState('');
    const [error, setError] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [urlMap, setUrlMap] = useState<Record<string, UrlEntry>>({});
    const [view, setView] = useState('shortener'); // 'shortener' or 'stats'

    // Load URL map from localStorage on initial render
    useEffect(() => {
        try {
            const storedMap = localStorage.getItem('urlMap');
            if (storedMap) {
                setUrlMap(JSON.parse(storedMap));
            }
        } catch (e) {
            console.error("Failed to load URL map from localStorage", e);
        }
    }, []);

    // Save URL map to localStorage whenever it changes
    useEffect(() => {
        try {
            localStorage.setItem('urlMap', JSON.stringify(urlMap));
        } catch (e) {
            console.error("Failed to save URL map to localStorage", e);
        }
    }, [urlMap]);

    // Handle URL redirection logic
    useEffect(() => {
        const path = window.location.pathname.substring(1);
        const entry = urlMap[path];

        if (entry) {
            const isExpired = Date.now() > entry.validUntil;
            if (!isExpired) {
                // Log and update click
                const updatedClicks = entry.clicks ? [...entry.clicks, {
                    timestamp: Date.now(),
                    source: document.referrer || 'direct',
                    geo: 'unknown' // Mock geo data
                }] : [{
                    timestamp: Date.now(),
                    source: document.referrer || 'direct',
                    geo: 'unknown'
                }];

                setUrlMap(prevMap => ({
                    ...prevMap,
                    [path]: {
                        ...entry,
                        clicks: updatedClicks
                    }
                }));

                window.location.href = entry.longUrl;
            } else {
                setError('The short URL has expired.');
            }
        }
    }, [urlMap]);

    const generateShortcode = () => {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 6; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    };

    const isValidUrl = (url: string): boolean => {
        try {
            new URL(url);
            return true;
        } catch (_) {
            return false;
        }
    };

    const handleShorten = () => {
        setError('');
        setShortenedUrl('');

        if (!isValidUrl(longUrl)) {
            setError('Please enter a valid URL.');
            return;
        }

        let shortcode = customShortcode || generateShortcode();

        if (Object.keys(urlMap).includes(shortcode)) {
            setError(`Shortcode "${shortcode}" is already in use. Please choose another or leave it blank.`);
            return;
        }

        const newEntry: UrlEntry = {
            longUrl,
            validUntil: Date.now() + (30 * 60 * 1000), // 30 minutes from now
            createdAt: Date.now(),
            clicks: [],
        };
        
        setUrlMap(prevMap => ({
            ...prevMap,
            [shortcode]: newEntry,
        }));

        Log("frontend", "info", "url-shortener", `Successfully shortened URL: ${longUrl}`);
        
        setShortenedUrl(`${window.location.origin}/${shortcode}`);
    };

    const handleCopy = () => {
        if (shortenedUrl) {
            navigator.clipboard.writeText(shortenedUrl).then(() => {
                setSnackbarOpen(true);
            });
        }
    };
    
    return (
        <Box
            sx={{
                p: { xs: 2, md: 4 },
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                fontFamily: 'sans-serif',
                bgcolor: '#f5f5f5',
            }}
        >
            <Box sx={{
                width: '100%',
                maxWidth: 800,
            }}>
                {view === 'shortener' ? (
                    <Card
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 3,
                            textAlign: 'center',
                            width: '100%',
                        }}
                    >
                        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                            URL Shortener
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Paste a long URL to shorten it and get a unique, shareable link.
                        </Typography>
                        <Stack spacing={2} sx={{ width: '100%' }}>
                            <Input
                                label="Long URL"
                                placeholder="e.g., https://www.example.com/very/long/url"
                                value={longUrl}
                                onChange={(e) => setLongUrl(e.target.value)}
                            />

                            <Input
                                label="Custom Shortcode (Optional)"
                                placeholder="e.g., my-link"
                                value={customShortcode}
                                onChange={(e) => setCustomShortcode(e.target.value)}
                            />
                        </Stack>

                        <Button onClick={handleShorten} sx={{ mt: 2 }}>
                            Shorten URL
                        </Button>

                        {error && (
                            <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                                {error}
                            </Typography>
                        )}

                        {shortenedUrl && (
                            <Box
                                sx={{
                                    mt: 3,
                                    p: 2,
                                    bgcolor: '#f0f4ff',
                                    border: '1px dashed #c0d1ff',
                                    borderRadius: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    gap: 2,
                                    flexWrap: 'wrap',
                                }}
                            >
                                <Typography variant="body1" sx={{ wordBreak: 'break-all' }}>
                                    {shortenedUrl}
                                </Typography>
                                <Button
                                    onClick={handleCopy}
                                    sx={{
                                        bgcolor: 'transparent',
                                        borderColor: 'primary.main',
                                        color: 'primary.main',
                                        '&:hover': {
                                            bgcolor: 'primary.light',
                                        }
                                    }}
                                >
                                    Copy
                                </Button>
                            </Box>
                        )}
                        <Box sx={{ mt: 2 }}>
                            <Button variant="text" onClick={() => setView('stats')}>
                                View Statistics
                            </Button>
                        </Box>
                    </Card>
                ) : (
                    <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                             <Button onClick={() => setView('shortener')}>Back to Shortener</Button>
                        </Box>
                        <StatsPage urlMap={urlMap} />
                    </Box>
                )}
            </Box>
            <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)}>
                <MuiAlert severity="success" sx={{ width: '100%' }}>
                    Copied to clipboard!
                </MuiAlert>
            </Snackbar>
        </Box>
    );
};

export default UrlShortnerCard;
