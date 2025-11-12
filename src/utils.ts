export export function ab2str(buffer: ArrayBuffer) {
  const uint8Array = new Uint8Array(buffer);
  let str = '';
  for (const item of uint8Array) {
    str += String.fromCharCode(item);
  }
  return str;
}
export function getCheckSum(arr: number[]) {
  let sum = 0;
  arr.forEach((item) => {
    sum += parseInt(item.toString());
  });
  return sum % 256;
}
export function stringToByte(str: string) {
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
export function byteToString(arr: number[] | string) {
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
export function chunkArr(arr: number[], num: number) {
  // 首先创建一个新的空数组。用来存放分割好的数组
  const newArr = [];
  // 注意：这里与for循环不太一样的是，没有i++
  for (let i = 0; i < arr.length; ) {
    newArr.push(arr.slice(i, (i += num)));
  }
  return newArr;
}
