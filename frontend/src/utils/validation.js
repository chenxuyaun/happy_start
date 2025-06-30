// 表单验证工具函数

export const validation = {
  // 验证必填字段
  required: (value, fieldName = '字段') => {
    if (!value || value.toString().trim() === '') {
      return `${fieldName}不能为空`;
    }
    return null;
  },

  // 验证邮箱格式
  email: (value) => {
    if (!value) return null;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return '请输入有效的邮箱地址';
    }
    return null;
  },

  // 验证电话号码
  phone: (value) => {
    if (!value) return null;
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    const cleanPhone = value.replace(/[\s\-\(\)]/g, '');
    if (!phoneRegex.test(cleanPhone)) {
      return '请输入有效的电话号码';
    }
    return null;
  },

  // 验证用户名
  username: (value) => {
    if (!value) return null;
    if (value.length < 3) {
      return '用户名至少需要3个字符';
    }
    if (value.length > 20) {
      return '用户名不能超过20个字符';
    }
    const usernameRegex = /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/;
    if (!usernameRegex.test(value)) {
      return '用户名只能包含字母、数字、下划线和中文';
    }
    return null;
  },

  // 验证密码强度
  password: (value) => {
    if (!value) return null;
    if (value.length < 8) {
      return '密码至少需要8个字符';
    }
    if (value.length > 128) {
      return '密码不能超过128个字符';
    }
    
    const hasLowerCase = /[a-z]/.test(value);
    const hasUpperCase = /[A-Z]/.test(value);
    const hasNumbers = /\d/.test(value);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    
    const strength = [hasLowerCase, hasUpperCase, hasNumbers, hasSpecial].filter(Boolean).length;
    
    if (strength < 2) {
      return '密码强度太弱，请包含大小写字母、数字或特殊字符';
    }
    
    return null;
  },

  // 验证确认密码
  confirmPassword: (value, originalPassword) => {
    if (!value) return null;
    if (value !== originalPassword) {
      return '两次输入的密码不一致';
    }
    return null;
  },

  // 验证年龄范围
  age: (dateOfBirth) => {
    if (!dateOfBirth) return null;
    
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    
    if (birthDate > today) {
      return '出生日期不能是未来时间';
    }
    
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    if (age < 13) {
      return '年龄不能小于13岁';
    }
    
    if (age > 120) {
      return '请输入有效的出生日期';
    }
    
    return null;
  },

  // 验证文本长度
  maxLength: (value, maxLength, fieldName = '字段') => {
    if (!value) return null;
    if (value.length > maxLength) {
      return `${fieldName}不能超过${maxLength}个字符`;
    }
    return null;
  },

  // 验证最小长度
  minLength: (value, minLength, fieldName = '字段') => {
    if (!value) return null;
    if (value.length < minLength) {
      return `${fieldName}至少需要${minLength}个字符`;
    }
    return null;
  },

  // 组合验证器
  combine: (...validators) => {
    return (value, ...args) => {
      for (const validator of validators) {
        const error = validator(value, ...args);
        if (error) {
          return error;
        }
      }
      return null;
    };
  },

  // 验证表单对象
  validateForm: (formData, rules) => {
    const errors = {};
    let isValid = true;
    
    Object.keys(rules).forEach(field => {
      const rule = rules[field];
      const value = formData[field];
      
      if (Array.isArray(rule)) {
        // 多个验证规则
        for (const singleRule of rule) {
          const error = singleRule(value);
          if (error) {
            errors[field] = error;
            isValid = false;
            break;
          }
        }
      } else {
        // 单个验证规则
        const error = rule(value);
        if (error) {
          errors[field] = error;
          isValid = false;
        }
      }
    });
    
    return { isValid, errors };
  },

  // 实时验证单个字段
  validateField: (fieldName, value, rules) => {
    const rule = rules[fieldName];
    if (!rule) return null;
    
    if (Array.isArray(rule)) {
      for (const singleRule of rule) {
        const error = singleRule(value);
        if (error) return error;
      }
    } else {
      return rule(value);
    }
    
    return null;
  }
};

// 预定义的验证规则组合
export const validationRules = {
  // 用户资料验证规则
  profile: {
    username: [validation.required, validation.username],
    email: [validation.required, validation.email],
    firstName: [(value) => validation.maxLength(value, 50, '姓')],
    lastName: [(value) => validation.maxLength(value, 50, '名')],
    bio: [(value) => validation.maxLength(value, 500, '个人简介')],
    phone: [validation.phone],
    dateOfBirth: [validation.age],
    location: [(value) => validation.maxLength(value, 100, '所在地')],
  },
  
  // 密码修改验证规则
  passwordChange: {
    currentPassword: [(value) => validation.required(value, '当前密码')],
    newPassword: [validation.password],
    confirmPassword: (formData) => validation.confirmPassword(formData.confirmPassword, formData.newPassword),
  },
  
  // 登录验证规则
  login: {
    email: [validation.required, validation.email],
    password: [(value) => validation.required(value, '密码')],
  },
  
  // 注册验证规则
  register: {
    username: [validation.required, validation.username],
    email: [validation.required, validation.email],
    password: [validation.required, validation.password],
    confirmPassword: (formData) => validation.confirmPassword(formData.confirmPassword, formData.password),
  }
};

export default validation;
