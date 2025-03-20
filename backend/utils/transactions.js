const mongoose = require('mongoose');
const logger = require('../middleware/logger');

/**
 * Execute a function within a MongoDB transaction
 * @param {Function} fn - The function to execute (receives session as parameter)
 * @returns {Promise<any>} - Result of the transaction
 */
const withTransaction = async (fn) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const result = await fn(session);
    await session.commitTransaction();
    logger.info('Transaction committed successfully');
    return result;
  } catch (error) {
    await session.abortTransaction();
    logger.error(`Transaction aborted: ${error.message}`);
    throw error;
  } finally {
    session.endSession();
  }
};

module.exports = {
  withTransaction,
};