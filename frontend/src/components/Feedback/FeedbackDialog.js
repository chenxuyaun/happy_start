import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Rating,
  Typography,
  Alert,
  Snackbar
} from '@mui/material';
import { Feedback as FeedbackIcon, Send as SendIcon } from '@mui/icons-material';

const FeedbackDialog = ({ open, onClose }) => {
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleSend = () => {
    // 处理发送反馈的逻辑
    // 例如发送到服务器或存储在本地存储中
    console.log('反馈内容:', feedback);
    console.log('评分:', rating);
    setFeedback('');
    setRating(0);
    setSnackbarOpen(true);
    onClose();
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <FeedbackIcon sx={{ mr: 1 }} /> 用户反馈
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            感谢您的反馈！请评分并提供您的意见建议。
          </Typography>
          <Rating
            name="feedback-rating"
            value={rating}
            onChange={(event, newValue) => {
              setRating(newValue || 0);
            }}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="反馈内容"
            multiline
            rows={4}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            variant="outlined"
          />
          <Alert severity="info" sx={{ mt: 2 }}>
            您的反馈将帮助我们改进应用！
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>取消</Button>
          <Button
            onClick={handleSend}
            variant="contained"
            color="primary"
            startIcon={<SendIcon />}
            disabled={!feedback.trim() || !rating}
          >
            发送
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        message="感谢您的反馈！"
      />
    </>
  );
};

export default FeedbackDialog;

