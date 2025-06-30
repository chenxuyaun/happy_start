import storageService from './storageService';
import { format } from 'date-fns';

// 数据导出服务
class ExportService {
  constructor() {
    this.supportedFormats = ['json', 'csv', 'pdf', 'txt'];
  }

  // 导出所有数据
  async exportAllData(format = 'json', options = {}) {
    const data = storageService.getAllLocalData();
    const timestamp = format(new Date(), 'yyyy-MM-dd_HH-mm-ss');
    const filename = `happyday_backup_${timestamp}`;
    
    switch (format.toLowerCase()) {
      case 'json':
        return this.exportAsJSON(data, filename, options);
      case 'csv':
        return this.exportAsCSV(data, filename, options);
      case 'pdf':
        return this.exportAsPDF(data, filename, options);
      case 'txt':
        return this.exportAsText(data, filename, options);
      default:
        throw new Error(`不支持的导出格式: ${format}`);
    }
  }

  // 导出日记数据
  async exportJournalData(format = 'json', filters = {}, options = {}) {
    const entries = storageService.getJournalEntries(filters);
    const timestamp = format(new Date(), 'yyyy-MM-dd_HH-mm-ss');
    const filename = `journal_export_${timestamp}`;
    
    const journalData = {
      entries,
      totalEntries: entries.length,
      exportDate: new Date().toISOString(),
      filters,
    };
    
    switch (format.toLowerCase()) {
      case 'json':
        return this.exportAsJSON(journalData, filename, options);
      case 'csv':
        return this.exportJournalAsCSV(entries, filename, options);
      case 'pdf':
        return this.exportJournalAsPDF(entries, filename, options);
      case 'txt':
        return this.exportJournalAsText(entries, filename, options);
      default:
        throw new Error(`不支持的导出格式: ${format}`);
    }
  }

  // 导出冥想数据
  async exportMeditationData(format = 'json', options = {}) {
    const sessions = storageService.getMeditationSessions();
    const timestamp = format(new Date(), 'yyyy-MM-dd_HH-mm-ss');
    const filename = `meditation_export_${timestamp}`;
    
    const meditationData = {
      sessions,
      totalSessions: sessions.length,
      totalDuration: sessions.reduce((sum, session) => sum + (session.duration || 0), 0),
      exportDate: new Date().toISOString(),
    };
    
    switch (format.toLowerCase()) {
      case 'json':
        return this.exportAsJSON(meditationData, filename, options);
      case 'csv':
        return this.exportMeditationAsCSV(sessions, filename, options);
      case 'txt':
        return this.exportMeditationAsText(sessions, filename, options);
      default:
        throw new Error(`不支持的导出格式: ${format}`);
    }
  }

  // 导出花园数据
  async exportGardenData(format = 'json', options = {}) {
    const gardenData = storageService.getGardenData();
    const timestamp = format(new Date(), 'yyyy-MM-dd_HH-mm-ss');
    const filename = `garden_export_${timestamp}`;
    
    switch (format.toLowerCase()) {
      case 'json':
        return this.exportAsJSON(gardenData, filename, options);
      case 'csv':
        return this.exportGardenAsCSV(gardenData, filename, options);
      case 'txt':
        return this.exportGardenAsText(gardenData, filename, options);
      default:
        throw new Error(`不支持的导出格式: ${format}`);
    }
  }

  // JSON格式导出
  exportAsJSON(data, filename, options = {}) {
    const jsonContent = JSON.stringify(data, null, options.prettyPrint ? 2 : 0);
    return this.downloadFile(jsonContent, `${filename}.json`, 'application/json');
  }

  // CSV格式导出
  exportAsCSV(data, filename, options = {}) {
    // 这里简化处理，实际可以根据数据结构生成对应的CSV
    let csvContent = '';
    
    if (data.entries) {
      // 日记数据
      csvContent = this.convertJournalToCSV(data.entries);
    } else if (data.sessions) {
      // 冥想数据
      csvContent = this.convertMeditationToCSV(data.sessions);
    } else {
      // 通用数据转换
      csvContent = this.convertObjectToCSV(data);
    }
    
    return this.downloadFile(csvContent, `${filename}.csv`, 'text/csv');
  }

  // 日记CSV转换
  convertJournalToCSV(entries) {
    if (!entries || entries.length === 0) return '';
    
    const headers = ['日期', '心情', '标题', '内容', '标签', '创建时间'];
    const csvRows = [headers.join(',')];
    
    entries.forEach(entry => {
      const row = [
        entry.date || '',
        entry.mood || '',
        this.escapeCsvValue(entry.title || ''),
        this.escapeCsvValue(entry.content || ''),
        entry.tags ? entry.tags.join(';') : '',
        entry.createdAt || ''
      ];
      csvRows.push(row.join(','));
    });
    
    return csvRows.join('\n');
  }

