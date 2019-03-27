const request = require('request');

const geocode = (address, callback) => {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?access_token=pk.eyJ1IjoiY2FyYWxhZ3VtZW4iLCJhIjoiY2pzdjU3a3MzMDA2YzRhcDJxdmVxeGV0MiJ9.WUFl-dVzETj7DRPMIBucfg`;

    request({ url, json: true }, (error, { body }) => {
        if (error) {
            callback('Unable to Connect to Location Services', undefined);
        } else if (body.features.length < 1) {
            callback('No Matching Location Results', undefined);
        } else {
            callback(undefined, {
                latitude: body.features[0].center[1],
                longitude: body.features[0].center[0],
                location: body.features[0].place_name
            });
        }
    })

    //WITHOUT DESTRUCTURING
    // request({ url: url, json: true }, (error, response) => {
    //     if (error) {
    //         callback('Unable to Connect to Location Services', undefined);
    //     } else if (response.body.features.length < 1) {
    //         callback('No Matching Location Results', undefined);
    //     } else {
    //         callback(undefined, {
    //             latitude: response.body.features[0].center[1],
    //             longitude: response.body.features[0].center[0],
    //             location: response.body.features[0].place_name
    //         });
    //     }
    // })
}

module.exports = geocode;