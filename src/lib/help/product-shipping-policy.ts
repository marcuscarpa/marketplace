type PolicyBlock = { type: 'paragraph'; content: string } | { type: 'address'; content: string };

const PRODUCT_SHIPPING_POLICY_EN: { title: string; email: string; blocks: PolicyBlock[] } = {
  title: 'SHIPPING',
  email: 'business@sinesiakarol.com',
  blocks: [
    {
      type: 'paragraph',
      content:
        'To initiate a return, please email business@sinesiakarol.com. We require a receipt or proof of purchase with the return.',
    },
    { type: 'paragraph', content: 'All returned merchandise must be sent to:' },
    {
      type: 'address',
      content:
        'Sinesia Karol\nAttn: RETURNS (Order No. ___)\n135 Spring Street\n\nNewport, Rhode Island 02840\n\n401-847-1087',
    },
    {
      type: 'paragraph',
      content:
        'For items manufactured by third parties and resold by us, please do not send the item back to the manufacturer.',
    },
    {
      type: 'paragraph',
      content:
        'You are responsible for paying all shipping costs for the returned item. Shipping costs are non-refundable. If you receive a refund, the cost of return shipping will be deducted from the refund amount. We recommend using a trackable shipping service or purchasing shipping insurance for valuable items.',
    },
    {
      type: 'paragraph',
      content:
        'Depending on where you live, the time it takes for an exchanged product to reach you may vary.',
    },
  ],
};

const PRODUCT_SHIPPING_POLICY_PT: { title: string; email: string; blocks: PolicyBlock[] } = {
  title: 'ENVIO',
  email: 'business@sinesiakarol.com',
  blocks: [
    {
      type: 'paragraph',
      content:
        'Para iniciar uma devolução, envie um e-mail para business@sinesiakarol.com. Exigimos um recibo ou comprovante de compra junto com a devolução.',
    },
    { type: 'paragraph', content: 'Toda a mercadoria devolvida deve ser enviada para:' },
    {
      type: 'address',
      content:
        'Sinesia Karol\nAttn: DEVOLUÇÕES (Nº do Pedido ___)\n135 Spring Street\n\nNewport, Rhode Island 02840\n\n401-847-1087',
    },
    {
      type: 'paragraph',
      content:
        'Para itens fabricados por terceiros e revendidos por nós, não envie o item de volta ao fabricante.',
    },
    {
      type: 'paragraph',
      content:
        'Você é responsável por pagar todos os custos de envio do item devolvido. Os custos de envio não são reembolsáveis. Se você receber um reembolso, o custo do envio da devolução será deduzido do valor do reembolso. Recomendamos usar um serviço de envio com rastreamento ou contratar seguro de envio para itens valiosos.',
    },
    {
      type: 'paragraph',
      content:
        'Dependendo de onde você mora, o tempo para um produto trocado chegar até você pode variar.',
    },
  ],
};

/** @deprecated Use getProductShippingPolicy(locale) */
export const PRODUCT_SHIPPING_POLICY = PRODUCT_SHIPPING_POLICY_EN;

export function getProductShippingPolicy(locale: string) {
  return locale === 'pt' ? PRODUCT_SHIPPING_POLICY_PT : PRODUCT_SHIPPING_POLICY_EN;
}
