const formatResponse = ({success, message, error=null, data=null}) => {
    return {
        success,
        message,
        error,
        data
    }
}

module.exports = formatResponse