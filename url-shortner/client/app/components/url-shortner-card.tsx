"use client"
import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Snackbar,
    Alert as MuiAlert,
    Stack,
} from '@mui/material';
import Card from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Log } from "../../logging-middleware/logger"
import StatsPage from './stats-page';

const UrlShortnerCard = () => {
    const [longUrl, setLongUrl] = useState('');
    const [customShortcode, setCustomShortcode] = useState('');
    const [shortenedUrl, setShortenedUrl] = useState('');
    const [error, setError] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const [urlMap, setUrlMap] = useState({});

    const generateShortcode = () => {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 6; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    };

    const isValidUrl = (url) => {
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

        setUrlMap(prevMap => ({
            ...prevMap,
            [shortcode]: {
                longUrl,
                validUntil: Date.now() + (30 * 60 * 1000),
            },
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

    useEffect(() => {
        const path = window.location.pathname.substring(1);
        const entry = urlMap[path];

        if (entry) {
            const isExpired = Date.now() > entry.validUntil;
            if (!isExpired) {
                window.location.href = entry.longUrl;
            } else {
                setError('The short URL has expired.');
            }
        }
    }, [urlMap]);

    return (
        <Box
            sx={{
                p: 4,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                fontFamily: 'sans-serif',
                bgcolor: '#f5f5f5'
            }}
        >
            <Card
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                    textAlign: 'center',
                    maxWidth: 500,
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
            </Card>

            <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)}>
                <MuiAlert severity="success" sx={{ width: '100%' }}>
                    Copied to clipboard!
                </MuiAlert>
            </Snackbar>
            <StatsPage urlMap={urlMap} />
        </Box>
    );
};

export default UrlShortnerCard;