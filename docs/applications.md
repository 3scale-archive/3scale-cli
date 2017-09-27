# Applications

## Create a new application

`3scale-cli applications create -a <account_id> -p <plan_id> -n <name> -d <description>`
or
`3scale-cli applications create -a <account_id> -p <plan_id> -n <name> -d <description> -k <user_key>`


## Get a list of applications

By running the following command `3scale-cli applications list -a <account_id>` you'll get the following information about the applications for the given account:

- application id
- creation date
- latest update date
- service id
- application plan id
- account id
- user key
- provider verification key
- application name
- description

## Display info about existing application

To retrive information about a specific application, run the following command:
`3scale-cli applications show -i <application_id> -a <account_id>`

## Update an existing application

To update an application run the update subcommand and specify the application id and the account id. For example, to update the name of a application, run the following command:
`3scale-cli applications update -n <new_application_name> -i <application_id> -a <account_id>`

## Delete an existing application

To delete a application run the following command:
`3scale-cli applications delete -i <application_id> -a <account_id>`

## Suspend an existing application

To suspend an application run the following command:
`3scale-cli applications suspend -i <application_id> -a <account_id>`

## Resume a suspended application

To resume a suspended application run the following command:
`3scale-cli applications resume -i <application_id> -a <account_id>`
