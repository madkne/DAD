
# Configs

you can set these configs on `.env` file.

|key            |default     |description   |
|:-------------:|:----------:|--------------|
|ROOT_USERNAME  |`root`      |-             |
|ROOT_PASSWORD  |`root`      |-             |
|STORAGE_PATH   |`/storage`  |-             |
|UPLOADS_PATH   |`/storage/uploads`|-       |
|PUBLIC_PATH    |`/public`   |-             |
|HTTP_PORT      |`8082`      |-             |
|DB_CONNECTION  |`sqlite`    | contains sqlite, mysql|
|DB_PATH        |`/storage/db.sqlite`| just for sqlite db|
|DS_TYPES       |`sqlite`    |data sources supported like mysql, mongo|
|DB_NAME        |`dad_db`     |-            |
|DEBUG_MODE     |`0`          |if enabled, show debug logs|
|SWAGGER_BASE_URL|`/api-docs` |-            |
|HOSTNAME       |`localhost`  |-            |
|AUTH_HEADER_NAME|`Authorization`|need for api calls|
|AUTH_TOKEN_LIFETIME|`86400`  |token lifetime as seconds|
|DASHBOARD_BASE_URL|`/dashboards`|-          |