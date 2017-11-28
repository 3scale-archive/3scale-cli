# Create interactive documentation (ActiveDocs)

## Create new ActiveDocs

Note: 3scale ActiveDocs are based on API definitions which are Open API / Swagger compliant. There are multiple online and free tools to validate your API definition, for example [Swagger 2.0 Parser and Validator](http://bigstickcarpet.com/swagger-parser/www/index.html)

To upload your API definition to 3scale and create the ActiveDocs, run the following command:

`3scale-cli activedocs create -f /path/to/apidefinition`

Once you have created the ActiveDocs, learn how you publish them in your developer portal following [this tutorial](https://support.3scale.net/docs/api-documentation/publish-activedocs).

If you'd like to publish multiple ActiveDocs in the same page , check out this [documentation](https://support.3scale.net/codehub/display-multiple-swagger-spec).

You can specify a specific name for your activedocs using the optional `-s`, `--systemName` parameter.

Example:
`3scale-cli activedocs create -f /path/to/apidefinition -s <system_name>`

## Get all ActiveDocs of an account

By running the following command `3scale-cli activedocs list` you'll get the following information about the activedocs:

- id
- name
- system name
- description
- published (which means it can be shown in the developer portal)
- creation date
- latest updated date

## Update ActiveDocs
`3scale-cli activedocs update -i <activedocs_id> -f /path/to/apidefinition`

## Delete ActiveDocs
`3scale-cli activedocs delete -i <activedocs_id>`
