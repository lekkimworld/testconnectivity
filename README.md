# Test Connectivity #
Small script that tests the connectivity to URL's specified on the command line outputting some information about each URL to either `stdout` or `stderr`.

## Usage ##
```bash
$ ./testconnectivity --help

Test Connectivity

  Reads the URL(s) to attempt connection to from the command line.

Required Options

  -u, --url string[]   URL to connect to - one than one is allowed

Optional Options

  --help    Shows this help

$ ./testconnectivity.js --url https://login.salesforce.com \
    --url http://example.com \
    --url invalid_url \
    --url http://lsdfhsdlfsdflhsdfs.foo
Ignoring <invalid_url> as it doesn't look like a url
ERROR attemping connnection to <http://lsdfhsdlfsdflhsdfs.foo>: getaddrinfo ENOTFOUND lsdfhsdlfsdflhsdfs.foo lsdfhsdlfsdflhsdfs.foo:80
Successfully connected to <https://login.salesforce.com> with response code <200> and content-type <text/html; charset=UTF-8>
Successfully connected to <http://example.com> with response code <200> and content-type <text/html; charset=UTF-8>
```
