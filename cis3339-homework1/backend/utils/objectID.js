const OBJECT_ID = /^[0-9a-fA-F]{24}$/;

function isObjectId(value) {
    return typeof value === 'string' && OBJECT_ID.test(value);
}

// Used with router.param('id', ...) to reject malformed ids with a 400
function validateObjectIdParam(req, res, next, value) {
    if (!isObjectId(value)) {
        return res.status(400).json({ error: 'Invalid id' });
    }
    next();
}

function escapeRegex(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

module.exports = { isObjectId, validateObjectIdParam, escapeRegex };