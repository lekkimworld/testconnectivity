#!/usr/bin/env node

const path = require('path')
const commandLineUsage = require('command-line-usage')
const commandLineArgs = require('command-line-args')
const http = require('http')
const https = require('https')
const URL = require('url')

// configure command line args and show help if required / appropriate
const cmdLineOptsRequired = [
    {name: 'url', alias: 'u', multiple: true, type: String, description: 'URL to connect to - one than one is allowed'}
]
const cmdLineOptsOptional = [
    {name: 'help', type: Boolean, defaultValue: false, description: 'Shows this help'}
]
const options = (function() {
    try {
        const opts = commandLineArgs(cmdLineOptsRequired.concat(cmdLineOptsOptional), {'argv': process.argv})
        return opts

    } catch (err) {
        return {
            parseError: true,
            parseMessage: err.message
        }
    }
})()
const argsValid = (function() {
    if (options.parseError || options.help) return false
    if (!options.url || options.url.length === 0) return false
    return true
})()
if (!argsValid) {
    if (options.parseError) console.log(`!! Error parsing command line or invalid value supplied <${options.parseMessage}> !!`)
    console.log(commandLineUsage([
        {header: 'Test Connectivity', 
            content: 'Reads the URL(s) to attempt connection to from the command line.'
        },
        {header: 'Required Options', optionList: cmdLineOptsRequired},
        {header: 'Optional Options', optionList: cmdLineOptsOptional}
    ]))
    process.exit(0)
}

// let's go
options.url.reduce((prev, url) => {
    // remove non-url looking urls
    if (url.match(/(ftp|https?):\/\/[^ "]+$/)) {
        prev.push(url)
    } else {
        process.stderr.write(`Ignoring <${url}> as it doesn't look like a url\n`)
    }
    return prev
}, []).forEach(url => {
    // are we https?
    let ishttps = url.indexOf('https://') === 0

    // use URL.parse as it allows us to run on node 6.10 LTS
    let u = URL.parse(url)
    let options = {'method': 'HEAD',
        'port': u.port, 
        'path': u.path,
        'host': u.host
    }
    let req = (function() {
        return ishttps ? https : http
    }()).request(options, (res) => {
        const rc = res.statusCode
        const headers = res.headers
        if (rc >= 100 || rc < 400) {
            if (rc >= 300) {
                process.stdout.write(`Successfully connected to <${url}> with response code <${rc}> and location <${headers['location']}>\n`)
            } else {
                process.stdout.write(`Successfully connected to <${url}> with response code <${rc}> and content-type <${headers['content-type']}>\n`)
            }
        } else {
            process.stderr.write(`Received non-expected response code (<${rc}>) from <${url}>\n`)
        }
    })
    req.end();
    req.on('error', err => {
        process.stderr.write(`ERROR attemping connnection to <${url}>: ${err.message}\n`)
    })
})
