# Import API definition to 3scale

When you import an API defintion, the following actions will be performed in the background:

1. Create a new service (unless you specify one)
2. Create methods in the 'Definition' section
3. Attach newly created methods to the 'Hits' metric
4. Create mapping rules and show them under **API > Integration**

*Note*: At the moment, to update a definition you would have to delete the existing one and re-import. We're working on the updating functionality, stay tuned!

## To an existing service

Run this command to update an existing service in your [3scale](http://3scale.net) account and create methods for each endpoint.

`3scale-cli import <spec_type> -f /path/to/apidefinition -s SERVICE_ID`

*spec_type* could be `swagger` or `raml`

*SERVICE_ID* can be found in your 3scale dashboard.
![where to find SERVICE_ID on 3scale](https://www.evernote.com/l/ACW0h8yHfplHi4r-WivB0e0FT5X-6mgutmgB/image.png)

Or you can also get all of your services and ids running this command:
`3scale-cli services list`

## To a new service

If you don't specify a service id, when you import an API definition a new service will be automatically created. 

`3scale-cli import  --type <spec_type> -f /path/to/swagger.json`

*Note*: Creating a new service is only available for *Pro* and *Entreprise* customers.

## Using a pattern for method names

You can use `-p, --pattern <pattern_type>` to indicate a pattern for method names. 

You can use `{path}` and `{method}` variables in the pattern for example -p {method}_{path} will give method with names like GET_/pets
