/**
 * @constants
 * @description   : Hold CONSTANTS and APIs
 * @Created by    : smartData
 */

import axios from 'axios';
import Alert from 'react-s-alert';

/******************************* Define Pagination Constants *****************************/

export const PAGINATION_DEFAULT_LIMIT = '10';

/************************************* API CONSTANTS ***************************************/

// creating global instance for the axios to call apis
export const AXIOS_INSTANCE = axios.create();
AXIOS_INSTANCE.defaults.headers.post['Content-Type'] = 'application/json';


export const fetchApiHeaders = {
  'Content-Type': 'application/json'
};

export const jsonApiHeader = {'Content-Type': 'application/vnd.api+json'}
//--------------------------------------------------------------------------------------------

// Define APIS

// GET http://52.39.212.226:4070/quote
// POST http://52.39.212.226:4070/quote
// DELETE: http://52.39.212.226:4070/quote/{ID}


  /**
   * [getRequest description]
   * @param  {[type]} REQUEST [description]
   * @return {[type]}         [description]
   */
  export function getRequest( REQUEST ) {
       return {
        type : REQUEST
       }
  }

  /**
   * [getSuccess description]
   * @param  {[type]} SUCCESS [description]
   * @param  {[type]} data    [description]
   * @return {[type]}         [JSON]
   */
  export function getSuccess( SUCCESS, data ) {
       return {
         type : SUCCESS,
         payload : data
       }
  }

  /**
   * [getFailure description]
   * @param  {[type]} FAILURE [description]
   * @return {[type]}         [description]
   */
  export function getFailure( FAILURE, error ) {
     return {
       type : FAILURE,
        payload : error
     }
  }

   export function errorHandler( error ) {
    //console.log('error', error);
    // console.log('errorType', typeof error);
    // console.log('error', Object.assign({}, error));
    // console.log('getOwnPropertyNames', Object.getOwnPropertyNames(error));
    // console.log('stackProperty', Object.getOwnPropertyDescriptor(error, 'stack'));
    // console.log('messageProperty', Object.getOwnPropertyDescriptor(error, 'message').value);
    // console.log('stackEnumerable', error.propertyIsEnumerable('stack'));
    // console.log('messageEnumerable', error.propertyIsEnumerable('message'))

    

    Alert.error(error, {
        timeout: 10000,
        html: true
    });
  }


const REQUEST = 'REQUEST'
const SUCCESS = 'SUCCESS'
const FAILURE = 'FAILURE'

export function createRequestActionTypes (base) {
  return [REQUEST, SUCCESS, FAILURE].reduce((requestTypes, type) => {
    requestTypes[type] = `${base}_${type}`
    return requestTypes
  }, {})
}


export const SERVER_URL = `http://108.168.203.227`;//`http://52.39.212.226:4070`;
export const GET_MASTER_TABLES_DATA = `${SERVER_URL}/HC_Patient/api/MasterData/MasterDataByName`; // GET - /quoteData?symbol=AAPL&field=4+10+11

export function checkHttpStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response.json();
    } else {
        var error = new Error(response.statusText)
        error.response = response
        throw error
    }
}

export function parseJSON(response) {
      return response.data;
}

export function setLocalStorage(key, value) {
  localStorage.setItem(key,  value);
}

export function createFetchObj(formData, url) {
  let fetchObj = {};
  fetchObj.method='post'
  fetchObj.api_url = `${url}`;
  
  if(formData.id != "" && formData.id != null) {
    fetchObj.method='patch'
    fetchObj.api_url = `${url}?id=` + formData.id;
  } else {
    delete formData["id"];
  }

  fetchObj.formData = formData;

  return fetchObj
}