/**
 * 监听对象属性变化
 * @param {Object} obj 要监听的对象
 * @param {Function} onChange 变化回调函数 (key, oldValue, newValue) => {}
 */
function watchObject(obj, keys = []) {
  // 遍历对象所有自有属性
  Object.keys(obj).forEach((key) => {
    // 保存原始属性值
    let internalValue = obj[key];

    // 重新定义属性，劫持 getter 和 setter
    Object.defineProperty(obj, key, {
      enumerable: true, // 可枚举（保持原属性行为）
      configurable: true, // 可配置（保持原属性行为）
      // 读取属性时触发
      get() {
        // console.log(`读取属性：${key}，值：${internalValue}`);
        return internalValue;
      },
      // 修改属性时触发
      set(newValue) {
        const oldValue = internalValue;
        // 值发生变化才执行回调
        if (newValue !== oldValue) {
          internalValue = newValue;
          if (keys.length === 0 || keys.includes(key)) {
            console.log(`修改属性：${key}，旧值：`, oldValue);
            console.log(`修改属性：${key}，新值：`, newValue);
          }
        }
      },
    });
  });

  return obj;
}

// 假设你的数组变量名是 arr ！！！请替换成你实际的数组名

// 监听数组修改，自动断点
function watchArray(arr) {
  // 需要监听的会修改数组的方法
  const methods = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'];

  methods.forEach(method => {
    // 保存原始方法
    const original = Array.prototype[method];

    // 重写方法
    Array.prototype[method] = function (...args) {
      const result = original.apply(this, args);
      if (this === arr) {
        // ✨ 自动触发断点！代码会在这里暂停
        console.log(`数组被 ${method} 修改，修改前：`, [...this]);
      }

      return result;
    };
  });

  // 额外监听直接赋值修改：arr[index] = xxx
  Object.keys(arr).forEach(key => {
    if (!isNaN(key)) {
      defineReactive(arr, key);
    }
  });
}

// 监听数组下标直接赋值
function defineReactive(obj, key) {
  let value = obj[key];
  Object.defineProperty(obj, key, {
    get() {
      return value;
    },
    set(newVal) {
      // ✨ 直接赋值也会触发断点
      console.log(`数组下标 ${key} 被修改：`, value, '→', newVal);
      value = newVal;
    }
  });
}
