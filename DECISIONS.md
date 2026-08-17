# Decisions

## 1. Configuration-driven estimator

The estimator configuration is stored in MongoDB rather than hardcoded in the
frontend. This includes the business details, questions, answer options,
material rates, multipliers, tear-off costs, waste factor, permit fee, and
range spread.

The frontend requests the active configuration from the backend and renders
the questions dynamically. This was chosen so the owner can change pricing or
estimator questions from the Owner Panel without changing or redeploying the
frontend.

I kept the contact details (name, phone, and email) as a separate final step
because they are lead-capture information rather than estimator configuration.

## 2. Calculation approach

The estimate is calculated on the server so that pricing logic and business
configuration are not exposed as frontend business logic.

The calculation starts with the selected roof area and material rate. A waste
factor is applied to the roof area, then the material cost is calculated.
Pitch and number of stories apply their configured multipliers. If existing
roofing layers need to be removed, the configured tear-off rate is added.
The configured permit fee is then added to produce the base estimate.

A lower and upper estimate are generated using the configured range spread
percentage. The server returns both values to the frontend, which only
displays the result.

The server validates the submitted answers against the active configuration
before calculating an estimate. This prevents invalid values from silently
producing an estimate.

## 3. Configuration versions

Configurations are versioned instead of overwriting the meaning of previous
estimates. Each lead stores the `config_version` used when its estimate was
created.

This allows an owner to change pricing while preserving which configuration
was used for historical leads.

The active configuration is the one used by new estimator sessions. Publishing
changes creates a new configuration version rather than requiring a frontend
deployment.

## 4. Authentication and security

The Owner Panel is protected by username/password authentication. After a
successful login, the server issues a JWT stored in an HttpOnly cookie.

The frontend does not store the authentication token in localStorage. API
requests include credentials so the browser can send the authentication cookie.

The backend validates the cookie before allowing access to owner-only
configuration and lead endpoints.

Production secrets and the MongoDB connection string are stored in environment
variables and are not committed to the repository.

## 5. Deliberate scope decisions

I deliberately did not build payments, customer accounts, contractor
scheduling, email/SMS automation, a full CRM, or an on-site roofing
measurement system.

Those features would increase the scope substantially without being necessary
for the core requirement: dynamically collect roof information, calculate an
estimate, capture the lead, and allow the owner to manage pricing.

I focused the available development time on the estimator, server-side
calculation, MongoDB persistence, authentication, Owner Panel, validation,
responsive UI, and deployment.

## 6. Assumptions and questionable inputs

The provided configuration and seed data contain different question sets
across configuration versions. For example, an older historical lead can
contain answers such as natural slate, chimney count, or gutter replacement
that are not present in the current version 3 configuration.

I preserved those historical leads rather than attempting to convert their
answers to the current question set. Historical leads retain their original
configuration version so their stored data remains meaningful.

I also treated the supplied pricing and modifiers as business configuration
rather than constants that should be embedded in application code.

## 7. Questions I would ask Dale

Before a real production build, I would clarify:

1. How should the pricing formula account for additional roofing factors
   such as chimneys, skylights, gutters, disposal, or regional labor costs?
2. Should the estimate represent a customer-facing price or only an internal
   planning range?
3. Who is allowed to modify estimator configuration, and should changes
   require approval or an audit trail?
4. Should leads be exported or integrated with an existing CRM?
5. What retention, privacy, and consent requirements apply to customer contact
   information?

## 8. If I had another week

I would add automated API/integration tests around configuration publishing,
authentication, validation, estimate calculation, and lead creation.

I would also add an audit history for configuration changes, stronger
production logging and monitoring, more comprehensive input validation,
customer consent/privacy handling, and additional Owner Panel capabilities
such as adding/removing/reordering questions and options.