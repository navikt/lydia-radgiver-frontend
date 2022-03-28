import Prometheus from "prom-client"


export const redisCacheHitCounter = new Prometheus.Counter(
    {
        name: 'redis_cache_hit',
        help: 'Counts every hit of an OBO token in the Redis store',
    }
)
