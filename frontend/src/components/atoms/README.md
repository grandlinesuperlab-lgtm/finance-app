# Atoms

The smallest useful piece of interface: a button, an input, a badge, a label,
an icon.

**An atom imports no other component.** That is the whole test — not size, not
how it looks. If a file in this folder imports another component, it belongs
one layer up.

Atoms are pure: props in, events out. They never read a store, never call a
service, never know what a portfolio is. An atom must be usable in a completely
different app with only its props changed.

`BaseButton.vue` is the reference implementation. New atoms follow its shape:
typed props with defaults, explicit emits, one BEM block named after the file,
tokens for every value.
