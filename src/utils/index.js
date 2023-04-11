import {
  parseTime
} from "./ruoyi";
import {
  downloadFile
} from "@/api";
/**
 * 表格时间格式化
 */
export function formatDate(cellValue) {
  if (cellValue == null || cellValue == "") return "";
  var date = new Date(cellValue);
  var year = date.getFullYear();
  var month =
    date.getMonth() + 1 < 10 ?
    "0" + (date.getMonth() + 1) :
    date.getMonth() + 1;
  var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
  var hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
  var minutes =
    date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
  var seconds =
    date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
  return (
    year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds
  );
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (("" + time).length === 10) {
    time = parseInt(time) * 1000;
  } else {
    time = +time;
  }
  const d = new Date(time);
  const now = Date.now();

  const diff = (now - d) / 1000;

  if (diff < 30) {
    return "刚刚";
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + "分钟前";
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + "小时前";
  } else if (diff < 3600 * 24 * 2) {
    return "1天前";
  }
  if (option) {
    return parseTime(time, option);
  } else {
    return (
      d.getMonth() +
      1 +
      "月" +
      d.getDate() +
      "日" +
      d.getHours() +
      "时" +
      d.getMinutes() +
      "分"
    );
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function getQueryObject(url) {
  url = url == null ? window.location.href : url;
  const search = url.substring(url.lastIndexOf("?") + 1);
  const obj = {};
  const reg = /([^?&=]+)=([^?&=]*)/g;
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1);
    let val = decodeURIComponent($2);
    val = String(val);
    obj[name] = val;
    return rs;
  });
  return obj;
}

/**
 * @param {string} input value
 * @returns {number} output value
 */
export function byteLength(str) {
  // returns the byte length of an utf8 string
  let s = str.length;
  for (var i = str.length - 1; i >= 0; i--) {
    const code = str.charCodeAt(i);
    if (code > 0x7f && code <= 0x7ff) s++;
    else if (code > 0x7ff && code <= 0xffff) s += 2;
    if (code >= 0xdc00 && code <= 0xdfff) i--;
  }
  return s;
}

/**
 * @param {Array} actual
 * @returns {Array}
 */
export function cleanArray(actual) {
  const newArray = [];
  for (let i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i]);
    }
  }
  return newArray;
}

/**
 * @param {Object} json
 * @returns {Array}
 */
export function param(json) {
  if (!json) return "";
  return cleanArray(
    Object.keys(json).map(key => {
      if (json[key] === undefined) return "";
      return encodeURIComponent(key) + "=" + encodeURIComponent(json[key]);
    })
  ).join("&");
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = decodeURIComponent(url.split("?")[1]).replace(/\+/g, " ");
  if (!search) {
    return {};
  }
  const obj = {};
  const searchArr = search.split("&");
  searchArr.forEach(v => {
    const index = v.indexOf("=");
    if (index !== -1) {
      const name = v.substring(0, index);
      const val = v.substring(index + 1, v.length);
      obj[name] = val;
    }
  });
  return obj;
}

/**
 * @param {string} val
 * @returns {string}
 */
export function html2Text(val) {
  const div = document.createElement("div");
  div.innerHTML = val;
  return div.textContent || div.innerText;
}

/**
 * Merges two objects, giving the last one precedence
 * @param {Object} target
 * @param {(Object|Array)} source
 * @returns {Object}
 */
export function objectMerge(target, source) {
  if (typeof target !== "object") {
    target = {};
  }
  if (Array.isArray(source)) {
    return source.slice();
  }
  Object.keys(source).forEach(property => {
    const sourceProperty = source[property];
    if (typeof sourceProperty === "object") {
      target[property] = objectMerge(target[property], sourceProperty);
    } else {
      target[property] = sourceProperty;
    }
  });
  return target;
}

/**
 * @param {HTMLElement} element
 * @param {string} className
 */
export function toggleClass(element, className) {
  if (!element || !className) {
    return;
  }
  let classString = element.className;
  const nameIndex = classString.indexOf(className);
  if (nameIndex === -1) {
    classString += "" + className;
  } else {
    classString =
      classString.substr(0, nameIndex) +
      classString.substr(nameIndex + className.length);
  }
  element.className = classString;
}

