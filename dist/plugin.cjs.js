'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var bluetoothLe = require('@capacitor-community/bluetooth-le');

//const cacheInfo = PROPERTIES_CONFIG['cache'];
const PROPERTIES_CONFIG = {
  cache: { addr: [0x7f, 0x72], bit: 0, bit_length: 0, model: 1, addr_length: 4 },
  restore_factory: { addr: [0x7f, 0x76], bit: 0, bit_length: 0, model: 1, addr_length: 0 },
  enable_or_disable_all_barcodes: { addr: [0x7f, 0x77], bit: 0, bit_length: 0, model: 1, addr_length: 0 },
  restore_default_barcode: { addr: [0x7f, 0x78], bit: 0, bit_length: 0, model: 1, addr_length: 0 },
  bluetooth_name: { addr: [0x7f, 0x40], bit: 0, bit_length: 0, model: 2, addr_length: 0 },
  volume: { addr: [0x7f, 0x82], bit: 0, bit_length: 0, model: 1, addr_length: 0 },
  lighting_lamp_control: { addr: [0x7f, 0x9b], bit: 6, bit_length: 2, model: 1, addr_length: 0 },
  positioning_lamp_control: { addr: [0x7f, 0x9b], bit: 4, bit_length: 2, model: 1, addr_length: 0 },
  shake_reminder: { addr: [0x7f, 0x9f], bit: 1, bit_length: 1, model: 1, addr_length: 0 },
  shake_intensity: { addr: [0x7f, 0x9e], bit: 5, bit_length: 1, model: 1, addr_length: 0 },
  position_light_twinkle: { addr: [0x7f, 0x9e], bit: 2, bit_length: 1, model: 1, addr_length: 0 },
  start_up_clean_cache: { addr: [0x7f, 0x80], bit: 6, bit_length: 1, model: 1, addr_length: 0 },
  auto_upload_cache: { addr: [0x7f, 0x80], bit: 5, bit_length: 1, model: 1, addr_length: 0 },
  motor_swing_grade: { addr: [0x7f, 0x98], bit: 0, bit_length: 4, model: 1, addr_length: 0 },
  Codabar: { addr: [0x7f, 0x8a], bit: 7, bit_length: 1, model: 1, addr_length: 0 },
  'Code 11': { addr: [0x7f, 0x8b], bit: 2, bit_length: 1, model: 1, addr_length: 0 },
  'Code 128': { addr: [0x7f, 0x8a], bit: 0, bit_length: 1, model: 1, addr_length: 0 },
  'Code 39': { addr: [0x7f, 0x8a], bit: 2, bit_length: 1, model: 1, addr_length: 0 },
  'Code 93': { addr: [0x7f, 0x8a], bit: 1, bit_length: 1, model: 1, addr_length: 0 },
  'GS1-128': { addr: [0x7f, 0x9f], bit: 3, bit_length: 1, model: 1, addr_length: 0 },
  'USPS/FedEx': { addr: [0x7f, 0x8e], bit: 0, bit_length: 1, model: 1, addr_length: 0 },
  'EAN-8': { addr: [0x7f, 0x8b], bit: 7, bit_length: 1, model: 1, addr_length: 0 },
  'EAN-13': { addr: [0x7f, 0x8b], bit: 6, bit_length: 1, model: 1, addr_length: 0 },
  MSI: { addr: [0x7f, 0x8b], bit: 3, bit_length: 1, model: 1, addr_length: 0 },
  'UPC-A': { addr: [0x7f, 0x8b], bit: 5, bit_length: 1, model: 1, addr_length: 0 },
  'UPC-E0': { addr: [0x7f, 0x8b], bit: 4, bit_length: 1, model: 1, addr_length: 0 },
  'UPC-E1': { addr: [0x7f, 0x8b], bit: 0, bit_length: 1, model: 1, addr_length: 0 },
  'Chinese Post': { addr: [0x7f, 0x8b], bit: 1, bit_length: 1, model: 1, addr_length: 0 },
  'IATA 25': { addr: [0x7f, 0x8a], bit: 6, bit_length: 1, model: 1, addr_length: 0 },
  'Interleaved 25': { addr: [0x7f, 0x8a], bit: 5, bit_length: 1, model: 1, addr_length: 0 },
  'Matrix 25': { addr: [0x7f, 0x8a], bit: 4, bit_length: 1, model: 1, addr_length: 0 },
  'Standard 25': { addr: [0x7f, 0x8a], bit: 3, bit_length: 1, model: 1, addr_length: 0 },
  'QR Code': { addr: [0x7f, 0x9b], bit: 3, bit_length: 1, model: 1, addr_length: 0 },
  'Data Matrix': { addr: [0x7f, 0x9a], bit: 4, bit_length: 1, model: 1, addr_length: 0 },
  'PDF 417': { addr: [0x7f, 0x9c], bit: 4, bit_length: 1, model: 1, addr_length: 0 },
  Aztec: { addr: [0x7f, 0x98], bit: 7, bit_length: 1, model: 1, addr_length: 0 },
  Maxi: { addr: [0x7f, 0x98], bit: 6, bit_length: 1, model: 1, addr_length: 0 },
  'Han Xin': { addr: [0x7f, 0x99], bit: 4, bit_length: 1, model: 1, addr_length: 0 },
};

