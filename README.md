# Timetracker UI

A user interface for [timetracker](https://github.com/netresearch/timetracker) - yet only serving statistics but may become an alternate UI for timetracker in the future.

## Build Setup

``` bash
# install dependencies
npm install

# set config
cp config/config.json.dist config/config.json

# serve with hot reload at localhost:8080
npm TIMETRACKER_URL=https://timetracker.example.com run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```
