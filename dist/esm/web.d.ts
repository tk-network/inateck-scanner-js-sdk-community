import type { ScanResult, InitializeOptions } from '@capacitor-community/bluetooth-le';
interface AppInfo {
  appId: string;
  developerId: string;
  appKey: string;
}
export declare enum PropertyKeyList {
  /**
   * read barcode cache quantity or clean barcode cache value is 0
   */
  'cache',
  /**
   * Restore factory settings value is 1
   */
  'restore_factory',
  /**
   * enable or disable all barcodes  1 is enable 0 is disable
   */
  'enable_or_disable_all_barcodes',
  /**
   * restore default barcode type value is 1
   */
  'restore_default_barcode',
  /**
   * read/update bluetooth name key
   */
  'bluetooth_name',
  /**
   * read/update volume value 0 is mute, 2 is low, 4 is middle, 8 is loud
   */
  'volume',
  /**
   * Illumination key value 00 is scanning, 01 is Stay on,10 is Stay off
   */
  'lighting_lamp_control',
  /**
   * Navigation Light key value 00 is scanning, 01 is Stay on,10 is Stay off
   */
  'positioning_lamp_control',
  /**
   * Vibration reminder 0 is close,1 is open
   */
  'shake_reminder',
  /**
   * Vibration strength 0 is mute,1 is loud
   */
  'shake_intensity',
  /**
   * Navigation Light flashing 0 is close,1 is opens
   */
  'position_light_twinkle',
  /**
   * This key Clear data from buffer at start-up 1 is enable 0 is disable
   */
  'start_up_clean_cache',
  /**
   * This key Auto uploading barcode cache 1 is enable 0 is disable
   */
  'auto_upload_cache',
  /**
   * Motor PWM vibration intensity level 1-8 value 0000,0001,0010, 0011，。。。。1000 is loud
   */
  'motor_swing_grade',
  /**
   * barcode type key value 1 is enable 0 is disable
   */
  'Codabar',
  'Code 11',
  'Code 128',
  'Code 39',
  'Code 93',
  'GS1-128',
  'USPS/FedEx',
  'EAN-8',
  'EAN-13',
  'MSI',
  'UPC-A',
  'UPC-E0',
  'UPC-E1',
  'Chinese Post',
  'IATA 25',
  'Interleaved 25',
  'Matrix 25',
  'Standard 25',
  'QR Code',
  'Data Matrix',
  'PDF 417',
  'Aztec',
  'Maxi',
  'Han Xin',
}
interface callbackResult {
  /**
   * Event type 1 is barcode 2 is scanner disconnect
   */
  type: number;
  /**
   * Type 1 returns barcode, type 2 returns deviceId
   */
  data: string;
}
export interface ScannerManagerPlugin {
  /**
   * Initialize Bluetooth Low Energy (BLE). If it fails, BLE might be unavailable on this device.
   * On **Android** it will ask for the location permission. On **iOS** it will ask for the Bluetooth permission.
   * For an example, see [usage](#usage).
   */
  initialize(options?: InitializeOptions | undefined): Promise<void>;
  /**
   * Init the module and Scan for availables peripherals.
   * Returns a Promise ScanResult[].
   */
  startScan(seconds?: number): Promise<ScanResult[]>;
  /**
   * Stop scanning for BLE scanner
   */
  stopScan(): Promise<void>;
  /**
   * Attempts to connect to a peripheral. In many cases if you can't connect you have to scan for the peripheral before.
   * the callbacks will be invoked when the device is disconnected or a barcode is received.Returns a Promise object.
   */
  connect(deviceId: string, callback: (value: callbackResult) => void): Promise<string>;
  /**
   * Disconnect from a scanner.
   * Returns a Promise object.
   */
  disconnect(deviceId: string): Promise<void>;
  /**
   * Read the current battery level or firmware version of the specified scanner
   * @param propertyKey The propertyKey parameter is' battery 'or' firmware_version '
   */
  getBasicProperties(deviceId: string, propertyKey: string): Promise<string>;
  /**
   * get all barcode type settings
   * @param deviceId
   */
  getAllBarcodeProperties(deviceId: string): Promise<string>;
  /**
   * Modify data based on key
   * @param deviceId
   * @param propertyKey [PropertyKeyList](#propertykeylist)
   * @param data
   */
  editPropertiesInfoByKey(deviceId: string, propertyKey: string, data: string): Promise<string>;
  /**
   * Get data based on key.
   * @param deviceId
   * @param propertyKey [PropertyKeyList](#propertykeylist)
   */
  getPropertiesInfoByKey(deviceId: string, propertyKey: string): Promise<string>;
}
declare class ScannerManagerClass implements ScannerManagerPlugin {
  private scaning;
  private deviceMap;
  private DATA_SERVICE;
  private DATA_CHARACTERISTIC;
  private BATTERY_SERVICE;
  private BATTERY_CHARACTERISTIC;
  private WRITE_CHARACTERISTIC;
  private AUTHENTICATION_CHARACTERISTIC;
  private HARDWARE_CHARACTERISTIC_UUID;
  private READ_UUID;
  private setDelayTimer;
  private readDelayTimer;
  private receiveDelayTimer;
  private retryCount;
  private retryNumber;
  private readAddrData;
  private setAddrData;
  private packetLen;
  private receiveData;
  private trailStatus;
  private originalData;
  /**
   * Initialize Bluetooth Low Energy (BLE). If it fails, BLE might be unavailable on this device.
   * On **Android** it will ask for the location permission. On **iOS** it will ask for the Bluetooth permission.
   * For an example, see [usage](#usage).
   */
  initialize(options?: InitializeOptions | undefined): Promise<void>;
  /**
   * Scan for availables peripherals
   * @param {number} scanSeconds Default 5 seconds
   * @returns
   */
  startScan(seconds?: number): Promise<ScanResult[]>;
  /**
   * Stop the scanning.
   * @returns
   */
  stopScan(): Promise<void>;
  private onDisconnect;
  // connect(deviceId: string, appInfo: AppInfo, callback: (value: callbackResult) => void): Promise<string>;
  connect(deviceId: string, callback: (value: callbackResult) => void): Promise<string>;
  disconnect(deviceId: string): Promise<void>;
  private handleUpdateValue;
  /**
   * Start listening to changes of the value of a characteristic.
   * Note that you should only start the notifications once per characteristic in your app and share the data and not call startNotifications in every component that needs the data
   */
  private startNotifications;
  private stopNotifications;
  getBasicProperties(deviceId: string, propertyKey: string): Promise<string>;
  getAllBarcodeProperties(deviceId: string): Promise<string>;
  editPropertiesInfoByKey(deviceId: string, propertyKey: string, data: string): Promise<string>;
  getPropertiesInfoByKey(deviceId: string, propertyKey: string): Promise<string>;
  private validateApp;
  private setAddrInfo;
  private getAddrInfo;
  private writeAddrInfo;
  private handleReadDataChange;
  private parseData;
}
export declare const ScannerManager: ScannerManagerClass;
export {};
