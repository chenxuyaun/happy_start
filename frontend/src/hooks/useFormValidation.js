import { useState, useCallback } from 'react';
import { validation } from '../utils/validation';

export const useFormValidation = (initialData = {}, validationRules = {}) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 更新表单字段值
  const updateField = useCallback((fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));

    // 实时验证
    if (touched[fieldName] && validationRules[fieldName]) {
      const error = validation.validateField(fieldName, value, validationRules);
      setErrors(prev => ({
        ...prev,
        [fieldName]: error
      }));
    }
  }, [validationRules, touched]);

  // 批量更新表单数据
  const updateFormData = useCallback((newData) => {
    setFormData(prev => ({
      ...prev,
      ...newData
    }));
  }, []);

  // 标记字段为已触摸
  const touchField = useCallback((fieldName) => {
    setTouched(prev => ({
      ...prev,
      [fieldName]: true
    }));
  }, []);

  // 验证单个字段
  const validateField = useCallback((fieldName) => {
    const value = formData[fieldName];
    const error = validation.validateField(fieldName, value, validationRules);
    
    setErrors(prev => ({
      ...prev,
      [fieldName]: error
    }));

    setTouched(prev => ({
      ...prev,
      [fieldName]: true
    }));

    return !error;
  }, [formData, validationRules]);

  // 验证整个表单
  const validateForm = useCallback(() => {
    const { isValid, errors: validationErrors } = validation.validateForm(formData, validationRules);
    
    setErrors(validationErrors);
    
    // 标记所有字段为已触摸
    const allFieldsTouched = {};
    Object.keys(validationRules).forEach(field => {
      allFieldsTouched[field] = true;
    });
    setTouched(allFieldsTouched);

    return isValid;
  }, [formData, validationRules]);

  // 重置表单
  const resetForm = useCallback((newData = initialData) => {
    setFormData(newData);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialData]);

  // 清除验证错误
  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  // 清除特定字段错误
  const clearFieldError = useCallback((fieldName) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  }, []);

  // 获取字段错误信息
  const getFieldError = useCallback((fieldName) => {
    return touched[fieldName] ? errors[fieldName] : null;
  }, [errors, touched]);

  // 检查字段是否有错误
  const hasFieldError = useCallback((fieldName) => {
    return Boolean(touched[fieldName] && errors[fieldName]);
  }, [errors, touched]);

  // 检查表单是否有任何错误
  const hasErrors = useCallback(() => {
    return Object.values(errors).some(error => Boolean(error));
  }, [errors]);

  // 获取表单验证状态
  const isValid = useCallback(() => {
    const touchedFields = Object.keys(touched).filter(field => touched[field]);
    const hasRequiredFields = Object.keys(validationRules).length > 0;
    const allRequiredFieldsTouched = hasRequiredFields && touchedFields.length > 0;
    
    return allRequiredFieldsTouched && !hasErrors();
  }, [touched, validationRules, hasErrors]);

  // 处理字段失焦事件
  const handleBlur = useCallback((fieldName) => {
    touchField(fieldName);
    validateField(fieldName);
  }, [touchField, validateField]);

  // 处理字段变更事件
  const handleChange = useCallback((fieldName, value) => {
    updateField(fieldName, value);
  }, [updateField]);

  // 提交表单
  const handleSubmit = useCallback(async (onSubmit) => {
    setIsSubmitting(true);
    
    try {
      if (validateForm()) {
        await onSubmit(formData);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Form submission error:', error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateForm]);

  return {
    // 表单数据
    formData,
    errors,
    touched,
    isSubmitting,
    
    // 表单操作
    updateField,
    updateFormData,
    touchField,
    validateField,
    validateForm,
    resetForm,
    clearErrors,
    clearFieldError,
    
    // 表单状态检查
    getFieldError,
    hasFieldError,
    hasErrors,
    isValid,
    
    // 事件处理器
    handleBlur,
    handleChange,
    handleSubmit,
  };
};

export default useFormValidation;
