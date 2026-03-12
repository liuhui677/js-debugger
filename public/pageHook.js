/* 运行在原始页面环境中的 hook 脚本
 * 这里的 window 就是页面自己的 window
 */

(function () {
  'use strict';

  /**
   * 监听对象属性变化
   * @param {Object} obj 要监听的对象
   * @param {Array<string>} keys 需要输出日志的 key 列表，空数组表示所有 key
   */
  function watchObject(obj, keys = []) {
    Object.keys(obj).forEach((key) => {
      let internalValue = obj[key];

      Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get() {
          return internalValue;
        },
        set(newValue) {
          const oldValue = internalValue;
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

  /**
   * 监听数组修改
   * @param {Array} arr 要监听的数组
   */
  function watchArray(arr) {
    const methods = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'];

    methods.forEach((method) => {
      const original = Array.prototype[method];

      Array.prototype[method] = function (...args) {
        const result = original.apply(this, args);
        if (this === arr) {
          console.log(`数组被 ${method} 修改，修改前：`, [...this]);
        }
        return result;
      };
    });

    Object.keys(arr).forEach((key) => {
      if (!isNaN(key)) {
        defineReactive(arr, key);
      }
    });
  }

  function defineReactive(obj, key) {
    let value = obj[key];
    Object.defineProperty(obj, key, {
      get() {
        return value;
      },
      set(newVal) {
        console.log(`数组下标 ${key} 被修改：`, value, '→', newVal);
        value = newVal;
      },
    });
  }

  // 暴露到原始页面的 window 上
  window.jsDebugger = {
    watchObject,
    watchArray,
  };
})();

