import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  List, 
  ListItem, 
  Accordion, 
  AccordionDetails,
  Button 
} from '@mui/material';

interface ClickEntry {
  timestamp: number;
  source: string;
  geo: string;
}

interface UrlEntry {
  longUrl: string;
  validUntil: number;
  createdAt: number;
  clicks?: ClickEntry[];
}

interface StatsPageProps {
  urlMap: Record<string, UrlEntry>;
}

const StatsPage: React.FC<StatsPageProps> = ({ urlMap }) => {
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleChange = (shortcode: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? shortcode : false);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 4 }}>
        URL Shortener Statistics
      </Typography>
      <List>
        {Object.keys(urlMap).length > 0 ? (
          Object.keys(urlMap).map((shortcode) => {
            const entry = urlMap[shortcode];
            const createdDate = new Date(entry.createdAt).toLocaleString();
            const expiryDate = new Date(entry.validUntil).toLocaleString();
            const totalClicks = entry.clicks?.length || 0;

            return (
              <Card key={shortcode} sx={{ mb: 2, p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="h6">Short URL: {window.location.origin}/{shortcode}</Typography>
                <Typography variant="body2">Created: {createdDate}</Typography>
                <Typography variant="body2">Expires: {expiryDate}</Typography>
                <Typography variant="body2">Total Clicks: {totalClicks}</Typography>
                
                {totalClicks > 0 && (
                  <Accordion
                    expanded={expanded === shortcode}
                    onChange={handleChange(shortcode)}
                    sx={{ mt: 2 }}
                  >
                    <Button 
                      onClick={handleChange(shortcode) as any} 
                      variant="contained" 
                      fullWidth 
                      sx={{ mb: 1 }}
                    >
                      Expand
                    </Button>
                    <AccordionDetails>
                      <List>
                        {entry.clicks!.map((click, index) => (
                          <ListItem key={index}>
                            <Typography variant="body2">
                              Timestamp: {new Date(click.timestamp).toLocaleString()}<br />
                              Source: {click.source}<br />
                              Location: {click.geo}
                            </Typography>
                          </ListItem>
                        ))}
                      </List>
                    </AccordionDetails>
                  </Accordion>
                )}
              </Card>
            );
          })
        ) : (
          <Typography variant="body1" color="text.secondary">
            No shortened URLs created yet.
          </Typography>
        )}
      </List>
    </Box>
  );
};

export default StatsPage;