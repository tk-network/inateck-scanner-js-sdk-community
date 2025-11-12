// Types and plugin interface
import type { ScanResult, InitializeOptions } from '@capacitor-community/bluetooth-le';

export type Callback = () => void;

export interface AppInfo {
  appId: string;
  developerId: string;
  appKey: string;
}

/**
 * Optional Capacitor plugin interface (for native registration).
 * The web implementation below already exposes identical methods.
 */
export interface ScannerManagerPlugin {
  initialize(options?: InitializeOptions): Promise<void>;
  startScan(seconds?: number): Promise<ScanResult[]>;
  stopScan(): Promise<void>;
  connect(deviceId: string, appInfo: AppInfo): Promise<string>;
  disconnect(deviceId: string): Promise<void>;
}

export * from './web';