/**
 * @param {string} type
 * @returns {Date}
 */
export function getTime(type) {
  if (type === "start") {
    return new Date().getTime() - 3600 * 1000 * 24 * 90;
  } else {
    return new Date(new Date().toDateString());
  }
}
/**
 * 节流 多条触发，一定时间段执行一次
 * @param {Function} fn
 * @param {number} delay
 * @return {*}
 */
export function throttle(fn, delay, obj) {
  let valid = true;
  return function () {
    if (!valid) {
      //休息时间 暂不接客
      return false;
    }
    // 工作时间，执行函数并且在间隔期内把状态位设为无效
    valid = false;
    setTimeout(() => {
      (obj && fn()) || fn();
      valid = true;
    }, delay);
  };
}
/**
 * 防抖 多条事件一定时间内触发只执行一次
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result;

  const later = function () {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp;

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      }
    }
  };

  return function (...args) {
    context = this;
    timestamp = +new Date();
    const callNow = immediate && !timeout;
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }

    return result;
  };
}

/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 * @param {Object} source
 * @returns {Object}
 */
export function deepClone(source) {
  if (!source && typeof source !== "object") {
    throw new Error("error arguments", "deepClone");
  }
  const targetObj = source.constructor === Array ? [] : {};
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === "object") {
      targetObj[keys] = deepClone(source[keys]);
    } else {
      targetObj[keys] = source[keys];
    }
  });
  return targetObj;
}

/**
 * @param {Array} arr
 * @returns {Array}
 */
export function uniqueArr(arr) {
  return Array.from(new Set(arr));
}

/**
 * @returns {string}
 */
export function createUniqueString() {
  const timestamp = +new Date() + "";
  const randomNum = parseInt((1 + Math.random()) * 65536) + "";
  return (+(randomNum + timestamp)).toString(32);
}

/**
 * Check if an element has a class
 * @param {HTMLElement} elm
 * @param {string} cls
 * @returns {boolean}
 */
export function hasClass(ele, cls) {
  return !!ele.className.match(new RegExp("(\\s|^)" + cls + "(\\s|$)"));
}

/**
 * Add class to element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function addClass(ele, cls) {
  if (!hasClass(ele, cls)) ele.className += " " + cls;
}

/**
 * Remove class from element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function removeClass(ele, cls) {
  if (hasClass(ele, cls)) {
    const reg = new RegExp("(\\s|^)" + cls + "(\\s|$)");
    ele.className = ele.className.replace(reg, " ");
  }
}

export function makeMap(str, expectsLowerCase) {
  const map = Object.create(null);
  const list = str.split(",");
  for (let i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase ? val => map[val.toLowerCase()] : val => map[val];
}

export const exportDefault = "export default ";

export const beautifierConf = {
  html: {
    indent_size: "2",
    indent_char: " ",
    max_preserve_newlines: "-1",
    preserve_newlines: false,
    keep_array_indentation: false,
    break_chained_methods: false,
    indent_scripts: "separate",
    brace_style: "end-expand",
    space_before_conditional: true,
    unescape_strings: false,
    jslint_happy: false,
    end_with_newline: true,
    wrap_line_length: "110",
    indent_inner_html: true,
    comma_first: false,
    e4x: true,
    indent_empty_lines: true
  },
  js: {
    indent_size: "2",
    indent_char: " ",
    max_preserve_newlines: "-1",
    preserve_newlines: false,
    keep_array_indentation: false,
    break_chained_methods: false,
    indent_scripts: "normal",
    brace_style: "end-expand",
    space_before_conditional: true,
    unescape_strings: false,
    jslint_happy: true,
    end_with_newline: true,
    wrap_line_length: "110",
    indent_inner_html: true,
    comma_first: false,
    e4x: true,
    indent_empty_lines: true
  }
};

// 首字母大小
export function titleCase(str) {
  return str.replace(/( |^)[a-z]/g, L => L.toUpperCase());
}

// 下划转驼峰
export function camelCase(str) {
  return str.replace(/-[a-z]/g, str1 => str1.substr(-1).toUpperCase());
}

export function isNumberStr(str) {
  return /^[+-]?(0|([1-9]\d*))(\.\d+)?$/g.test(str);
}

/**
 * 原基础上新增的：2021年3月6号
 */
