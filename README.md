# 3scale CLI

This repository contains the command line utility for the API management solution [3scale.net](http://3scale.net).

## Install

To install run the command

`npm install -g node-3scale-cli`

## Prerequisites
* [3scale](http://3scale.net) account - sign up for free at [http://www.3scale.net](http://www.3scale.net)


## Config

Before using the CLI tool you need to configure it first:

```
3scale-cli config
[ 3scale-cli ] Please answer the following questions to configure 3scale cli.
? 3scale provider key 1234567890abc
? 3scale id awesome-api
[3scale-cli] 3scale cli tool configured
```
[SCREENSHOT]

The *PROVIDER_KEY* can be found on your `Account` tab after you log in to [3scale](http://3scale.net).
Your *THREESCALE_ID* corresponds to the domain of your [3scale](http://3scale.net) admin portal as in `THREESCALE_ID-admin.3scale.net`.

[SCREENSHOT]

## Import Swagger to 3scale

### To an existing service

Run this command to update an existing service in your [3scale](http://3scale.net) account and create metrics for each endpoint.

`3scale-cli import -f /path/to/swagger.json -s SERVICE_ID`

*SERVICE_ID* can be found in your 3scale dashboard.
[SCREENSHOT]

### To a new service

*Note*: This feature is only accessible to *Pro* and *Entreprise* customers

`3scale-cli import -f /path/to/swagger.json`

## Help

Display the [3scale](http://3scale.net) CLI help with the following command

`3cale-cli -help`

```

  Usage: 3scale-cli [command] [options]


  Commands:

    import [options]     Import a swagger spec into 3scale
    lambda [options]     Generate the Lambda function to integrate with 3scale
    config               Configure the 3scale cli
    appplan [options]    Adds an application plan to a service
    metrics [options]    Add a new metric to a service.
    methods [options]    Add a new method to a specific metric on a service
    services [options]   Create a new service

  A command line interface for 3scale API management

  Options:

    -h, --help     output usage information
    -V, --version  output the version number
```

## Contribute
If you see any typo or a need a specific feature, you are welcome to fork this repo and make a pull request or write an issue.
