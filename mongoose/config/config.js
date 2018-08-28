var env = process.env.NODE_ENV || 'development';
//var env = 'development';
console.log('env *****' + env);

if (env === 'development' || env === 'test') {
  var config = require('./config.json');
  console.log(JSON.stringify(config, undefined, 2));
  var envConfig = config[env];
  console.log(envConfig);
  Object.keys(envConfig).forEach((key) => {
    process.env[key] = envConfig[key];
  });
}