function ab2str(buffer) {
  const uint8Array = new Uint8Array(buffer);
  let str = '';
  for (const item of uint8Array) {
    str += String.fromCharCode(item);
  }
  return str;
}
function getCheckSum(arr) {
  let sum = 0;
  arr.forEach((item) => {
    sum += parseInt(item.toString());
  });
  return sum % 256;
}
function stringToByte(str) {
  const bytes = [];
  let len = 0,
    c;
  len = str.length;
  for (let i = 0; i < len; i++) {
    c = str.charCodeAt(i);
    if (c >= 0x010000 && c <= 0x10ffff) {
      bytes.push(((c >> 18) & 0x07) | 0xf0);
      bytes.push(((c >> 12) & 0x3f) | 0x80);
      bytes.push(((c >> 6) & 0x3f) | 0x80);
      bytes.push((c & 0x3f) | 0x80);
    } else if (c >= 0x000800 && c <= 0x00ffff) {
      bytes.push(((c >> 12) & 0x0f) | 0xe0);
      bytes.push(((c >> 6) & 0x3f) | 0x80);
      bytes.push((c & 0x3f) | 0x80);
    } else if (c >= 0x000080 && c <= 0x0007ff) {
      bytes.push(((c >> 6) & 0x1f) | 0xc0);
      bytes.push((c & 0x3f) | 0x80);
    } else {
      bytes.push(c & 0xff);
    }
  }
  return bytes;
}
function byteToString(arr) {
  if (typeof arr === 'string') {
    return arr;
  }
  let str = '';
  const _arr = arr;
  for (let i = 0; i < _arr.length; i++) {
    const one = _arr[i].toString(2),
      v = one.match(/^1+?(?=0)/);
    if (v && one.length == 8) {
      const bytesLength = v[0].length;
      let store = _arr[i].toString(2).slice(7 - bytesLength);
      for (let st = 1; st < bytesLength; st++) {
        store += _arr[st + i].toString(2).slice(2);
      }
      str += String.fromCharCode(parseInt(store, 2));
      i += bytesLength - 1;
    } else {
      str += String.fromCharCode(_arr[i]);
    }
  }
  return str;
}
function chunkArr(arr, num) {
  // 首先创建一个新的空数组。用来存放分割好的数组
  const newArr = [];
  // 注意：这里与for循环不太一样的是，没有i++
  for (let i = 0; i < arr.length; ) {
    newArr.push(arr.slice(i, (i += num)));
  }
  return newArr;
}

