import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';

const shortcuts = [
  { key: 'Ctrl + S', action: '保存当前项目' },
  { key: 'Ctrl + F', action: '搜索项目内容' },
  { key: 'Ctrl + Shift + P', action: '打开命令面板' },
  { key: 'Alt + Enter', action: '切换全屏模式' },
];

const KeyboardShortcutsManager = ({ open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>快捷键设置</DialogTitle>
      <DialogContent>
        <List>
          {shortcuts.map((shortcut, index) => (
            <React.Fragment key={index}>
              <ListItem>
                <ListItemText
                  primary={shortcut.key}
                  secondary={shortcut.action}
                />
              </ListItem>
              {index < shortcuts.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          关闭
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default KeyboardShortcutsManager;
