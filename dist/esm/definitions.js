// import type { ScanResult } from '@capacitor-community/bluetooth-le';
// export type Callback = () => void;
// export interface AppInfo {
//   appId: string;
//   developerId: string;
//   appKey: string;
// }
// export interface ScannerManagerPlugin {
//   startScan(seconds?: number): Promise<ScanResult[]>;
//   stopScan():Promise<void>;
//   connect(deviceId:string,appInfo:AppInfo):Promise<string>;
//   disconnect(deviceId:string):Promise<void>;
//   // echo(options: { value: string }): Promise<{ value: string }>;
// }
export * from './web';
