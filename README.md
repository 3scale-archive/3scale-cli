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

Your *THREESCALE_ID* corresponds to the domain of your [3scale](http://3scale.net) admin portal as in `THREESCALE_ID-admin.3scale.net`.

The *PROVIDER_KEY* is the key that identifies you as a 3scale customer. It can be found in the ["Account"](https://CHANGEME-admin.3scale.net/p/admin/account) menu of your 3scale admin portal.  

![Provider Key](docs/provider-key.png)

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

3Scale-cli is open source, and we welcome anybody who wants to participate and contribute!

If you want to fix a bug or make any changes, please [log an issue in GitHub](https://github.com/3scale/3scale-cli/issues) describing the bug
or new feature.

### Get the code

The easiest way to get started with the code is to [create your own fork](http://help.github.com/forking/)
of this repository, and then clone your fork:
```bash
  $ git clone git@github.com:<you>/3scale-cli.git
  $ cd 3scale-cli
  $ git remote add upstream git://github.com/3scale/3scale-cli.git
```
At any time, you can pull changes from the upstream and merge them onto your master:
```bash
  $ git checkout master               # switches to the 'master' branch
  $ git pull upstream master          # fetches all 'upstream' changes and merges 'upstream/master' onto your 'master' branch
  $ git push origin                   # pushes all the updates to your fork, which should be in-sync with 'upstream'
```
The general idea is to keep your 'master' branch in-sync with the 'upstream/master'.

### Make a fix

If you want to fix a bug or make any changes, please [log an issue in GitHub](https://github.com/3scale/3scale-cli/issues) describing the bug
or new feature. Then we highly recommend making the changes on a branch named with the issue number. For example, this command creates
a branch for the issue #17 :
```bash
  $ git checkout -b 3scale-cli-issue-17
```
After you're happy with your changes and a full build (with unit tests) runs successfully, commit your
changes on your topic branch. Then it's time to check for and pull any recent changes that were made in
the official repository:
```bash
  $ git checkout master               # switches to the 'master' branch
  $ git pull upstream master          # fetches all 'upstream' changes and merges 'upstream/master' onto your 'master' branch
  $ git checkout 3scale-cli-issue-17   # switches to your topic branch
  $ git rebase master                 # reapplies your changes on top of the latest in master
                                      # (i.e., the latest from master will be the new base for your changes)
```

Push your changes and [generate a pull-request](http://help.github.com/pull-requests/)

Please try to create one commit per feature or fix, generally the easiest way to do this is via [git squash](https://git-scm.com/book/en/v2/Git-Tools-Rewriting-History#Squashing-Commits).
This makes reverting changes easier, and avoids needlessly polluting the repository history with checkpoint commits.

### Building 3scale-cli

#### Requirements
- NodeJS

#### Building
```bash
  $ npm install
```

#### Running
```bash
  $ bin/3scale-api
```

## License

The MIT License (MIT)

Copyright (c) 2015 3scale Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
