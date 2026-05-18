#!/bin/bash
set -euo pipefail

iptables -F
iptables -X
iptables -t nat -F 2>/dev/null || true
iptables -t nat -X 2>/dev/null || true
ipset destroy allowed-domains 2>/dev/null || true

iptables -A INPUT -i lo -j ACCEPT
iptables -A OUTPUT -o lo -j ACCEPT
iptables -A OUTPUT -p udp --dport 53 -j ACCEPT
iptables -A INPUT -p udp --sport 53 -j ACCEPT

iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT
iptables -A OUTPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

ipset create allowed-domains hash:net

for domain in \
  "registry.npmjs.org" \
  "api.github.com" \
  "github.com" \
  "objects.githubusercontent.com" \
  "raw.githubusercontent.com" \
  "codeload.github.com" \
  "api.anthropic.com" \
  "statsig.anthropic.com" \
  "sentry.io" \
  "api.vercel.com" \
  "vercel.com"; do
  ips=$(dig +short A "$domain" | grep -E '^[0-9.]+$' || true)
  for ip in $ips; do
    ipset add allowed-domains "$ip" 2>/dev/null || true
  done
done

# Google CDN ranges that serve fonts.googleapis.com and fonts.gstatic.com.
# Google rotates DNS across many IPs in these ranges, so point-in-time
# resolution misses most of them. Using CIDR blocks is more reliable.
# TEMPORARY: planned replacement is next/font/local with self-hosted Inter
# (no external font fetch at build time, better CWV).
for cidr in \
  "142.250.0.0/15" \
  "172.217.0.0/16" \
  "216.58.0.0/15" \
  "64.233.160.0/19" \
  "108.177.0.0/17"; do
  ipset add allowed-domains "$cidr" 2>/dev/null || true
done

iptables -A OUTPUT -m set --match-set allowed-domains dst -j ACCEPT
iptables -A OUTPUT -p tcp --dport 443 -j REJECT
iptables -A OUTPUT -p tcp --dport 80 -j REJECT

echo "Firewall initialized"
