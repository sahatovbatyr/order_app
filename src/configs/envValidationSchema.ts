import * as Joi from 'joi';
import { EnvConfigEnum } from '../enums/EnvConfigEnum';

export const envValidationSchema = Joi.object({
  [EnvConfigEnum.HOST_PORT]: Joi.number().default(3000),
  [EnvConfigEnum.DB_HOST]: Joi.string().required(),
  [EnvConfigEnum.DB_PORT]: Joi.number().default(5432),
  [EnvConfigEnum.DB_USERNAME]: Joi.string().required(),
  [EnvConfigEnum.DB_PASSWORD]: Joi.string().required(),
  [EnvConfigEnum.DB_NAME]: Joi.string().required(),
  [EnvConfigEnum.REDIS_HOST]: Joi.string().required(),
  [EnvConfigEnum.REDIS_PORT]: Joi.number().default(6379),
  [EnvConfigEnum.JWT_SECRET]: Joi.string().required(),
  [EnvConfigEnum.JWT_EXPIRATION]: Joi.string().default('1h'),
  [EnvConfigEnum.STRIPE_SECRET_KEY]: Joi.string().required(),
  [EnvConfigEnum.STRIPE_WEBHOOK_SECRET]: Joi.string().required(),
  [EnvConfigEnum.ELASTICSEARCH_NODE]: Joi.string().required(),
  [EnvConfigEnum.ELASTICSEARCH_USERNAME]: Joi.string().optional(),
  [EnvConfigEnum.ELASTICSEARCH_PASSWORD]: Joi.string().optional(),
  [EnvConfigEnum.LOGSTASH_HOST]: Joi.string().required(),
  [EnvConfigEnum.LOGSTASH_PORT]: Joi.number().default(5000),
  [EnvConfigEnum.THROTTLE_TTL]: Joi.number().default(60),
  [EnvConfigEnum.THROTTLE_LIMIT]: Joi.number().default(100),
});