class ScannerManagerClass {
  constructor() {
    this.scaning = false;
    this.deviceMap = new Map();
    this.DATA_SERVICE = bluetoothLe.numberToUUID(0xff00);
    this.DATA_CHARACTERISTIC = bluetoothLe.numberToUUID(0xff01);
    this.BATTERY_SERVICE = bluetoothLe.numberToUUID(0x180f);
    this.BATTERY_CHARACTERISTIC = bluetoothLe.numberToUUID(0x2a19);
    this.WRITE_CHARACTERISTIC = bluetoothLe.numberToUUID(0xff04);
    this.AUTHENTICATION_CHARACTERISTIC = bluetoothLe.numberToUUID(0xff05);
    this.HARDWARE_CHARACTERISTIC_UUID = bluetoothLe.numberToUUID(0xff02);
    this.READ_UUID = bluetoothLe.numberToUUID(0xff03);
    this.retryCount = 100;
    this.retryNumber = 0;
    this.readAddrData = [];
    this.setAddrData = [];
    this.packetLen = 0;
    this.receiveData = '';
    this.trailStatus = 0;
    this.originalData = [];
  }
  /**
   * Initialize Bluetooth Low Energy (BLE). If it fails, BLE might be unavailable on this device.
   * On **Android** it will ask for the location permission. On **iOS** it will ask for the Bluetooth permission.
   * For an example, see [usage](#usage).
   */
  async initialize(options) {
    return bluetoothLe.BleClient.initialize(options);
  }
  /**
   * Scan for availables peripherals
   * @param {number} scanSeconds Default 5 seconds
   * @returns
   */
  async startScan(seconds) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      try {
        this.scaning = true;
        await bluetoothLe.BleClient.requestLEScan({ allowDuplicates: true }, (result) => {
          if (result.manufacturerData) {
            for (const [, value] of Object.entries(result.manufacturerData)) {
              const m_data = ab2str(value.buffer);
              if (m_data.indexOf('@')) {
                const prefix_data = m_data.split('@')[0];
                if (prefix_data.toLocaleLowerCase() == 'xin') {
                  this.deviceMap.set(result.device.deviceId, result);
                }
              }
            }
          }
        });
        setTimeout(
          async () => {
            this.scaning = false;
            await bluetoothLe.BleClient.stopLEScan();
            const device_list = [];
            this.deviceMap.forEach((item) => {
              device_list.push(item);
            });
            resolve(device_list);
          },
          seconds !== null && seconds !== void 0 ? seconds : 5000,
        );
      } catch (error) {
        reject(error);
      }
    });
  }
  /**
   * Stop the scanning.
   * @returns
   */
  async stopScan() {
    return bluetoothLe.BleClient.stopLEScan();
  }
  // Disconnect callback
  onDisconnect(deviceId, callback) {
    callback({ type: 2, data: deviceId });
  }
  // connect scanner
  // async connect(deviceId, appInfo, callback) {
  async connect(deviceId, callback) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      try {
        if (this.scaning) {
          // 当前正在扫描中，连接时关闭扫描
          await bluetoothLe.BleClient.stopLEScan();
          this.scaning = false;
        }
        this.scaning = true;
        bluetoothLe.BleClient.connect(deviceId, (deviceId) => this.onDisconnect(deviceId, callback))
          .then(() => {
            bluetoothLe.BleClient.getServices(deviceId)
              .then(() => {
                this.startNotifications(deviceId, callback)
                  .then(() => {
                    this.scaning = false;
                    resolve(deviceId);
                    // TODO TOM
                    // this.validateApp(deviceId, appInfo).then(() => {
                    //     this.scaning = false;
                    //     resolve(deviceId);
                    // }).catch(() => {
                    //     this.scaning = false;
                    //     this.stopNotifications(deviceId);
                    //     this.disconnect(deviceId);
                    //     reject('Authorization fails');
                    // });
                  })
                  .catch((error) => {
                    this.scaning = false;
                    this.disconnect(deviceId);
                    // this.isConnecting = false
                    reject(error);
                  });
              })
              .catch((error) => {
                this.scaning = false;
                // this.isConnecting = false
                reject(error);
              });
          })
          .catch((error) => {
            this.scaning = false;
            // this.isConnecting = false
            reject(error);
          });
      } catch (error) {
        this.scaning = false;
        reject(error);
      }
    });
  }
  // Disconnect from a peripheral BLE scanner.
  async disconnect(deviceId) {
    return new Promise((resolve, reject) => {
      if (this.deviceMap.has(deviceId)) {
        this.deviceMap.delete(deviceId);
      }
      bluetoothLe.BleClient.disconnect(deviceId)
        .then(() => {
          resolve();
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  // Callback function to use when the value of the characteristic changes
  handleUpdateValue(value, callback) {
    const data = bluetoothLe.dataViewToNumbers(value);
    if ((data[0] == 0xf1 || data[0] == 0xf3) && this.trailStatus == 0) {
      this.setAddrData = data;
    } else if (data[0] == 0xf2 && this.trailStatus == 0) {
      this.readAddrData = data;
    } else {
      // 条码扫描
      this.parseData(data);
      this.retryNumber = 1;
      this.handleReadDataChange(3).then((values) => {
        callback({
          type: 1,
          data: values,
        });
      });
    }
  }
  /**
   * Start listening to changes of the value of a characteristic.
   * Note that you should only start the notifications once per characteristic in your app and share the data and not call startNotifications in every component that needs the data
   */
  async startNotifications(deviceId, callback) {
    return new Promise((resolve, reject) => {
      bluetoothLe.BleClient.startNotifications(deviceId, this.DATA_SERVICE, this.DATA_CHARACTERISTIC, (value) => {
        this.handleUpdateValue(value, callback);
      })
        .then(() => {
          resolve();
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  // Stop listening to the changes of the value of a characteristic.
  async stopNotifications(deviceId) {
    return new Promise((resolve, reject) => {
      bluetoothLe.BleClient.stopNotifications(deviceId, this.DATA_SERVICE, this.DATA_CHARACTERISTIC)
        .then(() => {
          resolve();
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  //Read the current battery level or firmware version of the specified scanner
  async getBasicProperties(deviceId, propertyKey) {
    return new Promise((resolve, reject) => {
      let service = '';
      let characteristic = '';
      if (propertyKey === 'battery') {
        service = this.BATTERY_SERVICE;
        characteristic = this.BATTERY_CHARACTERISTIC;
      } else if (propertyKey === 'firmware_version') {
        service = this.DATA_SERVICE;
        characteristic = this.HARDWARE_CHARACTERISTIC_UUID;
      } else {
        service = this.DATA_SERVICE;
        characteristic = this.READ_UUID;
      }
      bluetoothLe.BleClient.read(deviceId, service, characteristic)
        .then((value) => {
          if (propertyKey === 'battery') {
            resolve(value.getUint8(0).toString());
          } else if (propertyKey === 'firmware_version') {
            let data = ab2str(value.buffer);
            resolve(data);
          } else {
            resolve('');
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  async getAllBarcodeProperties(deviceId) {
    return new Promise((resolve, reject) => {
      const address = PROPERTIES_CONFIG['Codabar'];
      this.getAddrInfo(deviceId, address.addr, 2)
        .then((resp) => {
          const map = new Map();
          let value = (resp[4] & 0xff).toString(2);
          if (value.length < 8) {
            value = '0'.repeat(8 - value.length) + value;
          }
          map.set('Codabar', value.slice(7, 8));
          map.set('IATA 25', value.slice(6, 7));
          map.set('Interleaved 25', value.slice(5, 6));
          map.set('Matrix 25', value.slice(4, 5));
          map.set('Standard 25', value.slice(3, 4));
          map.set('Code 39', value.slice(2, 3));
          map.set('Code 93', value.slice(1, 2));
          map.set('Code 128', value.slice(0, 1));
          value = (resp[5] & 0xff).toString(2);
          if (value.length < 8) {
            value = '0'.repeat(8 - value.length) + value;
          }
          map.set('EAN-8', value.slice(7, 8));
          map.set('EAN-13', value.slice(6, 7));
          map.set('UPC-A', value.slice(5, 6));
          map.set('UPC-E0', value.slice(4, 5));
          map.set('MSI', value.slice(3, 4));
          map.set('Code 11', value.slice(2, 3));
          map.set('Chinese Post', value.slice(1, 2));
          map.set('UPC-E1', value.slice(0, 1));
          const address = PROPERTIES_CONFIG['USPS/FedEx'];
          this.getAddrInfo(deviceId, address.addr, 0)
            .then((resp) => {
              value = (resp[4] & 0xff).toString(2);
              if (value.length < 8) {
                value = '0'.repeat(8 - value.length) + value;
              }
              map.set('USPS/FedEx', value.slice(0, 1));
              const address = PROPERTIES_CONFIG['Aztec'];
              this.getAddrInfo(deviceId, address.addr, 5)
                .then((resp) => {
                  value = (resp[4] & 0xff).toString(2);
                  if (value.length < 8) {
                    value = '0'.repeat(8 - value.length) + value;
                  }
                  map.set('Aztec', value.slice(7, 8));
                  map.set('Maxi', value.slice(6, 7));
                  value = (resp[5] & 0xff).toString(2);
                  if (value.length < 8) {
                    value = '0'.repeat(8 - value.length) + value;
                  }
                  map.set('Han Xin', value.slice(4, 5));
                  value = (resp[6] & 0xff).toString(2);
                  if (value.length < 8) {
                    value = '0'.repeat(8 - value.length) + value;
                  }
                  map.set('Data Matrix', value.slice(4, 5));
                  value = (resp[7] & 0xff).toString(2);
                  if (value.length < 8) {
                    value = '0'.repeat(8 - value.length) + value;
                  }
                  map.set('QR Code', value.slice(4, 5));
                  value = (resp[8] & 0xff).toString(2);
                  if (value.length < 8) {
                    value = '0'.repeat(8 - value.length) + value;
                  }
                  map.set('PDF 417', value.slice(4, 5));
                  const address = PROPERTIES_CONFIG['GS1-128'];
                  this.getAddrInfo(deviceId, address.addr, 0)
                    .then((resp) => {
                      value = (resp[4] & 0xff).toString(2);
                      if (value.length < 8) {
                        value = '0'.repeat(8 - value.length) + value;
                      }
                      map.set('GS1-128', value.slice(3, 4));
                      const arr = Array.from(map, ([key, value]) => ({ [key]: value }));
                      const jsonString = JSON.stringify(arr.reduce((acc, cur) => Object.assign(acc, cur), {}));
                      resolve(jsonString);
                    })
                    .catch((err) => {
                      reject(err);
                    });
                })
                .catch((err) => {
                  reject(err);
                });
            })
            .catch((err) => {
              reject(err);
            });
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  async editPropertiesInfoByKey(deviceId, propertyKey, data) {
    return new Promise((resolve, reject) => {
      // @ts-ignore
      const address = PROPERTIES_CONFIG[propertyKey];
      if (address.bit_length > 0) {
        this.getAddrInfo(deviceId, address.addr, 0)
          .then((resp) => {
            let value = (resp[4] & 0xff).toString(2);
            if (value.length < 8) {
              value = '0'.repeat(8 - value.length) + value;
            }
            let result = '';
            if (address.bit > 0) {
              result = value.substring(0, address.bit);
            }
            result += data.toString();
            if (address.bit + address.bit_length < 8) {
              result += value.substring(address.bit + address.bit_length);
            }
            const result_temp = parseInt(result, 2);
            data = result_temp.toString();
          })
          .catch((err) => {
            reject(err);
          });
      }
      this.setAddrInfo(deviceId, address.addr, 0xf3, data, address.model)
        .then((resp) => {
          if (resp[2] === 0) {
            resolve('success');
          } else {
            reject('fail');
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  async getPropertiesInfoByKey(deviceId, propertyKey) {
    return new Promise((resolve, reject) => {
      // @ts-ignore
      const address = PROPERTIES_CONFIG[propertyKey];
      this.getAddrInfo(deviceId, address.addr, 0)
        .then((data) => {
          if (propertyKey === 'cache') {
            //特殊处理缓存
            resolve(data[7].toString());
          } else if (address.bit_length === 0) {
            //可读单地址
            resolve(data[4].toString());
          } else {
            //二进制
            let value = (data[4] & 0xff).toString(2);
            if (value.length < 8) {
              // 不足8位补0
              value = '0'.repeat(8 - value.length) + value;
            }
            const temp = value.substring(address.bit, address.bit + address.bit_length);
            resolve(temp.toString());
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  async validateApp(deviceId, appInfo) {
    return new Promise((resolve, reject) => {
      const appId_byte = stringToByte(appInfo.appId);
      let msg = [...appId_byte, 0x00];
      const developerId_byte = stringToByte(appInfo.developerId);
      msg = [...msg, ...developerId_byte, 0x00];
      const appKey_byte = stringToByte(appInfo.appKey);
      msg = [...msg, ...appKey_byte];
      const device_data = this.deviceMap.get(deviceId);
      this.setAddrInfo(deviceId, [], 0xf1, msg, 3)
        .then(() => {
          //device_data.hasAuthorized = true
          this.deviceMap.set(deviceId, device_data);
          resolve();
        })
        .catch((err) => {
          //device_data.hasAuthorized = false
          this.deviceMap.set(deviceId, device_data);
          reject(err);
        });
    });
  }
  async setAddrInfo(deviceId, addr, prefix, data, mode) {
    this.setAddrData = [];
    return new Promise((resolve, reject) => {
      let msg = [];
      let hasFail = false;
      let err_msg = '';
      if (mode == 1) {
        const strLength = 3;
        msg = [prefix, strLength];
        addr.forEach((item) => {
          msg.push(item);
        });
        msg.push(parseInt(data.toString(), 16));
      } else if (mode == 2) {
        const strLength = data.toString().length + addr.length;
        msg = [prefix, strLength];
        addr.forEach((item) => {
          msg.push(item);
        });
        const data_byte = stringToByte(data.toString());
        msg = [...msg, ...data_byte];
      } else if (mode == 3) {
        msg = [prefix];
        const strLength = data.length;
        if (strLength < 255) {
          msg.push(0);
          msg.push(strLength);
        } else {
          let hex_str = strLength.toString(16);
          hex_str = hex_str.padStart(4, '0');
          msg.push(parseInt(hex_str.slice(0, 2), 16));
          msg.push(parseInt(hex_str.slice(-2), 16));
        }
        msg = [...msg, ...data];
      }
      msg.push(getCheckSum(msg));
      const chunk_data = chunkArr(msg, 20);
      setTimeout(async () => {
        let resp = [];
        for (let i = 0; i < chunk_data.length; i++) {
          const item = chunk_data[i];
          const delayTimer = i == chunk_data.length - 1 ? true : false;
          let write_result = false;
          await this.writeAddrInfo(
            deviceId,
            mode == 3 ? this.AUTHENTICATION_CHARACTERISTIC : this.WRITE_CHARACTERISTIC,
            item,
            delayTimer,
          )
            .then((result) => {
              write_result = true;
              resp = result;
            })
            .catch((err) => {
              err_msg = err;
              write_result = false;
            });
          if (!write_result) {
            hasFail = true;
            break;
          }
        }
        if (hasFail) {
          reject(err_msg);
        } else {
          resolve(resp);
        }
      });
    });
  }
  async getAddrInfo(deviceId, addr, continuousLength) {
    return new Promise((resolve, reject) => {
      this.readAddrData = [];
      this.retryNumber = 0;
      const msg = [0xf2];
      if (continuousLength > 0) {
        //连读长度
        msg.push(addr.length + 1);
      } else {
        msg.push(addr.length);
      }
      addr.forEach((item) => {
        msg.push(item);
      });
      if (continuousLength > 0) {
        msg.push(continuousLength);
      }
      msg.push(getCheckSum(msg));
      const value = bluetoothLe.numbersToDataView(msg);
      this.retryNumber = 1;
      bluetoothLe.BleClient.writeWithoutResponse(deviceId, this.DATA_SERVICE, this.WRITE_CHARACTERISTIC, value)
        .then(() => {
          this.handleReadDataChange(1)
            .then((data) => {
              resolve(data);
            })
            .catch((err) => {
              reject(err);
            });
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  async writeAddrInfo(deviceId, characteristic, data, delayTimer) {
    return new Promise((resolve, reject) => {
      const value = bluetoothLe.numbersToDataView(data);
      bluetoothLe.BleClient.writeWithoutResponse(deviceId, this.DATA_SERVICE, characteristic, value)
        .then(() => {
          if (delayTimer) {
            this.retryNumber = 1;
            this.handleReadDataChange(2)
              .then((data) => {
                resolve(data);
              })
              .catch((err) => {
                reject(err);
              });
          } else {
            resolve([]);
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  async handleReadDataChange(mode) {
    return new Promise((resolve, reject) => {
      this.retryNumber += 1;
      if (mode == 1) {
        this.readDelayTimer && clearTimeout(this.readDelayTimer);
        this.readDelayTimer = setTimeout(() => {
          if (this.readAddrData.length > 0) {
            // const isFail = this.readAddrData.length > 0 ? this.readAddrData[2] : 1
            resolve(this.readAddrData);
          } else {
            if (this.retryNumber < this.retryCount) {
              this.handleReadDataChange(mode)
                .then((data) => {
                  resolve(data);
                })
                .catch((err) => {
                  reject(err);
                });
            } else {
              reject({ code: 2006, data: 'Failed to read data' });
            }
          }
        }, 50);
      } else if (mode == 2) {
        this.setDelayTimer && clearTimeout(this.setDelayTimer);
        this.setDelayTimer = setTimeout(() => {
          if (this.setAddrData.length > 0) {
            resolve(this.setAddrData);
          } else {
            if (this.retryNumber < this.retryCount) {
              this.handleReadDataChange(mode)
                .then((data) => {
                  resolve(data);
                })
                .catch((err) => {
                  reject(err);
                });
            } else {
              reject({ code: 2006, data: 'Failed to read data' });
            }
          }
        }, 50);
      } else {
        this.receiveDelayTimer && clearTimeout(this.receiveDelayTimer);
        this.receiveDelayTimer = setTimeout(() => {
          if (this.trailStatus == 0) {
            resolve(this.receiveData);
            this.trailStatus = 0;
            this.packetLen = 0;
            this.receiveData = '';
            this.originalData = [];
          } else {
            if (this.retryNumber < this.retryCount) {
              this.handleReadDataChange(mode)
                .then((data) => {
                  resolve(data);
                })
                .catch((err) => {
                  reject(err);
                });
            } else {
              this.trailStatus = 0;
              this.packetLen = 0;
              this.receiveData = '';
              this.originalData = [];
              reject();
            }
          }
        }, 50);
      }
    });
  }
  parseData(data) {
    // first data is 0xC1~0xC9
    if (data[0] >= 0xc1 && data[0] <= 0xc9 && this.trailStatus == 0) {
      this.packetLen = (data[0] - 0xc1) * 256 + data[1];
      this.receiveData = '';
      this.originalData = [];
      this.trailStatus = 1;
    }
    // merge array data
    this.originalData = [...this.originalData, ...data];
    // last data is checksum
    const last_data = this.originalData[this.originalData.length - 1];
    const check_arr = this.originalData.slice(0, this.originalData.length - 1);
    const check_sum = getCheckSum(check_arr);
    if (last_data == check_sum && this.originalData.length >= this.packetLen + 3) {
      this.receiveData = byteToString(this.originalData.slice(2, this.packetLen + 2));
      this.trailStatus = 0;
    }
  }
}
const ScannerManager = new ScannerManagerClass();

exports.ScannerManager = ScannerManager;
