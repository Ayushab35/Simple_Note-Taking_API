const constants = require('../constants');

const errorHandler = (err, req, res, next) =>{
    const statusCode = res.statusCode ? res.statusCode : 500;
    // next();
    switch(statusCode){
        case constants.VALIDATION_ERROR:
            res.json({title:"Validation error", message : err.message, stackTrace: err.stack});
            break;
        case constants.UNAUTHORISED:
            res.json({title:"un authorised", message : err.message, stackTrace: err.stack});
            break;
        case constants.NOT_FOUND:
            res.json({title:"Not found", message : err.message, stackTrace: err.stack});
            break;
        case constants.FORBIDDEN:
            res.json({title:"Forbidden", message : err.message, stackTrace: err.stack});
            break;
        case constants.SERVER_ERROR:
            res.json({title:"server error", message : err.message, stackTrace: err.stack});
            break;
        default:
            res.json({message: "No Error !"});
            break;
    }
}

module.exports = {errorHandler};