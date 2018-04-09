// 解析Search参数
export const queryString = {
  parse(url) {
    const parseObj = {};
    if (!url) {
      return false;
    }
    let argStr = '';
    if (url.split('?').length > 1) {
      argStr = url.split('?')[1];
      const argArr = argStr.split('&');
      argArr.forEach((val) => {
        const args = val.split('=');
        if (args.length > 1) {
          parseObj[args[0]] = args[1];
        }
      });
    }
    return parseObj;
  },
};

// 处理服务器错误信息
export function handleServerMsg(str) {
  const strArr = str.split(':');
  if (strArr.length === 2) {
    return strArr[1];
  } else {
    return strArr[0];
  }
}

// 处理服务器错误信息
export function handleServerMsgObj(obj) {
  if (typeof obj === 'object') {
    const objKeys = Object.keys(obj);
    return obj[objKeys[0]];
  } else if (typeof obj === 'string') {
    return handleServerMsg(obj);
  }
}
