
import { ChurchReport, ChurchSettings } from '../types';
import { apiConfig } from './apiConfig';

/**
 * Database service - now integrated with REST API backend
 * All data is persisted in SQLite database via Express API
 */
export const dbService = {
  async getReports(): Promise<ChurchReport[]> {
    try {
      return await apiConfig.get('/reports');
    } catch (error) {
      console.error('Error fetching reports:', error);
      return [];
    }
  },

  async saveReport(report: ChurchReport): Promise<void> {
    try {
      // Check if report exists (has a numeric ID from database)
      const existingReports = await this.getReports();
      const exists = existingReports.some(r => r.id === report.id);

      if (exists) {
        // Update existing report
        await apiConfig.put(`/reports/${report.id}`, report);
      } else {
        // Create new report
        await apiConfig.post('/reports', report);
      }
    } catch (error) {
      console.error('Error saving report:', error);
      throw error;
    }
  },

  async deleteReport(id: string): Promise<void> {
    try {
      await apiConfig.delete(`/reports/${id}`);
    } catch (error) {
      console.error('Error deleting report:', error);
      throw error;
    }
  },

  async getSettings(): Promise<ChurchSettings> {
    try {
      const settings = await apiConfig.get('/settings');
      return {
        churchName: settings.churchName,
        monthlyGoal: settings.monthlyGoal,
      };
    } catch (error) {
      console.error('Error fetching settings:', error);
      return { churchName: 'MINISTÉRIO JEOVÁ JIRÉ', monthlyGoal: 5000 };
    }
  },

  async saveSettings(settings: ChurchSettings): Promise<void> {
    try {
      await apiConfig.put('/settings', settings);
    } catch (error) {
      console.error('Error saving settings:', error);
      throw error;
    }
  },

  // Export all data as JSON backup
  async exportAllData() {
    try {
      const [reports, settings] = await Promise.all([
        this.getReports(),
        this.getSettings(),
      ]);

      const data = { reports, settings };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `backup_eclesia_${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting data:', error);
      throw error;
    }
  }
};
