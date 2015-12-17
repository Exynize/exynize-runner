import Rx from 'rx';
import React from 'react';

// hacky mocks of window, document, etc for leaflet
// TODO: find better solution (jsdom?)
global.window = {};
global.document = {
    documentElement: {style: []},
    getElementsByTagName: () => [],
    createElement: () => ({getContext: () => {}}),
};
global.navigator = {userAgent: 'node'};

const context = {
    // dummy module and exports for babel
    module: {},
    exports: {},

    // expose default tick functions
    setTimeout,
    setInterval,

    // expose Rxjs
    Rx,
    // expose React
    React,

    // expose custom require
    require,
};

export default context;
