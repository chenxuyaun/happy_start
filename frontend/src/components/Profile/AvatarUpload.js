import React, { useState, useRef } from 'react';
import {
  Box,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Badge,
  Alert,
  CircularProgress,
  Slider,
  Grid,
} from '@mui/material';
import {
  PhotoCamera,
  Upload,
  Crop,
  Delete,
  Refresh,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserProfile } from '../../store/userSlice';
import { userUtils } from '../../utils/userUtils';

const AvatarUpload = ({ 
  currentAvatar, 
  userName, 
  size = 100, 
  editable = true,
  onAvatarChange 
}) => {
  const dispatch = useDispatch();
  const { loading } = useSelector(state => state.user);
  const fileInputRef = useRef(null);
  
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [cropScale, setCropScale] = useState(1);
  const [rotation, setRotation] = useState(0);

  // 生成默认头像
  const generateDefaultAvatar = () => {
    return userUtils.generateAvatarUrl(userName, {
      size,
      background: 'random',
      color: 'fff',
      rounded: true,
    });
  };

  // 处理文件选择
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      setError('请选择图片文件');
      return;
    }

    // 验证文件大小 (最大 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('图片大小不能超过5MB');
      return;
    }

    setSelectedFile(file);
    
    // 创建预览
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
      setOpen(true);
      setError('');
    };
    reader.readAsDataURL(file);
  };

  // 上传头像
  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    try {
      // 模拟上传过程
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 在实际应用中，这里会调用API上传文件
      const mockUploadedUrl = URL.createObjectURL(selectedFile);
      
      // 更新用户头像
      if (onAvatarChange) {
        onAvatarChange(mockUploadedUrl);
      } else {
        dispatch(updateUserProfile({ avatar: mockUploadedUrl }));
      }
      
      handleClose();
    } catch (error) {
      setError('上传失败，请重试');
    } finally {
      setUploading(false);
    }
  };

  // 删除头像
  const handleDelete = () => {
    if (onAvatarChange) {
      onAvatarChange('');
    } else {
      dispatch(updateUserProfile({ avatar: '' }));
    }
    handleClose();
  };

  // 重新生成随机头像
  const handleRegenerate = () => {
    const newAvatar = userUtils.generateAvatarUrl(userName, {
      size,
      background: 'random',
      color: 'fff',
      rounded: true,
    });
    
    if (onAvatarChange) {
      onAvatarChange(newAvatar);
    } else {
      dispatch(updateUserProfile({ avatar: newAvatar }));
    }
  };

  // 关闭对话框
  const handleClose = () => {
    setOpen(false);
    setSelectedFile(null);
    setPreview(null);
    setError('');
    setCropScale(1);
    setRotation(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 打开文件选择器
  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const currentAvatarUrl = currentAvatar || generateDefaultAvatar();

  return (
    <Box>
      <Badge
        overlap="circular"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        badgeContent={
          editable && (
            <IconButton
              color="primary"
              aria-label="change avatar"
              component="span"
              size="small"
              onClick={handleCameraClick}
              sx={{
                bgcolor: 'background.paper',
                border: 2,
                borderColor: 'primary.main',
                '&:hover': {
                  bgcolor: 'primary.light',
                  color: 'white',
                },
              }}
            >
              <PhotoCamera fontSize="small" />
            </IconButton>
          )
        }
      >
        <Avatar
          src={currentAvatarUrl}
          sx={{ 
            width: size, 
            height: size,
            cursor: editable ? 'pointer' : 'default',
            transition: 'transform 0.2s',
            '&:hover': editable ? {
              transform: 'scale(1.05)',
            } : {},
          }}
          onClick={editable ? handleCameraClick : undefined}
        />
      </Badge>

      {/* 隐藏的文件输入 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      {/* 头像编辑对话框 */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          更换头像
        </DialogTitle>
        
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {preview && (
            <Box>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                mb: 3,
                position: 'relative',
                height: 300,
                overflow: 'hidden',
                borderRadius: 2,
                bgcolor: 'grey.100',
              }}>
                <img
                  src={preview}
                  alt="预览"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                    transform: `scale(${cropScale}) rotate(${rotation}deg)`,
                    transition: 'transform 0.2s',
                  }}
                />
              </Box>

              {/* 编辑控件 */}
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography gutterBottom>缩放</Typography>
                  <Slider
                    value={cropScale}
                    onChange={(_, value) => setCropScale(value)}
                    min={0.5}
                    max={3}
                    step={0.1}
                    marks={[
                      { value: 0.5, label: '0.5x' },
                      { value: 1, label: '1x' },
                      { value: 2, label: '2x' },
                      { value: 3, label: '3x' },
                    ]}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Typography gutterBottom>旋转</Typography>
                  <Slider
                    value={rotation}
                    onChange={(_, value) => setRotation(value)}
                    min={-180}
                    max={180}
                    step={15}
                    marks={[
                      { value: -180, label: '-180°' },
                      { value: -90, label: '-90°' },
                      { value: 0, label: '0°' },
                      { value: 90, label: '90°' },
                      { value: 180, label: '180°' },
                    ]}
                  />
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={handleRegenerate}
            startIcon={<Refresh />}
            variant="outlined"
            color="info"
          >
            随机头像
          </Button>
          
          {currentAvatar && (
            <Button
              onClick={handleDelete}
              startIcon={<Delete />}
              variant="outlined"
              color="error"
            >
              删除头像
            </Button>
          )}
          
          <Box sx={{ flexGrow: 1 }} />
          
          <Button onClick={handleClose}>
            取消
          </Button>
          
          <Button
            onClick={handleUpload}
            variant="contained"
            startIcon={uploading ? <CircularProgress size={16} /> : <Upload />}
            disabled={!selectedFile || uploading}
          >
            {uploading ? '上传中...' : '确认上传'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AvatarUpload;
