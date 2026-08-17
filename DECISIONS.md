# Architecture Decisions

## Stack

I chose the MERN shape requested by the brief: React/Vite, Express/Node, and MongoDB/Mongoose. The task explicitly says this shape is expected, and it keeps the implementation small enough to finish reliably inside the 24-hour window.

## Configuration versioning

The public estimator reads one active configuration. Owner edits do not mutate that object in place. Instead, the server creates the next configuration version and marks it active. This gives the owner a safe publish point and lets an in-progress estimator pin the configuration version it originally loaded. A homeowner can therefore finish a flow even if prices or questions are changed while they are filling it out.

## Pricing

Pricing is calculated only on the server. For roof area `A`, material rate `Rm`, pitch multiplier `Mp`, stories multiplier `Ms`, tear-off rate `Rt`, waste `W`, permit fee `Fp`, and spread `S`:

- material = `A × Rm × (1 + W)`
- tear-off = `A × Rt`
- adjusted subtotal = `(material + tear-off) × Mp × Ms`
- midpoint = `adjusted subtotal + Fp`
- low = `midpoint × (1 − S)`
- high = `midpoint × (1 + S)`

The seed contains historical leads from older configuration versions. I keep those historical numbers as supplied rather than trying to reverse-engineer them into the new calculation formula.

## Validation and trust boundary

The browser is treated as untrusted. The API verifies the configuration version, checks required fields, checks numeric limits, and verifies selected option values against the stored configuration before calculating the estimate. The browser never sends a price or multiplier to the calculator.

## Authentication

The owner panel uses a username/password login backed by a signed JWT in an HttpOnly cookie. The cookie is not exposed to client-side JavaScript. Protected API routes reject requests without a valid session.

## Scope decisions

I deliberately did not build role-based permissions, multi-tenancy, outbound webhooks, CSV export, or a full configuration history UI. They are useful production features, but the brief makes them optional and a reliable core flow is worth more than unfinished stretch work.

## Questions for Dale before production

1. Should price changes affect estimates already in progress, or should every visitor remain pinned to the version they started with?
2. Are roof-area limits and pricing rates expected to differ by ZIP code or service area?
3. Which fields are required for lead follow-up, and should phone/email be validated more strictly?
4. Should owner edits be auditable with editor identity and timestamps?
5. What data-retention and privacy policy should apply to captured customer contact information?

## If I had another week

I would add automated tests around the calculator and validation layer, a human-readable configuration version history, CSV lead export, stronger audit logging, and production-grade observability/rate limiting.
