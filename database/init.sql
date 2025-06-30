-- 企业级心理治愈项目数据库初始化脚本
-- 支持GDPR和HIPAA合规性

-- 创建扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "citext";

-- 创建用户数据库
CREATE DATABASE happyday_users;
CREATE DATABASE happyday_gardens;
CREATE DATABASE happyday_journals;
CREATE DATABASE happyday_ai_analytics;

-- 创建用户和权限
CREATE USER happyday_user WITH ENCRYPTED PASSWORD 'secure_password_123!';
CREATE USER happyday_garden WITH ENCRYPTED PASSWORD 'garden_secure_456!';
CREATE USER happyday_journal WITH ENCRYPTED PASSWORD 'journal_secure_789!';
CREATE USER happyday_ai WITH ENCRYPTED PASSWORD 'ai_secure_abc!';

-- 授权
GRANT ALL PRIVILEGES ON DATABASE happyday_users TO happyday_user;
GRANT ALL PRIVILEGES ON DATABASE happyday_gardens TO happyday_garden;
GRANT ALL PRIVILEGES ON DATABASE happyday_journals TO happyday_journal;
GRANT ALL PRIVILEGES ON DATABASE happyday_ai_analytics TO happyday_ai;

-- 切换到用户数据库
\c happyday_users;

-- 在用户数据库中创建扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "citext";

-- 用户表（支持匿名和注册用户）
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email CITEXT UNIQUE,
    username VARCHAR(50) UNIQUE,
    password_hash TEXT,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    date_of_birth DATE,
    gender VARCHAR(20),
    phone_number TEXT,
    is_anonymous BOOLEAN DEFAULT false,
    is_verified BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    role VARCHAR(20) DEFAULT 'user',
    privacy_consent BOOLEAN DEFAULT false,
    terms_accepted BOOLEAN DEFAULT false,
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    -- 加密的敏感字段
    encrypted_personal_data JSONB,
    -- 审计字段
    created_by UUID,
    updated_by UUID,
    -- GDPR字段
    data_retention_until TIMESTAMPTZ,
    anonymization_requested BOOLEAN DEFAULT false,
    anonymization_date TIMESTAMPTZ
);

-- 用户配置文件表
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    avatar_url TEXT,
    bio TEXT,
    timezone VARCHAR(50),
    language VARCHAR(10) DEFAULT 'en',
    notification_preferences JSONB DEFAULT '{}',
    accessibility_settings JSONB DEFAULT '{}',
    theme_preferences JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 用户会话表（JWT管理）
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_token TEXT NOT NULL,
    refresh_token TEXT,
    device_info JSONB,
    ip_address INET,
    is_active BOOLEAN DEFAULT true,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_accessed TIMESTAMPTZ DEFAULT NOW()
);

-- OAuth提供商表
CREATE TABLE oauth_providers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL,
    provider_user_id TEXT NOT NULL,
    access_token TEXT,
    refresh_token TEXT,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(provider, provider_user_id)
);

-- 切换到花园数据库
\c happyday_gardens;

-- 在花园数据库中创建扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 花园状态表
CREATE TABLE gardens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    scene_data JSONB NOT NULL DEFAULT '{}',
    mood_atmosphere VARCHAR(50) DEFAULT 'peaceful',
    weather_condition VARCHAR(50) DEFAULT 'sunny',
    season VARCHAR(20) DEFAULT 'spring',
    growth_level INTEGER DEFAULT 1,
    energy_points INTEGER DEFAULT 100,
    is_public BOOLEAN DEFAULT false,
    last_visited TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 精灵表
