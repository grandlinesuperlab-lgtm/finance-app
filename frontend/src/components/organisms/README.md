# Organisms

A complete, self-contained section of a screen: the positions table, the
portfolio summary header, the price chart panel.

**An organism may import atoms and molecules, and it may talk to stores and
services.** This is the first layer that knows what the application is about.

Because an organism owns data, it owns the states that come with data. An
organism is not finished until all four exist: loading, empty, error, success.
See the `component-conventions` skill.

An organism usually maps to one landmark or one `<section>` with a heading. If
you cannot name the section in a heading, the boundary is probably wrong.
