# Molecules

A small group of atoms that together do one job: a labelled value, a search
field with its button, a stat tile, a table row.

**A molecule may import atoms and nothing else.** Still no stores, no services.
If it needs data it cannot receive as a prop, it is an organism.

Molecules are where most semantic decisions get made, because this is where
markup stops being a single element and becomes a structure. Before writing
`<div>`, check the element table in the `component-conventions` skill: a
label/value pair is a `<dl>`, a row of a data set is a `<tr>`, a
self-contained block is an `<article>`.
