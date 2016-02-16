import Rx from 'rx';
import React from 'react';

const context = {
    // hacky mocks of window, document, etc for stuff like leaflet.js
    // TODO: find better solution (jsdom too heavy?)
    window: {},
    document: {
        documentElement: {style: []},
        getElementsByTagName: () => [],
        createElement: () => ({getContext: () => {}}),
    },
    navigator: {userAgent: 'node'},

    // expose default tick functions
    setTimeout,
    setInterval,

    // expose Rxjs
    Rx,
    // expose React
    React,
};

export default context;
