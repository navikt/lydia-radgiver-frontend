import Prometheus from "prom-client";

export const redisCacheHitCounter = new Prometheus.Counter({
    name: "redis_cache_hit",
    help: "Counts every hit of an OBO token in the Redis store",
});

export const secondaryKeyDecryptionSuccessCounter = new Prometheus.Counter({
    name: "secondary_key_decryption_success",
    help: "Counts successful decryptions using a secondary key",
});

export const decryptionFailureAllKeysTriedCounter = new Prometheus.Counter({
    name: "decryption_failure_all_keys_tried",
    help: "Counts decryption failures after all keys have been tried",
});
