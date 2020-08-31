/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var token = null;

var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        this.$actionEl = document.getElementById('detectAction');
    },
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        let instance = null;
        const callback = this.handleDetectCb.bind(this);
        let _self = this;
        document.getElementById('initBtn').addEventListener('click', function () {
          instance = new YidunGuardian({
            productNumber: '从易盾申请的productNumber',
            isCollectApk: true,
            isCollectSensor: true
          }, callback);
        });
        document.getElementById('getTokenBtn').addEventListener('click', function () {
          instance && instance.getToken();
        });
        document.getElementById('copyTokenBtn').addEventListener('click', function () {
          cordova.plugins.clipboard.copy(token || '');
          alert(`copy token: ${token || ''}`)          
        });
        document.getElementById('openSeniorCollectBtn').addEventListener('click', function () {
          instance && instance.setSeniorCollectStatus(true);
          _self.$actionEl.innerText = '提示：开启传感器数据采集';
        });
        document.getElementById('closeSeniorCollectBtn').addEventListener('click', function () {
          instance && instance.setSeniorCollectStatus(false);
          _self.$actionEl.innerText = '提示：关闭传感器数据采集';
        });
    },

    handleDetectCb: function (ev) {
        // 初始化反作弊
        if (ev['is_init_success'] === true) {
          this.$actionEl.innerText = '提示：初始化成功'
          return
        } else if (ev['is_init_success'] === false) {
          this.$actionEl.innerText = `初始化失败：${ev['msg']}`
          return
        }

        // getToken
        if (ev['is_get_token_success'] === true) {
          this.$actionEl.innerText = `token：${ev['token']}`
          token = ev['token']
          // do something ....
          return
        } else if (ev['is_get_token_success'] === false) {
          this.$actionEl.innerText = `getToken失败：${ev['msg']}`
          return
        }
    }
};

app.initialize();