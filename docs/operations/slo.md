# Service Level Objectives (SLOs) & Error Budgets

## 1. Primary Service Indicators & Targets

| Metric | Target | Measurement Window | Action on Breach |
|---|---|---|---|
| **API Availability** | >= 99.9% successful responses (2xx/3xx/4xx) | Rolling 30 days | Halt non-critical feature releases; focus on stability. |
| **Synchronous Latency** | P95 < 200ms; P99 < 500ms | Rolling 1 hour | Auto-scale worker containers; profile slow database queries. |
| **AI Generation Latency** | P95 < 3.0s | Rolling 1 hour | Fall back to lightweight fast models. |
| **AI Tool Precision** | >= 95% valid tool calls | Rolling 7 days | Update tool descriptions and few-shot calibration. |
| **Error Budget** | 0.1% allowable failures (~43 mins/month) | Calendar month | Deployment freeze if budget depleted. |

---

## 2. Alerting Rules
- **P1 Alert (Page On-Call)**: Error rate > 5% for 5 consecutive minutes or complete DB outage.
- **P2 Alert (Urgent Slack)**: Error rate > 1% for 10 minutes or P95 latency > 1000ms.
- **P3 Alert (Ticket Created)**: Error budget consumption rate > 2x expected burn rate.