  // 日记CSV导出
  exportJournalAsCSV(entries, filename, options = {}) {
    const csvContent = this.convertJournalToCSV(entries);
    return this.downloadFile(csvContent, `${filename}.csv`, 'text/csv');
  }

  // 冥想CSV转换
  convertMeditationToCSV(sessions) {
    if (!sessions || sessions.length === 0) return '';
    
    const headers = ['日期', '时长(分钟)', '类型', '完成状态', '创建时间'];
    const csvRows = [headers.join(',')];
    
    sessions.forEach(session => {
      const row = [
        session.date || '',
        session.duration ? Math.round(session.duration / 60) : 0,
        session.type || '',
        session.completed ? '已完成' : '未完成',
        session.createdAt || ''
      ];
      csvRows.push(row.join(','));
    });
    
    return csvRows.join('\n');
  }

  // 冥想CSV导出
  exportMeditationAsCSV(sessions, filename, options = {}) {
    const csvContent = this.convertMeditationToCSV(sessions);
    return this.downloadFile(csvContent, `${filename}.csv`, 'text/csv');
  }

  // 花园CSV导出
  exportGardenAsCSV(gardenData, filename, options = {}) {
    let csvContent = '';
    
    if (gardenData?.plants) {
      const headers = ['植物名称', '种植时间', '浇水次数', '状态', '经验值'];
      const csvRows = [headers.join(',')];
      
      gardenData.plants.forEach(plant => {
        const row = [
          plant.name || '',
          plant.plantedAt || '',
          plant.waterCount || 0,
          plant.status || '',
          plant.experience || 0
        ];
        csvRows.push(row.join(','));
      });
      
      csvContent = csvRows.join('\n');
    }
    
    return this.downloadFile(csvContent, `${filename}.csv`, 'text/csv');
  }

  // 文本格式导出
  exportAsText(data, filename, options = {}) {
    let textContent = '';
    
    if (data.entries) {
      textContent = this.convertJournalToText(data.entries);
    } else if (data.sessions) {
      textContent = this.convertMeditationToText(data.sessions);
    } else {
      textContent = JSON.stringify(data, null, 2);
    }
    
    return this.downloadFile(textContent, `${filename}.txt`, 'text/plain');
  }

  // 日记文本导出
  exportJournalAsText(entries, filename, options = {}) {
    const textContent = this.convertJournalToText(entries);
    return this.downloadFile(textContent, `${filename}.txt`, 'text/plain');
  }

  // 日记转文本格式
  convertJournalToText(entries) {
    if (!entries || entries.length === 0) {
      return '暂无日记条目\n';
    }
    
    let textContent = `日记导出报告\n生成时间：${new Date().toLocaleString()}\n总条目：${entries.length}\n\n`;
    textContent += '=' .repeat(50) + '\n\n';
    
    entries.forEach((entry, index) => {
      textContent += `第 ${index + 1} 条日记\n`;
      textContent += `-`.repeat(20) + '\n';
      textContent += `日期：${entry.date || '未知'}\n`;
      textContent += `心情：${entry.mood || '未知'}\n`;
      textContent += `标题：${entry.title || '无标题'}\n`;
      if (entry.tags && entry.tags.length > 0) {
        textContent += `标签：${entry.tags.join(', ')}\n`;
      }
      textContent += `内容：\n${entry.content || '无内容'}\n`;
      textContent += `创建时间：${entry.createdAt || '未知'}\n`;
      textContent += '\n' + '='.repeat(50) + '\n\n';
    });
    
    return textContent;
  }

  // 冥想文本导出
  exportMeditationAsText(sessions, filename, options = {}) {
    const textContent = this.convertMeditationToText(sessions);
    return this.downloadFile(textContent, `${filename}.txt`, 'text/plain');
  }

