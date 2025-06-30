import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Typography, Box, TextField, Button, List, ListItem, ListItemText, CircularProgress, Alert } from '@mui/material';
import { sendMessageToAI, addMessage, clearError } from '../store/aiSlice';

function AIAssistantPage() {
  const dispatch = useDispatch();
  const [input, setInput] = useState('');
  const { messages, loading, error, isTyping } = useSelector(state => state.ai);

  const handleChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      dispatch(addMessage({ type: 'user', content: input }));
      dispatch(sendMessageToAI(input));
      setInput('');
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          AI助手
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="输入你的问题..."
            value={input}
            onChange={handleChange}
            disabled={loading}
            sx={{ mb: 2 }}
          />
          <Button type="submit" variant="contained" color="primary" disabled={loading || !input.trim()}>
            发送
          </Button>
        </form>

        {loading && <CircularProgress sx={{ mt: 2 }} />}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }} onClose={() => dispatch(clearError())}>
            {error}
          </Alert>
        )}

        <List sx={{ mt: 2 }}>
          {messages.map((msg, index) => (
            <ListItem key={index} sx={{ justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start' }}>
              <ListItemText
                primary={msg.content}
                secondary={msg.type === 'ai' ? 'AI助手' : '你'}
                sx={{ bgcolor: msg.type === 'ai' ? '#f0f0f0' : '#e0e0e0', borderRadius: 1, p: 1, maxWidth: '80%' }}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Container>
  );
}

export default AIAssistantPage;