CREATE TABLE spirits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    garden_id UUID NOT NULL REFERENCES gardens(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,
    personality_traits JSONB DEFAULT '{}',
    appearance JSONB DEFAULT '{}',
    position_x FLOAT DEFAULT 0,
    position_y FLOAT DEFAULT 0,
    position_z FLOAT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    unlocked_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 花园元素表（花朵、树木等）
CREATE TABLE garden_elements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    garden_id UUID NOT NULL REFERENCES gardens(id) ON DELETE CASCADE,
    element_type VARCHAR(50) NOT NULL,
    element_name VARCHAR(100),
    model_url TEXT,
    position_x FLOAT DEFAULT 0,
    position_y FLOAT DEFAULT 0,
    position_z FLOAT DEFAULT 0,
    rotation_x FLOAT DEFAULT 0,
    rotation_y FLOAT DEFAULT 0,
    rotation_z FLOAT DEFAULT 0,
    scale_factor FLOAT DEFAULT 1.0,
    growth_stage INTEGER DEFAULT 1,
    color_scheme JSONB DEFAULT '{}',
    is_visible BOOLEAN DEFAULT true,
    planted_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 花园互动记录表
CREATE TABLE garden_interactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    garden_id UUID NOT NULL REFERENCES gardens(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    interaction_type VARCHAR(50) NOT NULL,
    target_element_id UUID,
    interaction_data JSONB DEFAULT '{}',
    emotion_before VARCHAR(50),
    emotion_after VARCHAR(50),
    duration_seconds INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 切换到日志数据库
\c happyday_journals;

-- 在日志数据库中创建扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 用户日志表
CREATE TABLE journal_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    title VARCHAR(200),
    content TEXT NOT NULL,
    mood_score INTEGER CHECK (mood_score >= 1 AND mood_score <= 10),
    emotions JSONB DEFAULT '[]',
    tags JSONB DEFAULT '[]',
    is_private BOOLEAN DEFAULT true,
    word_count INTEGER,
    -- AI分析结果
    sentiment_score FLOAT,
    emotion_analysis JSONB,
    keywords JSONB DEFAULT '[]',
    crisis_indicators JSONB DEFAULT '[]',
    -- 加密敏感内容
    encrypted_content TEXT,
    encryption_key_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    -- 审计
    reviewed_by UUID,
    reviewed_at TIMESTAMPTZ
);

-- 冥想会话表
CREATE TABLE meditation_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    session_type VARCHAR(50) NOT NULL,
    duration_minutes INTEGER NOT NULL,
    guidance_voice VARCHAR(50),
    background_music VARCHAR(100),
    scene_environment VARCHAR(100),
    mood_before INTEGER CHECK (mood_before >= 1 AND mood_before <= 10),
    mood_after INTEGER CHECK (mood_after >= 1 AND mood_after <= 10),
    completion_rate FLOAT DEFAULT 1.0,
    interruptions INTEGER DEFAULT 0,
    notes TEXT,
    biometric_data JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 治愈活动表
CREATE TABLE healing_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    activity_type VARCHAR(50) NOT NULL,
    activity_name VARCHAR(100) NOT NULL,
    description TEXT,
    duration_minutes INTEGER,
    difficulty_level INTEGER CHECK (difficulty_level >= 1 AND difficulty_level <= 5),
    completion_status VARCHAR(20) DEFAULT 'pending',
    effectiveness_rating INTEGER CHECK (effectiveness_rating >= 1 AND effectiveness_rating <= 5),
    notes TEXT,
    scheduled_for TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 切换到AI分析数据库
\c happyday_ai_analytics;

-- 在AI数据库中创建扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- AI模型元数据表
CREATE TABLE ai_models (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    model_name VARCHAR(100) NOT NULL UNIQUE,
    model_version VARCHAR(50) NOT NULL,
    model_type VARCHAR(50) NOT NULL,
    description TEXT,
    accuracy_score FLOAT,
    model_path TEXT,
    is_active BOOLEAN DEFAULT true,
    trained_at TIMESTAMPTZ,
    deployed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI分析结果表
CREATE TABLE ai_analysis_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    content_id UUID,
    content_type VARCHAR(50) NOT NULL,
    model_id UUID NOT NULL REFERENCES ai_models(id),
    analysis_type VARCHAR(50) NOT NULL,
    input_data JSONB NOT NULL,
    output_data JSONB NOT NULL,
    confidence_score FLOAT,
    processing_time_ms INTEGER,
    status VARCHAR(20) DEFAULT 'completed',
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 危机检测表
CREATE TABLE crisis_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    content_id UUID,
    alert_type VARCHAR(50) NOT NULL,
    severity_level INTEGER CHECK (severity_level >= 1 AND severity_level <= 5),
    indicators JSONB NOT NULL,
    ai_confidence FLOAT,
    is_resolved BOOLEAN DEFAULT false,
    response_actions JSONB DEFAULT '[]',
    assigned_counselor UUID,
    escalated_at TIMESTAMPTZ,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 用户行为分析表
CREATE TABLE user_behavior_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    session_id UUID,
    event_type VARCHAR(50) NOT NULL,
    event_data JSONB NOT NULL,
    page_url TEXT,
    user_agent TEXT,
    ip_address INET,
    duration_seconds INTEGER,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    -- 隐私合规
    is_anonymized BOOLEAN DEFAULT false,
    anonymized_at TIMESTAMPTZ
);

-- 创建索引以优化查询性能
\c happyday_users;
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_created_at ON users(created_at);
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_expires_at ON user_sessions(expires_at);

\c happyday_gardens;
CREATE INDEX idx_gardens_user_id ON gardens(user_id);
CREATE INDEX idx_gardens_last_visited ON gardens(last_visited);
CREATE INDEX idx_spirits_garden_id ON spirits(garden_id);
CREATE INDEX idx_garden_elements_garden_id ON garden_elements(garden_id);
CREATE INDEX idx_garden_interactions_garden_id ON garden_interactions(garden_id);
CREATE INDEX idx_garden_interactions_user_id ON garden_interactions(user_id);
CREATE INDEX idx_garden_interactions_created_at ON garden_interactions(created_at);

\c happyday_journals;
CREATE INDEX idx_journal_entries_user_id ON journal_entries(user_id);
CREATE INDEX idx_journal_entries_created_at ON journal_entries(created_at);
CREATE INDEX idx_meditation_sessions_user_id ON meditation_sessions(user_id);
CREATE INDEX idx_healing_activities_user_id ON healing_activities(user_id);
CREATE INDEX idx_healing_activities_scheduled_for ON healing_activities(scheduled_for);

\c happyday_ai_analytics;
CREATE INDEX idx_ai_analysis_results_user_id ON ai_analysis_results(user_id);
CREATE INDEX idx_ai_analysis_results_model_id ON ai_analysis_results(model_id);
CREATE INDEX idx_ai_analysis_results_created_at ON ai_analysis_results(created_at);
CREATE INDEX idx_crisis_alerts_user_id ON crisis_alerts(user_id);
CREATE INDEX idx_crisis_alerts_severity_level ON crisis_alerts(severity_level);
CREATE INDEX idx_crisis_alerts_is_resolved ON crisis_alerts(is_resolved);
CREATE INDEX idx_user_behavior_analytics_user_id ON user_behavior_analytics(user_id);
CREATE INDEX idx_user_behavior_analytics_timestamp ON user_behavior_analytics(timestamp);

-- 插入初始数据
\c happyday_ai_analytics;
INSERT INTO ai_models (model_name, model_version, model_type, description, accuracy_score) VALUES
('emotion-classifier-v1', '1.0.0', 'emotion_analysis', '基于BERT的情绪分类模型', 0.92),
('crisis-detector-v1', '1.0.0', 'crisis_detection', '危机检测和自杀意念识别模型', 0.88),
('sentiment-analyzer-v1', '1.0.0', 'sentiment_analysis', '情感极性分析模型', 0.91),
('therapy-recommender-v1', '1.0.0', 'recommendation', 'CBT治疗方案推荐模型', 0.85);

-- 创建函数和触发器
\c happyday_users;

-- 更新时间戳触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 为所有表添加更新时间戳触发器
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_oauth_providers_updated_at BEFORE UPDATE ON oauth_providers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

\c happyday_gardens;

-- 创建触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_gardens_updated_at BEFORE UPDATE ON gardens FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_spirits_updated_at BEFORE UPDATE ON spirits FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_garden_elements_updated_at BEFORE UPDATE ON garden_elements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

\c happyday_journals;

-- 创建触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_journal_entries_updated_at BEFORE UPDATE ON journal_entries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