/**
 * BMMN插件依赖 debounceBpmn randomString
 */

export function debounceBpmn(fn, delay = 500) {
  let timer;
  return function (...args) {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    timer = setTimeout(fn.bind(this, ...args), delay);
  };
}

export function randomString(length = 8, chars) {
  let result = "";
  let charsString =
    chars || "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let i = length; i > 0; --i) {
    result += charsString[Math.floor(Math.random() * charsString.length)];
  }
  return result;
}

/**
 * 专用于通过上传文件接口上传的文件，根据上传的文件ID来下载文件。
 * 下载文件，返回的数据类型根据需求可以是 Blob类型，也可以是arraybuffer类型, 默认是Blob
 *  blob 是一个包含二进制数据的 Blob 对象，
    arraybuffer 是一个包含二进制数据的 JavaScript ArrayBuffer。
    
 * @param {Number} params
* @param {(string)} type
 */
export function downloadFun(params, type = "blob") {
  try {
    // const link = document.createElement("a");
    downloadFile(params, type)
      .then(res => {
        console.log(res);
        let name = decodeURI(
          res.headers["content-disposition"].split(";")[1].split("fileName=")[1]
        );
        name = decodeURIComponent(name);
        let blob;

        // 如果返回的arraybuffer就处理成blob, 创建Blob对象
        if (type === "arraybuffer") {
          blob = new Blob([res.data], {
            type: getFileTypeByName('.' + name.split('.')[1])
          });
        } else {
          blob = res.data;
        }

        console.log("name", name);
        console.log("blob", blob);

        //验证返回的数据是否是文件，
        isFileFlag(blob).then((res) => {
          console.log('返回数据是文件，并且下载成功')
        }).catch(console.log);

        //下载文件
        downloadHandleFile(blob, name);
      })
      .catch(res => {
        console.log(res);
      });
  } catch (error) {
    console.log(error)
  }
}

//传入文件后缀名，返回当前文件的blob对象的类型
function getFileTypeByName(type) {
  let typesObj = {
    ".3gp": "video/3gpp",
    ".apk": "application/vnd.android.package-archive",
    ".asf": "video/x-ms-asf",
    ".avi": "video/x-msvideo",
    ".bin": "application/octet-stream",
    ".bmp": "image/bmp",
    ".c": "text/plain",
    ".class": "application/octet-stream",
    ".conf": "text/plain",
    ".cpp": "text/plain",
    ".doc": "application/msword",
    ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ".xls": "application/vnd.ms-excel",
    ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ".exe": "application/octet-stream",
    ".gif": "image/gif",
    ".gtar": "application/x-gtar",
    ".gz": "application/x-gzip",
    ".h": "text/plain",
    ".htm": "text/html",
    ".html": "text/html",
    ".jar": "application/java-archive",
    ".java": "text/plain",
    ".jpeg": "image/jpeg",
    ".jpg": "image/jpeg",
    ".js": "application/x-javascript",
    ".log": "text/plain",
    ".m3u": "audio/x-mpegurl",
    ".m4a": "audio/mp4a-latm",
    ".m4b": "audio/mp4a-latm",
    ".m4p": "audio/mp4a-latm",
    ".m4u": "video/vnd.mpegurl",
    ".m4v": "video/x-m4v",
    ".mov": "video/quicktime",
    ".mp2": "audio/x-mpeg",
    ".mp3": "audio/x-mpeg",
    ".mp4": "video/mp4",
    ".mpc": "application/vnd.mpohun.certificate",
    ".mpe": "video/mpeg",
    ".mpeg": "video/mpeg",
    ".mpg": "video/mpeg",
    ".mpg4": "video/mp4",
    ".mpga": "audio/mpeg",
    ".msg": "application/vnd.ms-outlook",
    ".ogg": "audio/ogg",
    ".pdf": "application/pdf",
    ".png": "image/png",
    ".pps": "application/vnd.ms-powerpoint",
    ".ppt": "application/vnd.ms-powerpoint",
    ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ".prop": "text/plain",
    ".rc": "text/plain",
    ".rmvb": "audio/x-pn-realaudio",
    ".rtf": "application/rtf",
    ".sh": "text/plain",
    ".tar": "application/x-tar",
    ".tgz": "application/x-compressed",
    ".txt": "text/plain",
    ".wav": "audio/x-wav",
    ".wma": "audio/x-ms-wma",
    ".wmv": "audio/x-ms-wmv",
    ".wps": "application/vnd.ms-works",
    ".xml": "text/plain",
    ".z": "application/x-compress",
    ".zip": "application/x-zip-compressed",
  };

  return type ? typesObj[type] : "*/*"
}
// 传入文件对象，验证文件是否下载成功
function isFileFlag(data) {
  console.log('传入进来的值', data)
  return new Promise((resolve, reject) => {
    let fileReader = new FileReader();
    fileReader.onload = function () {
      try {
        console.log('最开始的返回值', this)
        let jsonData = JSON.parse(this.result);
        if (jsonData.code) {
          // 说明是普通对象数据，后台转换失败
          // to do something
          console.log('普通对象-----', jsonData)
          reject(jsonData);
        }
      } catch (err) {
        // 解析成对象失败，说明是正常的文件流
        console.log('文件对象-----')
        resolve(err);
      }
    };
    fileReader.readAsText(data);
  });
}
/**下载文件的具体操作
 * 接受一个blob对象或者file文件对象
 */
