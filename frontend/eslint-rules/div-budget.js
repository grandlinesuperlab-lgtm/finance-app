/**
 * Custom rule: `div-budget`.
 *
 * Caps the number of `<div>` and `<span>` elements in a single component
 * template. A div is the element you reach for when nothing else fits — a
 * component that needs many of them is usually a component that skipped
 * `<section>`, `<article>`, `<ul>`, `<dl>` or `<table>`.
 *
 * This is deliberately a budget rather than a ban: a couple of layout wrappers
 * are legitimate, and a rule that can never be satisfied gets disabled.
 */

const GENERIC_ELEMENTS = new Set(['div', 'span'])

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Limit generic elements (div, span) per component template to keep markup semantic',
    },
    schema: [
      {
        type: 'object',
        properties: { max: { type: 'integer', minimum: 0 } },
        additionalProperties: false,
      },
    ],
    messages: {
      overBudget:
        'This template uses {{count}} generic elements (div/span); the budget is {{max}}. ' +
        'Replace the extra ones with elements that carry meaning — section, article, ' +
        'header, ul/li, dl/dt/dd, table, figure — or split the component.',
    },
  },

  create(context) {
    const max = context.options[0]?.max ?? 4
    const found = []

    const services = context.sourceCode.parserServices
    if (!services?.defineTemplateBodyVisitor) return {}

    return services.defineTemplateBodyVisitor({
      VElement(node) {
        // `rawName` keeps the casing as written, so a component named <Div>
        // is not mistaken for the HTML element.
        if (GENERIC_ELEMENTS.has(node.rawName)) found.push(node)
      },

      'VElement[parent.type="VDocumentFragment"]:exit'() {
        if (found.length <= max) return

        // Report on the elements past the budget, so the message points at
        // the ones that need rethinking rather than at the whole file.
        for (const node of found.slice(max)) {
          context.report({
            node,
            messageId: 'overBudget',
            data: { count: String(found.length), max: String(max) },
          })
        }
        found.length = 0
      },
    })
  },
}
