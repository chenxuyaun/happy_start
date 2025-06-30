import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from '@mui/material';
import { TipsAndUpdates as SuggestIcon, Close as CloseIcon } from '@mui/icons-material';

const AISuggestionsDialog = ({ open, onClose }) => {
  const suggestions = [
    '今日心情不佳？尝试冥想或个性化设置。',
    '把时间安排得更高效：利用习惯追踪器。',
    '记录下你的想法，以提升情感洞察力。',
    '看看最近的成就，为自己喝彩！'
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <SuggestIcon sx={{ mr: 1 }} /> AI 智能建议
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <List>
          {suggestions.map((suggestion, index) => (
            <ListItem key={index}>
              <ListItemText primary={suggestion} />
            </ListItem>
          ))}
        </List>
        <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
          提示：基于您的活动记录，这些只是建议，请随意接受或忽略。
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          关闭
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AISuggestionsDialog;
