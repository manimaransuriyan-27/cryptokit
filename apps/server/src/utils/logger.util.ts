import { appConfig } from '@/config/app.config';

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogMessage {
  level: LogLevel;
  message: string;
  timestamp: string;
  stack?: string;
  [key: string]: any;
}

class Logger {
  private formatMessage(level: LogLevel, message: unknown, meta?: object): LogMessage {
    const logBase: LogMessage = {
      level,
      message: '',
      timestamp: new Date().toISOString(),
      ...meta,
    };

    // Scenario A: Input is a native or Custom AppError Exception
    if (message instanceof Error) {
      logBase.message = message.message;
      logBase.stack = message.stack;
      // Capture custom properties from AppError (like statusCode or Zod error fields)
      if ('statusCode' in message) logBase.statusCode = (message as any).statusCode;
      if ('errors' in message) logBase.errors = (message as any).errors;
      return logBase;
    }

    // Scenario B: Input is a structural plain Object payload
    if (typeof message === 'object' && message !== null) {
      const msgObj = message as Record<string, any>;
      logBase.message = msgObj.message ? String(msgObj.message) : JSON.stringify(msgObj);
      return { ...logBase, ...msgObj };
    }

    // Scenario C: Input is a primitive structural type (string, number, boolean)
    logBase.message = String(message);
    return logBase;
  }

  private log(level: LogLevel, message: unknown, meta?: object): void {
    const logMessage = this.formatMessage(level, message, meta);

    if (appConfig.isDevelopment) {
      const colors = {
        info: '\x1b[36m',  // cyan
        warn: '\x1b[33m',  // yellow
        error: '\x1b[31m', // red
        debug: '\x1b[35m', // magenta
      };
      
      // In development, print readable structures with stacks if they exist
      console.log(
        `${colors[level]}[${level.toUpperCase()}]\x1b[0m [${logMessage.timestamp}] ${logMessage.message}`
      );
      if (logMessage.stack && level === 'error') {
        console.log(`\x1b[2m${logMessage.stack}\x1b[0m`); // Dimmed stack display
      }
    } else {
      // JSON streaming for production environments
      console.log(JSON.stringify(logMessage));
    }
  }

  info(message: unknown, meta?: object): void {
    this.log('info', message, meta);
  }

  warn(message: unknown, meta?: object): void {
    this.log('warn', message, meta);
  }

  error(message: unknown, meta?: object): void {
    this.log('error', message, meta);
  }

  debug(message: unknown, meta?: object): void {
    if (appConfig.isDevelopment) {
      this.log('debug', message, meta);
    }
  }
}

export const logger = new Logger();