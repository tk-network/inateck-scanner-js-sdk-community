# inateck-scanner-js-sdk

A Inateck BLE Scanner module for Ionic react.

## Install

```bash
npm install inateck-scanner-js-sdk
npm install @capacitor-community/bluetooth-le
npx cap sync
```

### iOS

On iOS, add the `NSBluetoothAlwaysUsageDescription` to `Info.plist`, otherwise the app will crash when trying to use Bluetooth (see [here](https://developer.apple.com/documentation/corebluetooth)).

If the app needs to use Bluetooth while it is in the background, you also have to add `bluetooth-central` to `UIBackgroundModes` (for details see [here](https://developer.apple.com/documentation/bundleresources/information_property_list/uibackgroundmodes)).

`./ios/App/App/Info.plist`:

```diff
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>CFBundleDevelopmentRegion</key>
	<string>en</string>
  ...
+	<key>NSBluetoothAlwaysUsageDescription</key>
+	<string>Uses Bluetooth to connect and interact with peripheral BLE devices.</string>
+	<key>UIBackgroundModes</key>
+	<array>
+		<string>bluetooth-central</string>
+	</array>
</dict>
</plist>

```

### Android

On Android, no further steps are required to use the plugin (if you are using Capacitor 2, see [here](https://github.com/capacitor-community/bluetooth-le/blob/0.x/README.md#android)).

#### (Optional) Android 12 Bluetooth permissions

If your app targets Android 12 (API level 31) or higher and your app doesn't use Bluetooth scan results to derive physical location information, you can strongly assert that your app doesn't derive physical location. This allows the app to scan for Bluetooth devices without asking for location permissions. See the [Android documentation](https://developer.android.com/guide/topics/connectivity/bluetooth/permissions#declare-android12-or-higher).

The following steps are required to scan for Bluetooth devices without location permission on Android 12 devices:

- In `android/variables.gradle`, make sure `compileSdkVersion` and `targetSdkVersion` are at least 31 (changing those values can have other consequences on your app, so make sure you know what you're doing).
- Make sure you have JDK 11+ (it is recommended to use JDK that comes with Android Studio).
- In `android/app/src/main/AndroidManifest.xml`, add `android:exported="true"` to your activity if not already added (setting [`android:exported`](https://developer.android.com/guide/topics/manifest/activity-element#exported) is required in apps targeting Android 12 and higher).
- In `android/app/src/main/AndroidManifest.xml`, update the permissions:
  ```diff
      <!-- Permissions -->
  +   <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" android:maxSdkVersion="30" />
  +   <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" android:maxSdkVersion="30" />
  +   <uses-permission android:name="android.permission.BLUETOOTH_SCAN"
  +     android:usesPermissionFlags="neverForLocation"
  +     tools:targetApi="s" />
  ```
- Set the `androidNeverForLocation` flag to `true` when initializing the `ScannerManager`.
  ```ts
  import {ScannerManager} from "inateck-scanner-js-sdk"
  await ScannerManager.initialize({ androidNeverForLocation: true });
  ```

> [_Note_: If you include neverForLocation in your android:usesPermissionFlags, some BLE beacons are filtered from the scan results.](https://developer.android.com/guide/topics/connectivity/bluetooth/permissions#assert-never-for-location)


## Usage
```typescript
import {ScannerManager} from "inateck-scanner-js-sdk"

async function connectScanner(){
  try {
    await ScannerManager.initialize({ androidNeverForLocation: true });
    ScannerManager.startScan().then((list)=>{
      if(list.length>0){
        const appInfo = {
          appId: 'M693be162686a',
          developerId: 'bb57d8e1-f911-47ba-b510-693be162686a',
          appKey: 'MC0CFQC85w0MsxDng4wHBICX7+iCOiSqfAIUdSerA4/MJ2kYBGAGgIG/YHemNr8=',

        }
        ScannerManager.connect(list[0].device.deviceId,appInfo,(value)=>{
          console.log(value)
        }).then((data)=>{
          console.log(data)
          ScannerManager.getBasicProperties(list[0].device.deviceId,"firmware_version").then((data)=>{
            console.log("firmware_version "+data)
          })
          ScannerManager.getBasicProperties(list[0].device.deviceId,"battery").then((data)=>{
            console.log("readBatteryLevel "+data)
          })
        }).catch((err) => {
          console.error(err);
        })
      }
    }).catch((err) => {
      console.error(err);
    })
  } catch (error) {
    console.error(error);
  }
}

async function updateIlluminationControl(deviceId:string){
  ScannerManager.editPropertiesInfoByKey(deviceId,"lighting_lamp_control","01").then((data)=>{
    console.log("update Illumination Control "+data)
  }).catch((err) => {
    console.error(err);
  })
}

async function cleanCache(deviceId:string){
  ScannerManager.editPropertiesInfoByKey(deviceId,"cache","0").then((data)=>{
    console.log("clean Cache "+data)
  }).catch((err) => {
    console.error(err);
  })
}

async function getBarcodesTypeSetting(deviceId:string){
  ScannerManager.getAllBarcodeProperties(deviceId).then((data)=>{
    console.log(data)
  }).catch((err) => {
    console.error(err);
  })
}

async function hasAutoUpdateCache(deviceId:string){
  ScannerManager.getPropertiesInfoByKey(deviceId,"auto_upload_cache").then((data)=>{
    console.log(data)
  }).catch((err) => {
    console.error(err);
  })
}
```

## API

<docgen-index>

* [`initialize(...)`](#initialize)
* [`startScan(...)`](#startscan)
* [`stopScan()`](#stopscan)
* [`connect(...)`](#connect)
* [`disconnect(...)`](#disconnect)
* [`getBasicProperties(...)`](#getbasicproperties)
* [`getAllBarcodeProperties(...)`](#getallbarcodeproperties)
* [`editPropertiesInfoByKey(...)`](#editpropertiesinfobykey)
* [`getPropertiesInfoByKey(...)`](#getpropertiesinfobykey)
* [Interfaces](#interfaces)
* [Enums](#enums)

</docgen-index>

<docgen-api>
<!--Update the source file JSDoc comments and rerun docgen to update the docs below-->

### initialize(...)

```typescript
initialize(options?: InitializeOptions | undefined) => Promise<void>
```

Initialize Bluetooth Low Energy (BLE). If it fails, BLE might be unavailable on this device.
On **Android** it will ask for the location permission. On **iOS** it will ask for the Bluetooth permission.
For an example, see [usage](#usage).

| Param         | Type                                                            |
| ------------- | --------------------------------------------------------------- |
| **`options`** | <code><a href="#initializeoptions">InitializeOptions</a></code> |

--------------------


### startScan(...)

```typescript
startScan(seconds?: number | undefined) => Promise<ScanResult[]>
```

Init the module and Scan for availables peripherals.
Returns a Promise ScanResult[].

| Param         | Type                |
| ------------- | ------------------- |
| **`seconds`** | <code>number</code> |

**Returns:** <code>Promise&lt;ScanResult[]&gt;</code>

--------------------


### stopScan()

```typescript
stopScan() => Promise<void>
```

Stop scanning for BLE scanner

--------------------


### connect(...)

```typescript
connect(deviceId: string, appInfo: AppInfo, callback: (value: callbackResult) => void) => Promise<string>
```

Attempts to connect to a peripheral. In many cases if you can't connect you have to scan for the peripheral before.
the callbacks will be invoked when the device is disconnected or a barcode is received.Returns a Promise object.

| Param          | Type                                                                          |
| -------------- | ----------------------------------------------------------------------------- |
| **`deviceId`** | <code>string</code>                                                           |
| **`appInfo`**  | <code><a href="#appinfo">AppInfo</a></code>                                   |
| **`callback`** | <code>(value: <a href="#callbackresult">callbackResult</a>) =&gt; void</code> |

**Returns:** <code>Promise&lt;string&gt;</code>

--------------------


### disconnect(...)

```typescript
disconnect(deviceId: string) => Promise<void>
```

Disconnect from a scanner.
Returns a Promise object.

| Param          | Type                |
| -------------- | ------------------- |
| **`deviceId`** | <code>string</code> |

--------------------


### getBasicProperties(...)

```typescript
getBasicProperties(deviceId: string, propertyKey: string) => Promise<string>
```

Read the current battery level or firmware version of the specified scanner

| Param             | Type                | Description                                                   |
| ----------------- | ------------------- | ------------------------------------------------------------- |
| **`deviceId`**    | <code>string</code> |                                                               |
| **`propertyKey`** | <code>string</code> | The propertyKey parameter is' battery 'or' firmware_version ' |

**Returns:** <code>Promise&lt;string&gt;</code>

--------------------


### getAllBarcodeProperties(...)

```typescript
getAllBarcodeProperties(deviceId: string) => Promise<string>
```

get all barcode type settings

| Param          | Type                |
| -------------- | ------------------- |
| **`deviceId`** | <code>string</code> |

**Returns:** <code>Promise&lt;string&gt;</code>

--------------------


### editPropertiesInfoByKey(...)

```typescript
editPropertiesInfoByKey(deviceId: string, propertyKey: string, data: string) => Promise<string>
```

Modify data based on key

| Param             | Type                | Description                         |
| ----------------- | ------------------- | ----------------------------------- |
| **`deviceId`**    | <code>string</code> |                                     |
| **`propertyKey`** | <code>string</code> | [PropertyKeyList](#propertykeylist) |
| **`data`**        | <code>string</code> |                                     |

**Returns:** <code>Promise&lt;string&gt;</code>

--------------------


### getPropertiesInfoByKey(...)

```typescript
getPropertiesInfoByKey(deviceId: string, propertyKey: string) => Promise<string>
```

Get data based on key.

| Param             | Type                | Description                         |
| ----------------- | ------------------- | ----------------------------------- |
| **`deviceId`**    | <code>string</code> |                                     |
| **`propertyKey`** | <code>string</code> | [PropertyKeyList](#propertykeylist) |

**Returns:** <code>Promise&lt;string&gt;</code>

--------------------


### Interfaces


#### InitializeOptions

| Prop                          | Type                 | Description                                                                                                                                                                                                                                                                                                                                      | Default            |
| ----------------------------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------ |
| **`androidNeverForLocation`** | <code>boolean</code> | If your app doesn't use Bluetooth scan results to derive physical location information, you can strongly assert that your app doesn't derive physical location. (Android only) Requires adding 'neverForLocation' to AndroidManifest.xml https://developer.android.com/guide/topics/connectivity/bluetooth/permissions#assert-never-for-location | <code>false</code> |


#### ScanResult

| Prop                   | Type                                                              | Description                                                                                                                                                                                                                                                                                           |
| ---------------------- | ----------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`device`**           | <code><a href="#bledevice">BleDevice</a></code>                   | The peripheral device that was found in the scan. **Android** and **web**: `device.name` is always identical to `localName`. **iOS**: `device.name` is identical to `localName` the first time a device is discovered, but after connecting `device.name` is the cached GAP name in subsequent scans. |
| **`localName`**        | <code>string</code>                                               | The name of the peripheral device from the advertisement data.                                                                                                                                                                                                                                        |
| **`rssi`**             | <code>number</code>                                               | Received Signal Strength Indication.                                                                                                                                                                                                                                                                  |
| **`txPower`**          | <code>number</code>                                               | Transmit power in dBm. A value of 127 indicates that it is not available.                                                                                                                                                                                                                             |
| **`manufacturerData`** | <code>{ [key: string]: <a href="#dataview">DataView</a>; }</code> | Manufacturer data, key is a company identifier and value is the data.                                                                                                                                                                                                                                 |
| **`serviceData`**      | <code>{ [key: string]: <a href="#dataview">DataView</a>; }</code> | Service data, key is a service UUID and value is the data.                                                                                                                                                                                                                                            |
| **`uuids`**            | <code>string[]</code>                                             | Advertised services.                                                                                                                                                                                                                                                                                  |
| **`rawAdvertisement`** | <code><a href="#dataview">DataView</a></code>                     | Raw advertisement data (**Android** only).                                                                                                                                                                                                                                                            |


#### BleDevice

| Prop           | Type                  | Description                                                                                                                                       |
| -------------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`deviceId`** | <code>string</code>   | ID of the device, which will be needed for further calls. On **Android** this is the BLE MAC address. On **iOS** and **web** it is an identifier. |
| **`name`**     | <code>string</code>   | Name of the peripheral device.                                                                                                                    |
| **`uuids`**    | <code>string[]</code> |                                                                                                                                                   |


#### DataView

| Prop             | Type                                                |
| ---------------- | --------------------------------------------------- |
| **`buffer`**     | <code><a href="#arraybuffer">ArrayBuffer</a></code> |
| **`byteLength`** | <code>number</code>                                 |
| **`byteOffset`** | <code>number</code>                                 |

| Method         | Signature                                                                           | Description                                                                                                                                                         |
| -------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **getFloat32** | (byteOffset: number, littleEndian?: boolean \| undefined) =&gt; number              | Gets the Float32 value at the specified byte offset from the start of the view. There is no alignment constraint; multi-byte values may be fetched from any offset. |
| **getFloat64** | (byteOffset: number, littleEndian?: boolean \| undefined) =&gt; number              | Gets the Float64 value at the specified byte offset from the start of the view. There is no alignment constraint; multi-byte values may be fetched from any offset. |
| **getInt8**    | (byteOffset: number) =&gt; number                                                   | Gets the Int8 value at the specified byte offset from the start of the view. There is no alignment constraint; multi-byte values may be fetched from any offset.    |
| **getInt16**   | (byteOffset: number, littleEndian?: boolean \| undefined) =&gt; number              | Gets the Int16 value at the specified byte offset from the start of the view. There is no alignment constraint; multi-byte values may be fetched from any offset.   |
| **getInt32**   | (byteOffset: number, littleEndian?: boolean \| undefined) =&gt; number              | Gets the Int32 value at the specified byte offset from the start of the view. There is no alignment constraint; multi-byte values may be fetched from any offset.   |
| **getUint8**   | (byteOffset: number) =&gt; number                                                   | Gets the Uint8 value at the specified byte offset from the start of the view. There is no alignment constraint; multi-byte values may be fetched from any offset.   |
| **getUint16**  | (byteOffset: number, littleEndian?: boolean \| undefined) =&gt; number              | Gets the Uint16 value at the specified byte offset from the start of the view. There is no alignment constraint; multi-byte values may be fetched from any offset.  |
| **getUint32**  | (byteOffset: number, littleEndian?: boolean \| undefined) =&gt; number              | Gets the Uint32 value at the specified byte offset from the start of the view. There is no alignment constraint; multi-byte values may be fetched from any offset.  |
| **setFloat32** | (byteOffset: number, value: number, littleEndian?: boolean \| undefined) =&gt; void | Stores an Float32 value at the specified byte offset from the start of the view.                                                                                    |
| **setFloat64** | (byteOffset: number, value: number, littleEndian?: boolean \| undefined) =&gt; void | Stores an Float64 value at the specified byte offset from the start of the view.                                                                                    |
| **setInt8**    | (byteOffset: number, value: number) =&gt; void                                      | Stores an Int8 value at the specified byte offset from the start of the view.                                                                                       |
| **setInt16**   | (byteOffset: number, value: number, littleEndian?: boolean \| undefined) =&gt; void | Stores an Int16 value at the specified byte offset from the start of the view.                                                                                      |
| **setInt32**   | (byteOffset: number, value: number, littleEndian?: boolean \| undefined) =&gt; void | Stores an Int32 value at the specified byte offset from the start of the view.                                                                                      |
| **setUint8**   | (byteOffset: number, value: number) =&gt; void                                      | Stores an Uint8 value at the specified byte offset from the start of the view.                                                                                      |
| **setUint16**  | (byteOffset: number, value: number, littleEndian?: boolean \| undefined) =&gt; void | Stores an Uint16 value at the specified byte offset from the start of the view.                                                                                     |
| **setUint32**  | (byteOffset: number, value: number, littleEndian?: boolean \| undefined) =&gt; void | Stores an Uint32 value at the specified byte offset from the start of the view.                                                                                     |


#### ArrayBuffer

Represents a raw buffer of binary data, which is used to store data for the
different typed arrays. ArrayBuffers cannot be read from or written to directly,
but can be passed to a typed array or <a href="#dataview">DataView</a> Object to interpret the raw
buffer as needed.

| Prop             | Type                | Description                                                                     |
| ---------------- | ------------------- | ------------------------------------------------------------------------------- |
| **`byteLength`** | <code>number</code> | Read-only. The length of the <a href="#arraybuffer">ArrayBuffer</a> (in bytes). |

| Method    | Signature                                                                               | Description                                                     |
| --------- | --------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| **slice** | (begin: number, end?: number \| undefined) =&gt; <a href="#arraybuffer">ArrayBuffer</a> | Returns a section of an <a href="#arraybuffer">ArrayBuffer</a>. |


#### AppInfo

| Prop              | Type                |
| ----------------- | ------------------- |
| **`appId`**       | <code>string</code> |
| **`developerId`** | <code>string</code> |
| **`appKey`**      | <code>string</code> |


#### callbackResult

| Prop       | Type                | Description                                     |
| ---------- | ------------------- | ----------------------------------------------- |
| **`type`** | <code>number</code> | Event type 1 is barcode 2 is scanner disconnect |
| **`data`** | <code>string</code> | Type 1 returns barcode, type 2 returns deviceId |


### Enums


#### PropertyKeyList

| Members                                | Description                                                                         |
| -------------------------------------- | ----------------------------------------------------------------------------------- |
| **`"cache"`**                          | read barcode cache quantity or clean barcode cache value is 0                       |
| **`"restore_factory"`**                | Restore factory settings value is 1                                                 |
| **`"enable_or_disable_all_barcodes"`** | enable or disable all barcodes 1 is enable 0 is disable                             |
| **`"restore_default_barcode"`**        | restore default barcode type value is 1                                             |
| **`"bluetooth_name"`**                 | read/update bluetooth name key                                                      |
| **`"volume"`**                         | read/update volume value 0 is mute, 2 is low, 4 is middle, 8 is loud                |
| **`"lighting_lamp_control"`**          | Illumination key value 00 is scanning, 01 is Stay on,10 is Stay off                 |
| **`"positioning_lamp_control"`**       | Navigation Light key value 00 is scanning, 01 is Stay on,10 is Stay off             |
| **`"shake_reminder"`**                 | Vibration reminder 0 is close,1 is open                                             |
| **`"shake_intensity"`**                | Vibration strength 0 is mute,1 is loud                                              |
| **`"position_light_twinkle"`**         | Navigation Light flashing 0 is close,1 is opens                                     |
| **`"start_up_clean_cache"`**           | This key Clear data from buffer at start-up 1 is enable 0 is disable                |
| **`"auto_upload_cache"`**              | This key Auto uploading barcode cache 1 is enable 0 is disable                      |
| **`"motor_swing_grade"`**              | Motor PWM vibration intensity level 1-8 value 0000,0001,0010, 0011，。。。。1000 is loud |
| **`"Codabar"`**                        | barcode type key value 1 is enable 0 is disable                                     |
| **`"Code 11"`**                        |                                                                                     |
| **`"Code 128"`**                       |                                                                                     |
| **`"Code 39"`**                        |                                                                                     |
| **`"Code 93"`**                        |                                                                                     |
| **`"GS1-128"`**                        |                                                                                     |
| **`"USPS/FedEx"`**                     |                                                                                     |
| **`"EAN-8"`**                          |                                                                                     |
| **`"EAN-13"`**                         |                                                                                     |
| **`"MSI"`**                            |                                                                                     |
| **`"UPC-A"`**                          |                                                                                     |
| **`"UPC-E0"`**                         |                                                                                     |
| **`"UPC-E1"`**                         |                                                                                     |
| **`"Chinese Post"`**                   |                                                                                     |
| **`"IATA 25"`**                        |                                                                                     |
| **`"Interleaved 25"`**                 |                                                                                     |
| **`"Matrix 25"`**                      |                                                                                     |
| **`"Standard 25"`**                    |                                                                                     |
| **`"QR Code"`**                        |                                                                                     |
| **`"Data Matrix"`**                    |                                                                                     |
| **`"PDF 417"`**                        |                                                                                     |
| **`"Aztec"`**                          |                                                                                     |
| **`"Maxi"`**                           |                                                                                     |
| **`"Han Xin"`**                        |                                                                                     |

</docgen-api>
