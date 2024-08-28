/*
 * COPYRIGHT Ericsson 2024
 *
 *
 *
 * The copyright to the computer program(s) herein is the property of
 *
 * Ericsson Inc. The programs may be used and/or copied only with written
 *
 * permission from Ericsson Inc. or in accordance with the terms and
 *
 * conditions stipulated in the agreement/contract under which the
 *
 * program(s) have been supplied.
 */

import http from 'k6/http';

import { DEFAULT_TIMEOUT, MAX_RETRY } from './constants.js';

function httpPostJson(url, uri, request, params = {}, options = {}) {
    return httpPost(url, uri, JSON.stringify(request), params, options);
}

function httpPatchJson(url, uri, request, params = {}, options = {}) {
    return httpPatch(url, uri, JSON.stringify(request), params, options);
}

function httpDelete(url, uri, requestBody = undefined, params = {}, options = {}) {
      const timeout = options['timeout'] ? options['timeout'] : DEFAULT_TIMEOUT;
      params['timeout'] = timeout.toString().concat('s');
      logData('DELETE: '.concat(url.concat(uri)), params);

    const requestBodyJson = !requestBody ? undefined : JSON.stringify(requestBody);

      let response = {};
      let retryCount = 0;
      while (retryCount < MAX_RETRY) {
          response = http.del(url.concat(uri), requestBodyJson, params);
          if (response && response.status) {
              break;
          } else {
              retryCount += 1;
              logData('RETRY: '.concat(retryCount));
          }
      }

      logData('DELETE RESPONSE: ', response);
      return response;
}

function httpPost(url, uri, formData, params = {}, options = {}) {
    const timeout = options['timeout'] ? options['timeout'] : DEFAULT_TIMEOUT;
    params['timeout'] = timeout.toString().concat('s');
    logData('POST: '.concat(url.concat(uri)), formData);

    let response = {};
    let retryCount = 0;
    while (retryCount < MAX_RETRY) {
        response = http.post(url.concat(uri), formData, params);
        if (response && (response.body || response.status === 202)) {
            break;
        } else {
            retryCount += 1;
            logData('RETRY: '.concat(retryCount));
        }
    }

    if (!response || (![200,201,202].includes(response.status))) {
        logData('POST RESPONSE: ', response);
    }

    return response;
}

function httpPatch(url, uri, formData, params = {}, options = {}) {
    const timeout = options['timeout'] ? options['timeout'] : DEFAULT_TIMEOUT;
    params['timeout'] = timeout.toString().concat('s');
    logData('PATCH: '.concat(url.concat(uri)), formData);

    let response = {};
    let retryCount = 0;
    while (retryCount < MAX_RETRY) {
        response = http.patch(url.concat(uri), formData, params);
        if (response && response.body) {
            break;
        } else {
            retryCount += 1;
            logData('RETRY: '.concat(retryCount));
        }
    }

    logData('PATCH RESPONSE: ', response);
    return response;
}

function httpGet(url, uri, params = {}, options = {}) {
    const timeout = options['timeout'] ? options['timeout'] : DEFAULT_TIMEOUT;
    params['timeout'] = timeout.toString().concat('s');
    logData('GET: '.concat(url.concat(uri)), params);

    let response = {};
    let retryCount = 0;
    while (retryCount < MAX_RETRY) {
        response = http.get(url.concat(uri), params);
        if (response && response.status) {
            break;
        } else {
            retryCount += 1;
            logData('RETRY: '.concat(retryCount));
        }
    }

    if (!response || response.status !== 200) {
        logData('GET RESPONSE: ', response);
    }

    return response;
}

function httpFile(file, fileName) {
    return http.file(file, fileName)
}

function httpRequest(requestType, url, uri, formData, params = {}) {
    logData(requestType +': '.concat(url.concat(uri)), formData);

    let response = {};
    let retryCount = 0;
    while (retryCount < MAX_RETRY) {
        response = http.request(requestType, url.concat(uri), formData, params);
        if (response && response.body) {
            break;
        } else {
            retryCount += 1;
            logData('RETRY: '.concat(retryCount));
        }
    }

    logData(requestType + ' RESPONSE: ', response);
    return response;
}


function createSession(url, uri, body, headers, options) {
    console.log("createSession url -> " + url);
    const response = httpPostJson(url, uri, body, headers, options);
    const sessionId = response.status === 200 && response.body ? response.body : '';
    return 'JSESSIONID='.concat(sessionId);
}

function logData(message, data = '') {
    console.log("<<");
    console.log(new Date().toISOString(), message, data);
    console.log(">>");
}

function msToTime(duration) {
    var milliseconds = Math.floor(duration % 1000),
        seconds = Math.floor((duration / 1000) % 60),
        minutes = Math.floor((duration / (1000 * 60)) % 60),
        hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
}

//POST N request without printing the form data to the console.
function httpNPost(url, uri, formData, params = {}, options = {}) {
    const timeout = options['timeout'] ? options['timeout'] : DEFAULT_TIMEOUT;
    params['timeout'] = timeout.toString().concat('s');
    logData('POST: '.concat(url.concat(uri)));

    let response = {};
    let retryCount = 0;
    while (retryCount < MAX_RETRY) {
        response = http.post(url.concat(uri), formData, params);
        if (response && (response.body || response.status === 202)) {
            break;
        } else {
            retryCount += 1;
            logData('RETRY: '.concat(retryCount));
        }
    }

    if (!response || (![200,201,202].includes(response.status))) {
        logData('POST RESPONSE: ', response);
    }

    return response;
}

//Delete N without printing the response body to the console.
function httpNDelete(url, uri, requestBody = undefined, params = {}, options = {}) {
      const timeout = options['timeout'] ? options['timeout'] : DEFAULT_TIMEOUT;
      params['timeout'] = timeout.toString().concat('s');
      logData('DELETE: '.concat(url.concat(uri)), params);

    const requestBodyJson = !requestBody ? undefined : JSON.stringify(requestBody);

      let response = {};
      let retryCount = 0;
      while (retryCount < MAX_RETRY) {
          response = http.del(url.concat(uri), requestBodyJson, params);
          if (response && response.status) {
              break;
          } else {
              retryCount += 1;
              logData('RETRY: '.concat(retryCount));
          }
      }
      return response;
}

module.exports = {
    createSession,
    httpGet,
    httpPostJson,
    httpPatchJson,
    httpDelete,
    httpPost,
    httpFile,
    httpRequest,
    logData,
    msToTime,
    httpNPost,
    httpNDelete
}