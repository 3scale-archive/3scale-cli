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

![output from terminal](https://www.evernote.com/l/ACV6L21JMwxFm771F9iPNwu3j7eyqLrArkoB/image.png)

The *PROVIDER_KEY* can be found on your `Account` tab after you log in to [3scale](http://3scale.net).
Your *THREESCALE_ID* corresponds to the domain of your [3scale](http://3scale.net) admin portal as in `THREESCALE_ID-admin.3scale.net`.

## Import API definition to 3scale

### To an existing service

Run this command to update an existing service in your [3scale](http://3scale.net) account and create metrics for each endpoint.

`3scale-cli import --type <spec_type> -f /path/to/apidefinition -s SERVICE_ID`

*spec_type* could be `swagger` or `raml`

*SERVICE_ID* can be found in your 3scale dashboard.
![where to find SERVICE_ID on 3scale](https://www.evernote.com/l/ACW0h8yHfplHi4r-WivB0e0FT5X-6mgutmgB/image.png)

More options?
`-p, --pattern <pattern_type>` specify a pattern for method names, you can use `{path}` and `{method}` variables in the pattern
for example `-p {method}_{path}` will give method with names like `GET_/pets`

`-a, --appplan <applan_name>` create a new application plan

### To a new service

*Note*: This feature is only accessible to *Pro* and *Entreprise* customers

`3scale-cli import  --type <spec_type> -f /path/to/swagger.json`

## Mapping rules

## Create a mapping rule
`3cale-cli maprules create -p <pattern> -h <HTTP_VERB> -d <delta> -m <metric_id> -s <service_id>`

## Display info about exisint mapping rule
`3cale-cli maprules show -s <service_id> -r <mapping_rule_id> [options]`

## Update an existing mapping rule
`3cale-cli maprules list -s <service_id> -r <mapping_rule_id> [options]`

You can update a specific attribute or all at the same time, possible values:
`-p <pattern> -h <HTTP_VERB> -d <delta> -m <metric_id>`

## Delete existing mapping rule
`3cale-cli maprules delete -s <service_id> -r <mapping_rule_id> [options]`

## Get all mapping rules of a service
`3cale-cli maprules list -s <service_id>`

## Help

Display the [3scale](http://3scale.net) CLI help with the following command

`3cale-cli -help`

```

  Usage: 3scale-cli [command] [options]


  Commands:

    import [options]     Import an API from it's API definition (swagger or RAML) into 3scale
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
If you find typo or a need a specific feature, you are welcome to fork this repo and make a pull request or write an issue.

## License

The MIT License (MIT)

Copyright (c) 2015 3scale Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
