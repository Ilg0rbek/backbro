import {NODE_ENV, DB_HOST, DB_PORT, DB_DATABASE} from '@config';

console.log('DB_HOST', DB_HOST)
console.log('NODE_ENV', NODE_ENV)
export const dbConnection = {
  url: DB_HOST, //!= 'production' ? `mongodb://${DB_HOST}:${DB_PORT}/${DB_DATABASE}` : DB_HOST,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
    autoIndex: true,
  },
};
