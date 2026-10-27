const { createApp } = require('./core/app');
const logger = require('./core/logger');

(async () => {
  const { ctx, server, shutdown } = await createApp();
  server.listen(ctx.config.port, () => {
    logger.info(`Server running: http://localhost:${ctx.config.port}`);
    logger.info(`Secret: ${ctx.config.secret.slice(0, 4)}*** (${ctx.config.totalSteps} steps)`);
  });

  const stop = async (sig) => {
    logger.info(`${sig} received. Shutting down...`);
    await shutdown();
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(1), 5000).unref();
  };

  process.on('SIGINT', () => stop('SIGINT'));
  process.on('SIGTERM', () => stop('SIGTERM'));
})().catch((e) => {
  console.error('Fatal:', e);
  process.exit(1);
});
