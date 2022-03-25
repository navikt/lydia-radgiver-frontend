import PrometheusClient, {Histogram, Summary} from "prom-client";
import express, {Application, NextFunction, Request, Response} from "express";


export const customPrometheusMetrics = () : Application => {
    const collectors = prometheusCollectors()
    const app = express()
    app.get("/metrics", async  (req, res) => {
        res.set('Content-Type', PrometheusClient.register.contentType);
        res.end(await PrometheusClient.register.metrics());
    })
    app.use(requestHandlerFromCollectors(collectors))
    return app
}

const requestHandlerFromCollectors = (collectors : CustomCollectors) =>  (
    req: Request,
    res: Response,
    next: NextFunction,
)  => {

    console.log("Incoming")
    const stopRequestDurationSummary = collectors.requestDurationSummary.startTimer()
    const stopRequestDurationHistogram = collectors.requestDurationHistogram.startTimer()

    const route = new URL(req.url).pathname
    res.once('finish', () => {
        if (route) {
            stopRequestDurationSummary({
                route,
                method: req.method,
                code: res.statusCode,
            })

            stopRequestDurationHistogram({
                route,
                method: req.method,
                code: res.statusCode,
            })
        }

        const requestLength = parseInt(req.get('content-length'), 10) || 0
        collectors.requestSizeHistogram.observe(
            {
                route,
                method: req.method,
                code: res.statusCode,
            },
            requestLength,
        )
        const responseLength = parseInt(res.get('Content-Length'), 10) || 0
        collectors.responseSizeHistogram.observe(
            {method: req.method, route, code: res.statusCode},
            responseLength,
        )

        console.log("Request length", requestLength)
        console.log("Response length", responseLength)
    })

    return next()
}


interface CustomCollectors {
    requestDurationHistogram: Histogram<string>;
    requestSizeHistogram: Histogram<string>;
    requestDurationSummary: Summary<string>;
    responseSizeHistogram: Histogram<string>
}

const prometheusCollectors = () : CustomCollectors =>
{
    const requestDurationHistogram = new Histogram({
        name: defaultMetrics.requestDurationHistogram.key,
        help: defaultMetrics.requestDurationHistogram.help,
        labelNames: ['method', 'route', 'code'],
        buckets: defaultOptions.requestDurationHistogramBuckets,
    })

    const requestDurationSummary = new Summary({
        name: defaultMetrics.requestDurationSummary.key,
        help: defaultMetrics.requestDurationSummary.help,
        labelNames: ['method', 'route', 'code'],
        percentiles: defaultOptions.requestDurationBuckets,
    })


    const requestSizeHistogram = new Histogram({
        name: defaultMetrics.requestSize.key,
        help: defaultMetrics.requestSize.help,
        labelNames: ['method', 'route', 'code'],
        buckets: defaultOptions.requestSizeBuckets,
    })
    const responseSizeHistogram = new Histogram({
        name: defaultMetrics.responseSize.key,
        help: defaultMetrics.responseSize.help,
        labelNames: ['method', 'route', 'code'],
        buckets: defaultOptions.responseSizeBuckets,
    })

    return {
        requestDurationHistogram,
        requestDurationSummary,
        requestSizeHistogram,
        responseSizeHistogram
    }
}


const defaultMetrics = {
    requestDurationHistogram: {
        key: 'http_request_duration_histogram_seconds',
        help: 'Duration of HTTP requests in seconds',
    },
    requestDurationSummary: {
        key: 'http_request_duration_summary_seconds',
        help: 'Summary of request durations in seconds',
    },
    requestSize: {
        key: 'http_request_size_bytes',
        help: 'Size of HTTP request in bytes',
    },
    responseSize: {
        key: 'http_response_size_bytes',
        help: 'Size of HTTP response in bytes',
    },
}

const defaultOptions = {
    requestDurationBuckets: [0.5, 0.9, 0.95, 0.99],
    requestDurationHistogramBuckets: [
        0.005,
        0.01,
        0.025,
        0.05,
        0.1,
        0.25,
        0.5,
        1,
        2.5,
        5,
        10,
    ],
    requestSizeBuckets: [5, 10, 25, 50, 100, 250, 500, 1000, 2500, 5000, 10000],
    responseSizeBuckets: [5, 10, 25, 50, 100, 250, 500, 1000, 2500, 5000, 10000],
}
