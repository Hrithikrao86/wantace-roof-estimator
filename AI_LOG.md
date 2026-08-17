# AI Usage Log

AI tools were used as an implementation accelerator and review partner, not as a substitute for understanding the application. I used ChatGPT/Copilot-style assistance for scaffolding, API shape suggestions, UI iteration, and checking edge cases against the assignment requirements.

One important correction during implementation was to avoid trusting pricing-related values from the browser. A naive implementation can send the selected rates or multipliers back with the estimate request. I rejected that approach: the browser sends only answers and a configuration version, while the server loads the actual configuration and calculates the result.

I also deliberately changed the simplest "always use current config" flow into version-pinned estimation. The brief says an owner edit must not break a homeowner mid-flow. Pinning the version makes that requirement explicit: new visitors get the active version while existing visitors can finish against the version they started with.

The configuration model, validation rules, pricing engine, API boundaries, and final architecture were reviewed and substantially shaped manually. Before submission, I would verify the calculator with independent examples, test the owner edit flow in an incognito browser, and inspect the frontend for forbidden hardcoded pricing/configuration data.
