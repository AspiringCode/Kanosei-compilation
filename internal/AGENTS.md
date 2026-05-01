# enterprise_router explainer prompt

You are reviewing a small Python package called `enterprise_router` inside the `UI-Team` repo. Your job is to understand the codebase, explain how it works, and answer follow-up questions about architecture, behavior, and extension points.

## Project purpose

`enterprise_router` is a SQLite-backed messaging/router package for a multi-agent enterprise simulation. It provides:

- approval-gated self-registration for agents
- a persistent agent registry
- a required shared message envelope
- hierarchy-aware queueing and routing
- recipient-side filtering
- fetch/ack/nack delivery flow
- TTL expiry, dedupe keys, dead-letter behavior, and audit logging
- a CLI demo and unit tests

## Important files

- `enterprise_router/models.py`: public dataclasses, role defaults, urgency weights, timestamp helpers, and message creation helpers
- `enterprise_router/exceptions.py`: package exceptions
- `enterprise_router/storage.py`: SQLite schema/bootstrap
- `enterprise_router/service.py`: core business logic in the `EnterpriseRouter` class
- `enterprise_router/cli.py`: argparse CLI for registration, messaging, queue inspection, and audit viewing
- `tests/test_router.py`: unit tests covering registration, blocking, fetch/ack/nack, dead-lettering, TTL expiry, dedupe, and validation
- `README.md`: package overview and quick-start usage
- `.github/workflows/blank.yml`: CI that runs the test suite

## Core concepts

- `AgentRecord`: approved/active agent registry entry with role, hierarchy, trust, address info, and allowlists
- `RegistrationRequest`: self-registration request using a shared secret token
- `MessageEnvelope`: required outer schema with `id`, `timestamp`, `sender`, `recipient`, `task_type`, `context`, `payload`, `status`, and `error`
- `RoutingHints`: internal routing metadata like provenance, urgency, TTL, and dedupe key
- `QueuedMessage`: envelope plus queue state and computed routing metadata

## Behavior to understand

- agents can self-register, but they stay pending until approved
- approved agents can send/receive; inactive or unknown agents cannot
- messages are stored with the outer envelope unchanged
- routing metadata is stored separately in SQLite
- priority is computed from recipient importance, urgency, provenance trust, and hierarchy penalty
- lower-ranked agents messaging higher-ranked agents are delayed, not dropped
- recipient allowlists can block senders or task types
- `peek_messages()` is read-only
- `fetch_next()` leases the highest-priority eligible pending message
- `ack_message()` completes a leased message
- `nack_message()` requeues it or dead-letters it after max attempts
- TTL-expired messages are marked expired and excluded from normal delivery
- all important events are written to an audit log

## Instructions

Please do the following:

1. Summarize the architecture in plain English.
2. Explain the responsibility of each main file.
3. Walk through a full lifecycle: self-registration -> approval -> send -> fetch -> ack/nack.
4. Call out important implementation decisions and tradeoffs.
5. Identify likely extension points for UI integration, message bus replacement, or stronger auth.
6. Reference concrete functions, classes, and files when explaining behavior.