export function downloadHandleFile(obj, name) {
  //下载文件
  const link = document.createElement("a");
  let objectUrl = URL.createObjectURL(obj); // 创建URL
  link.href = objectUrl;
  link.download = name; // 自定义文件名
  link.click(); // 下载文件
  URL.revokeObjectURL(objectUrl); // 释放内存
}
/**
 * 上传组件的通用上传文件方法，专门于fileUploads组件搭配使用
 * 因为是在vue.prototype原型上加载的方法，
 * 所以this就是当前的页面，所以参数只用接收页面里的变量名称的key，通过this[key]去获取当前页面实际变量值
 * fileNames : 必填 Array 上传组件的名称集合
 * fileDatas : 必填 Array 和上面的集合排序一致，接收上传组件上传成功后返回的值（id）
 * fileDatasArr : 可选 如果存在就从fileDatasArr里面找fileDatas[i]的值；
 * 如：fileDatasArr不存在 fileDatas = [a] this[a] 获取值
 *     fileDatasArr存在 fileDatasArr = arr fileDatas = [a] this[arr][a] 获取值
 * */
export async function uploadFun({
  fileNames,
  fileDatas,
  fileDatasArr
}) {
  try {
    let fileRequests = fileNames.map(name => this.$refs[name].submitUpload());
    let data = await Promise.all(fileRequests);
    console.log('data', data)
    data.forEach((item, ind) => {
      // 有父数组
      if (fileDatasArr) {
        console.log([fileDatasArr], fileDatas[ind], this[fileDatasArr][fileDatas[ind]]);
        handle(item, fileDatas, this, ind, fileDatasArr);
      } else {
        console.log(fileDatas[ind], this[fileDatas[ind]]);
        handle(item, fileDatas, this, ind);
      }
      // 清空原来的数据，重新赋值
      function handle(file, childData, _this, index, parentData) {
        let _data;
        // parentData存在表示childData在一个对象里面
        if (parentData) {
          _this[parentData][childData[index]] = [];
          _data = _this[parentData][childData[index]];
        } else {
          _this[childData[index]] = [];
          _data = _this[childData[index]];
        }
        // 单个文件
        console.log('赋值fileDatas开始', file)
        if (file.id) {
          _data.push(file.id);
        } else {
          file.forEach((obj) => {
            _data.push(obj.id);
          })
        }
      }
    })
    return Promise.resolve('success');
  } catch (error) {
    // 如果错误类型 required 表示组件必填效验触发了，
    if (error.type === 'required') {
      // 警告提示 
      // this.$message({
      //   message: error.text,
      //   type: 'warning'
      // })
      // 错误提示
      console.log('提示错误', error)
      this.msgError(error.text);
    } else {
      console.log('提交后错误的返回值', error)
    }
  }
}
/**
 * 接受文件流，创建blob对象格式，设置文件类型，创建a标签下载
 * @param {(Promise)} promise 接受一个promise实例，里面值是文件流或者blob对象
 * @param {string} type 文件类型
 *  type可以是Blob类型，也可以是arraybuffer类型, 默认是Blob
 *  blob 是一个包含二进制数据的 Blob 对象，
    arraybuffer 是一个包含二进制数据的 JavaScript ArrayBuffer。
 */
