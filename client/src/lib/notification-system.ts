import { localDataManager } from './local-storage';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
  persistent?: boolean;
  actionUrl?: string;
  actionText?: string;
}

export interface NotificationPreferences {
  enabled: boolean;
  autoBackupReminders: boolean;
  calibrationReminders: boolean;
  maintenanceReminders: boolean;
  dataValidationWarnings: boolean;
  systemUpdates: boolean;
  soundEnabled: boolean;
  browserNotifications: boolean;
}

class NotificationManager {
  private notifications: Notification[] = [];
  private listeners: Array<(notifications: Notification[]) => void> = [];

  constructor() {
    this.loadNotifications();
    this.requestBrowserPermission();
  }

  private async loadNotifications(): Promise<void> {
    try {
      const saved = await localDataManager.getUserPreference('notifications');
      if (saved && Array.isArray(saved)) {
        this.notifications = saved.map(n => ({
          ...n,
          timestamp: new Date(n.timestamp)
        }));
      }
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
    }
  }

  private async saveNotifications(): Promise<void> {
    try {
      await localDataManager.saveUserPreference('notifications', this.notifications);
    } catch (error) {
      console.error('Erro ao salvar notificações:', error);
    }
  }

  private requestBrowserPermission(): void {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }

  subscribe(listener: (notifications: Notification[]) => void): () => void {
    this.listeners.push(listener);
    listener(this.notifications);
    
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.notifications));
  }

  async addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>): Promise<void> {
    const newNotification: Notification = {
      ...notification,
      id: this.generateId(),
      timestamp: new Date(),
      read: false
    };

    this.notifications.unshift(newNotification);
    
    // Limitar a 100 notificações
    if (this.notifications.length > 100) {
      this.notifications = this.notifications.slice(0, 100);
    }

    await this.saveNotifications();
    this.notifyListeners();

    // Mostrar notificação do browser se habilitado
    await this.showBrowserNotification(newNotification);
  }

  async markAsRead(id: string): Promise<void> {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
      await this.saveNotifications();
      this.notifyListeners();
    }
  }

  async markAllAsRead(): Promise<void> {
    this.notifications.forEach(n => n.read = true);
    await this.saveNotifications();
    this.notifyListeners();
  }

  async removeNotification(id: string): Promise<void> {
    this.notifications = this.notifications.filter(n => n.id !== id);
    await this.saveNotifications();
    this.notifyListeners();
  }

  async clearAll(): Promise<void> {
    this.notifications = [];
    await this.saveNotifications();
    this.notifyListeners();
  }

  getUnreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  getNotifications(limit?: number): Notification[] {
    return limit ? this.notifications.slice(0, limit) : this.notifications;
  }

  private generateId(): string {
    return `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async showBrowserNotification(notification: Notification): Promise<void> {
    const preferences = await this.getNotificationPreferences();
    
    if (!preferences.browserNotifications || Notification.permission !== 'granted') {
      return;
    }

    try {
      const browserNotification = new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: notification.id,
        requireInteraction: notification.persistent,
        silent: !preferences.soundEnabled
      });

      browserNotification.onclick = () => {
        window.focus();
        if (notification.actionUrl) {
          window.location.href = notification.actionUrl;
        }
        browserNotification.close();
      };

      // Auto-close after 5 seconds if not persistent
      if (!notification.persistent) {
        setTimeout(() => browserNotification.close(), 5000);
      }
    } catch (error) {
      console.error('Erro ao mostrar notificação do browser:', error);
    }
  }

  async getNotificationPreferences(): Promise<NotificationPreferences> {
    try {
      const prefs = await localDataManager.getUserPreference('notificationPreferences');
      return {
        enabled: true,
        autoBackupReminders: true,
        calibrationReminders: true,
        maintenanceReminders: true,
        dataValidationWarnings: true,
        systemUpdates: true,
        soundEnabled: true,
        browserNotifications: true,
        ...prefs
      };
    } catch (error) {
      console.error('Erro ao carregar preferências de notificação:', error);
      return {
        enabled: true,
        autoBackupReminders: true,
        calibrationReminders: true,
        maintenanceReminders: true,
        dataValidationWarnings: true,
        systemUpdates: true,
        soundEnabled: true,
        browserNotifications: true
      };
    }
  }

  async updateNotificationPreferences(preferences: Partial<NotificationPreferences>): Promise<void> {
    try {
      const current = await this.getNotificationPreferences();
      const updated = { ...current, ...preferences };
      await localDataManager.saveUserPreference('notificationPreferences', updated);
    } catch (error) {
      console.error('Erro ao salvar preferências de notificação:', error);
    }
  }

  // Métodos de conveniência para tipos específicos de notificação
  async notifySuccess(title: string, message: string, actionUrl?: string): Promise<void> {
    await this.addNotification({
      title,
      message,
      type: 'success',
      actionUrl
    });
  }

  async notifyError(title: string, message: string, persistent = true): Promise<void> {
    await this.addNotification({
      title,
      message,
      type: 'error',
      persistent
    });
  }

  async notifyWarning(title: string, message: string, actionUrl?: string, actionText?: string): Promise<void> {
    await this.addNotification({
      title,
      message,
      type: 'warning',
      actionUrl,
      actionText
    });
  }

  async notifyInfo(title: string, message: string, actionUrl?: string): Promise<void> {
    await this.addNotification({
      title,
      message,
      type: 'info',
      actionUrl
    });
  }

  // Notificações específicas do sistema
  async notifyBackupReminder(): Promise<void> {
    const preferences = await this.getNotificationPreferences();
    if (!preferences.autoBackupReminders) return;

    await this.notifyWarning(
      'Lembrete de Backup',
      'É recomendado fazer backup dos dados regularmente para evitar perda de informações.',
      '/configuracoes',
      'Fazer Backup'
    );
  }

  async notifyCalibrationReminder(equipamento: string, proximaCalibração: Date): Promise<void> {
    const preferences = await this.getNotificationPreferences();
    if (!preferences.calibrationReminders) return;

    const daysUntil = Math.ceil((proximaCalibração.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    
    if (daysUntil <= 7) {
      await this.notifyWarning(
        'Calibração Próxima',
        `O equipamento ${equipamento} precisa ser calibrado em ${daysUntil} dias.`,
        '/balanca-verificacao'
      );
    }
  }

  async notifyDataValidationWarning(testType: string, fieldName: string, message: string): Promise<void> {
    const preferences = await this.getNotificationPreferences();
    if (!preferences.dataValidationWarnings) return;

    await this.notifyWarning(
      'Aviso de Validação',
      `${testType}: ${fieldName} - ${message}`
    );
  }

  async notifyMaintenanceReminder(equipamento: string): Promise<void> {
    const preferences = await this.getNotificationPreferences();
    if (!preferences.maintenanceReminders) return;

    await this.notifyInfo(
      'Lembrete de Manutenção',
      `É recomendado verificar o estado do equipamento ${equipamento}.`
    );
  }

  async notifySystemUpdate(version: string, features: string[]): Promise<void> {
    const preferences = await this.getNotificationPreferences();
    if (!preferences.systemUpdates) return;

    await this.notifyInfo(
      'Atualização do Sistema',
      `Nova versão ${version} disponível com melhorias: ${features.join(', ')}.`
    );
  }

  // Verificações automáticas
  async checkAndNotifyBackupReminder(): Promise<void> {
    // Temporariamente desabilitado para evitar erros do IndexedDB
    return;
  }

  async startPeriodicChecks(): Promise<void> {
    // Verificar lembretes a cada hora
    setInterval(() => {
      this.checkAndNotifyBackupReminder();
    }, 60 * 60 * 1000);

    // Verificação inicial
    setTimeout(() => {
      this.checkAndNotifyBackupReminder();
    }, 5000);
  }
}

// Singleton instance
export const notificationManager = new NotificationManager();

// Iniciar verificações periódicas
notificationManager.startPeriodicChecks();

export default notificationManager;