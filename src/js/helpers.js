import { TIMEOUT_SEC } from './config';
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 5000);
  });
};
export const AJAX = async function (API_URL, uploadData = undefined) {
  try {
    let fetchPro = uploadData
    ? fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(uploadData),
      })
    : fetch(API_URL);

    let res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) throw new Error(res.status);
    return data;
  } catch (error) {
    throw error;
  }
  
};
//export const getJSON = async function (API_URL, id) {
//  try {
//    let fetchUrl = fetch(`${API_URL}/${id}`);
//    let res = await Promise.race([fetchUrl, timeout(TIMEOUT_SEC)]);
//    const data = await res.json();
//    if (!res.ok) throw new Error(res.status);
//    return data;
//  } catch (error) {
//    throw error;
//  }
//};
//export const sentJSON = async function (API_URL, uploadData) {
//  try {
//    let fetchUrl = fetch(API_URL, {
//      method: 'POST',
//      headers: {
//        'Content-Type': 'application/json',
//      },
//      body: JSON.stringify(uploadData),
//    });
//    let res = await Promise.race([fetchUrl, timeout(TIMEOUT_SEC)]);
//    const data = await res.json();
//    if (!res.ok) throw new Error(res.status);
//    return data;
//  } catch (error) {
//    throw error;
//  }
//};
