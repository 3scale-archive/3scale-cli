# 3scale CLI

This repository contains the command line utility for the API management solution [3scale.net](http://3scale.net).

## Install

To install run the command

`npm install -g node-3scale-cli`

## Setup

Setup two environement variables used by the CLI:
```
export THREESCALE_PROVIDER_KEY=<3scale_provider_key>
export THREESCALE_ID= <3scale_id>
```

You can find your provider key on your `Account` page.
Your `3scale ID` corresponds to the URL you were givin `THREESCALE_ID.3scale.net`

## Import Swagger to 3scale

run the following command

`3scale-cli -f /path/to/swagger.json`

Works also with YAML files

## Help
## Contribute
