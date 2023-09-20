#!/bin/sh

# Docker workaround: Remove check for KAFKA_ZOOKEEPER_CONNECT parameter
sed -i '/KAFKA_ZOOKEEPER_CONNECT/d' /etc/confluent/docker/configure

echo '' > /etc/confluent/docker/ensure

# KRaft required step: Format the storage directory with a new cluster ID
echo "kafka-storage format --ignore-formatted -t 4L6g3nShT-eMCtK--X86sw -c /etc/kafka/kafka.properties" >> /etc/confluent/docker/configure

