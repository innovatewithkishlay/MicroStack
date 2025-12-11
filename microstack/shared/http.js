/**
 * Standard HTTP Response
 * @param {Response} res 
 * @param {number} statusCode 
 * @param {any} data 
 * @param {string} message 
 */
const success = (res, statusCode, data, message = 'Success') => {
    return res.status(statusCode).json({
        success: true,
        message,
        data
    });
};

/**
 * Standard HTTP Error
 * @param {Response} res 
 * @param {number} statusCode 
 * @param {string} message 
 */
const error = (res, statusCode, message = 'Error') => {
    return res.status(statusCode).json({
        success: false,
        message
    });
};

module.exports = { success, error };
