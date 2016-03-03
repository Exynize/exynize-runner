# Exynize component runner for Exynize platform

> Exynize component runner that provides a way to run user-created components in a standalone node (e.g. docker container). Part of Exynize platform.

## About Exynize platform

Exynize platform aims to simplifying the workflow and allow rapid creation of data processing pipelines and visualisations.
Current version of the platform allows:
- constructing pipelines right in your browsers with very little effort,
- writing processing component as if you was dealing with a single data item,
- re-using existing processing modules in new pipelines,
- creating real-time processing and visualisation without thinking about doing real-time at all,
- spending time on doing actual work, not fiddling with scaffolding.

More info on the platform as well as some demoes of its capabilities can be found in the following article on Medium
> [Building data processing and visualisation pipelines in the browser with Exynize](https://medium.com/the-data-experience/building-data-processing-and-visualisation-pipelines-in-the-browser-with-exynize-372ab15e848c#.cq73g7k7q)

## Getting started

### Requirements

For Exynize component runner to function properly, you'll need to have following things installed:

- node.js v4.x or later
- npm v3.x or later
- docker (used to start RabbitMQ) or RabbitMQ

Alternatively you can use docker environment provided with a supplied Dockerfile.

### Installation

1. Clone the repository and cd into new folder: `git clone git@github.com:Exynize/exynize-runner.git && cd exynize-runner`
2. Execute `npm install`
3. Execute `npm start` (you must have RabbitMQ running!)
4. Exynize component runner will start working and listening for commands from RabbitMQ

Alternatively, you can use Dockerfile to assemble docker container and then start it with a link to your RabbitMQ instance.

## License

Dual licensed under GPL-3.0 and commercial license.
See LICENSE.md file for more details.
