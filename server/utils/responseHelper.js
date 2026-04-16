export const sendSuccess = (res, statusCode = 200, message = 'Success', data = null) => {
    const response = {
        success: true,
        message: message,
        timestamp: new Date().toISOString()
    };
    
    if (data) {
        response.data = data;
    }
    
    return res.status(statusCode).json(response);
};

export const sendError = (res, statusCode = 500, message = 'Internal Server Error', errors = null) => {
    const response = {
        success: false,
        message: message,
        timestamp: new Date().toISOString()
    };
    
    if (errors) {
        response.errors = errors;
    }
    
    return res.status(statusCode).json(response);
};

export const sendPaginated = (res, data, page, totalPages, totalItems) => {
    return res.status(200).json({
        success: true,
        data: data,
        pagination: {
            currentPage: page,
            totalPages: totalPages,
            totalItems: totalItems,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1
        },
        timestamp: new Date().toISOString()
    });
};