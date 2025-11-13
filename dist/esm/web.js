import { BleClient, numbersToDataView, dataViewToNumbers, numberToUUID } from '@capacitor-community/bluetooth-le';
import { PROPERTIES_CONFIG } from './address';
import { ab2str, stringToByte, getCheckSum, byteToString, chunkArr } from './utils';
class ScannerManagerClass {
  constructor() {
    this.scaning = false;
    this.deviceMap = new Map();
    this.DATA_SERVICE = numberToUUID(0xff00);
    this.DATA_CHARACTERISTIC = numberToUUID(0xff01);
    this.BATTERY_SERVICE = numberToUUID(0x180f);
    this.BATTERY_CHARACTERISTIC = numberToUUID(0x2a19);
    this.WRITE_CHARACTERISTIC = numberToUUID(0xff04);
    this.AUTHENTICATION_CHARACTERISTIC = numberToUUID(0xff05);
    this.HARDWARE_CHARACTERISTIC_UUID = numberToUUID(0xff02);
    this.READ_UUID = numberToUUID(0xff03);
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
    return BleClient.initialize(options);
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
        await BleClient.requestLEScan({ allowDuplicates: true }, (result) => {
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
            await BleClient.stopLEScan();
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
    return BleClient.stopLEScan();
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
          await BleClient.stopLEScan();
          this.scaning = false;
        }
        this.scaning = true;
        BleClient.connect(deviceId, (deviceId) => this.onDisconnect(deviceId, callback))
          .then(() => {
            BleClient.getServices(deviceId)
              .then(() => {
                this.startNotifications(deviceId, callback)
                  .then(() => {
                    this.scaning = false;
                    resolve(deviceId);
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
      BleClient.disconnect(deviceId)
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
    const data = dataViewToNumbers(value);
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
      BleClient.startNotifications(deviceId, this.DATA_SERVICE, this.DATA_CHARACTERISTIC, (value) => {
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
      BleClient.stopNotifications(deviceId, this.DATA_SERVICE, this.DATA_CHARACTERISTIC)
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
      BleClient.read(deviceId, service, characteristic)
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
      const value = numbersToDataView(msg);
      this.retryNumber = 1;
      BleClient.writeWithoutResponse(deviceId, this.DATA_SERVICE, this.WRITE_CHARACTERISTIC, value)
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
      const value = numbersToDataView(data);
      BleClient.writeWithoutResponse(deviceId, this.DATA_SERVICE, characteristic, value)
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
export const ScannerManager = new ScannerManagerClass();