export function exportOutFun(
  promise,
  type = "blob",
) {
  try {
    promise.then(res => {
        if (res.status == 200) {
          console.log(res);
          let name = res.headers["content-disposition"];
          // console.log(name)
          name = name.match(/=(\S*)./)[1];
          // console.log(name)
          // console.log(decodeURIComponent(name))
          name = decodeURIComponent(name).split(";")[0];

          let blob;

          // 如果返回的arraybuffer就处理成blob, 创建Blob对象
          if (type === "arraybuffer") {     
            blob = new Blob([res.data], {
              type: getFileTypeByName('.' + name.split('.')[1])
            });
          } else {
            blob = res.data;
          }
          console.log("name", name);
          console.log("blob", blob);
          
          //下载文件
          downloadHandleFile(blob, name);
        }
      })
      .catch(res => {
        console.log(res);
      });
  } catch (error) {}
}
/**
 *  数字格式化，为整数; bool为true的话，格式化掉-，避免有负数
 * @param {String} val
 * @param {Boolean} flag
 */
export function formMoneyInt(val, flag) {
  if (!val || val == "." || !isNumber(val) || val == "0") {
    return "";
  }
  // console.log(val);

  let intVal = "";
  if (val.indexOf(".") != "-1") {
    intVal = val.substring(val.indexOf("."), 0);
  } else {
    intVal = val;
  }

  let value = Math.round(parseFloat(intVal) * 100) / 100;
  // 格式化掉.后面的数字
  let xsd = value.toString().split(".")[0];

  //bool存在的话，格式化掉-，只能为正整数
  return flag ? (xsd.indexOf("-") === 0 ? xsd.slice(1) : xsd) : xsd;
}

/**
 * //验证是否为数字
 * @param {String} value
 */
export function isNumber(value) {
  var patrn = /^(-)?\d+(\.\d+)?$/;
  if (patrn.exec(value) == null || value == "") {
    return false;
  } else {
    return true;
  }
}

export function fomatDateFun(time, flag) {
  var str = "";
  if (time === null) {
    return str;
  }
  try {
    if (new Date(time) == "Invalid Date") {
      return time;
    }
  } catch (error) {
    return time;
  }
  // console.log('格式整理前' + time);
  // if (time.indexOf('T') !== -1) {
  //     time = time.replace('T', ' ');
  // }
  // time = time.substr(0, 19)
  // time = time.replace(/-/g, "\/");
  var date = new Date(time);
  var year = date.getFullYear();
  var month =
    date.getMonth() + 1 < 10 ?
    "0" + (date.getMonth() + 1) :
    date.getMonth() + 1;
  var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
  var hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
  var minutes =
    date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
  var seconds =
    date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
  // console.log('格式整理后' + date);

  // str = time.replace('T', ' ');
  // str = str.replace(/\..*/, '');
  if (flag === "minutes") {
    str = year + "-" + month + "-" + day + " " + hours + ":" + minutes;
  } else if (flag === "day") {
    str = year + "-" + month + "-" + day;
  } else {
    str =
      year +
      "-" +
      month +
      "-" +
      day +
      " " +
      hours +
      ":" +
      minutes +
      ":" +
      seconds;
  }
  // console.log(str);
  return str;
}