  // 冥想转文本格式
  convertMeditationToText(sessions) {
    if (!sessions || sessions.length === 0) {
      return '暂无冥想记录\n';
    }
    
    const totalDuration = sessions.reduce((sum, session) => sum + (session.duration || 0), 0);
    const completedSessions = sessions.filter(s => s.completed).length;
    
    let textContent = `冥想记录导出报告\n生成时间：${new Date().toLocaleString()}\n`;
    textContent += `总会话数：${sessions.length}\n`;
    textContent += `完成会话：${completedSessions}\n`;
    textContent += `总时长：${Math.round(totalDuration / 60)} 分钟\n\n`;
    textContent += '=' .repeat(50) + '\n\n';
    
    sessions.forEach((session, index) => {
      textContent += `第 ${index + 1} 次冥想\n`;
      textContent += `-`.repeat(20) + '\n';
      textContent += `日期：${session.date || '未知'}\n`;
      textContent += `时长：${session.duration ? Math.round(session.duration / 60) : 0} 分钟\n`;
      textContent += `类型：${session.type || '未知'}\n`;
      textContent += `状态：${session.completed ? '已完成' : '未完成'}\n`;
      textContent += `创建时间：${session.createdAt || '未知'}\n`;
      textContent += '\n' + '='.repeat(50) + '\n\n';
    });
    
    return textContent;
  }

  // 花园文本导出
  exportGardenAsText(gardenData, filename, options = {}) {
    let textContent = `花园数据导出报告\n生成时间：${new Date().toLocaleString()}\n\n`;
    
    if (gardenData?.plants && gardenData.plants.length > 0) {
      textContent += `植物数量：${gardenData.plants.length}\n`;
      textContent += '=' .repeat(50) + '\n\n';
      
      gardenData.plants.forEach((plant, index) => {
        textContent += `植物 ${index + 1}\n`;
        textContent += `-`.repeat(20) + '\n';
        textContent += `名称：${plant.name || '未知'}\n`;
        textContent += `种植时间：${plant.plantedAt || '未知'}\n`;
        textContent += `浇水次数：${plant.waterCount || 0}\n`;
        textContent += `状态：${plant.status || '未知'}\n`;
        textContent += `经验值：${plant.experience || 0}\n`;
        textContent += '\n';
      });
    } else {
      textContent += '暂无植物数据\n';
    }
    
    if (gardenData?.achievements && gardenData.achievements.length > 0) {
      textContent += '\n成就列表：\n';
      textContent += '-'.repeat(20) + '\n';
      gardenData.achievements.forEach(achievement => {
        textContent += `• ${achievement.name || '未知成就'}\n`;
      });
    }
    
    return this.downloadFile(textContent, `${filename}.txt`, 'text/plain');
  }

  // PDF导出（简化版，实际可使用jsPDF等库）
  exportAsPDF(data, filename, options = {}) {
    // 这里可以集成jsPDF库来生成PDF
    // 现在先用文本格式代替
    return this.exportAsText(data, filename, options);
  }

  // 日记PDF导出
  exportJournalAsPDF(entries, filename, options = {}) {
    // 这里可以集成jsPDF库来生成PDF
    // 现在先用文本格式代替
    return this.exportJournalAsText(entries, filename, options);
  }

  // 通用对象转CSV
  convertObjectToCSV(obj) {
    if (typeof obj !== 'object' || obj === null) {
      return '';
    }
    
    const headers = Object.keys(obj);
    const values = headers.map(header => this.escapeCsvValue(obj[header]));
    
    return [headers.join(','), values.join(',')].join('\n');
  }

  // CSV值转义
  escapeCsvValue(value) {
    if (value === null || value === undefined) {
      return '';
    }
    
    const stringValue = String(value);
    if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    
    return stringValue;
  }

  // 下载文件
  downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // 清理URL对象
    window.URL.revokeObjectURL(url);
    
    return {
      success: true,
      filename,
      size: blob.size,
      type: mimeType
    };
  }

  // 获取支持的导出格式
  getSupportedFormats() {
    return this.supportedFormats;
  }

  // 验证导出格式
  isFormatSupported(format) {
    return this.supportedFormats.includes(format.toLowerCase());
  }

  // 生成导出预览
  generatePreview(data, format, maxItems = 5) {
    switch (format.toLowerCase()) {
      case 'json':
        return JSON.stringify(data, null, 2).substring(0, 500) + '...';
      case 'csv':
        if (data.entries) {
          const limitedEntries = data.entries.slice(0, maxItems);
          return this.convertJournalToCSV(limitedEntries);
        }
        return this.convertObjectToCSV(data);
      case 'txt':
        if (data.entries) {
          const limitedEntries = data.entries.slice(0, maxItems);
          return this.convertJournalToText(limitedEntries);
        }
        return JSON.stringify(data, null, 2);
      default:
        return '不支持的格式预览';
    }
  }
}

// 创建单例实例
const exportService = new ExportService();

export default exportService;
