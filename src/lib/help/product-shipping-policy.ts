const PRODUCT_SHIPPING_POLICY_EN = {
  title: 'Shipping policy',
  email: 'contact@sinesiakarol.com',
  paragraphs: [
    'All in-stock orders will ship within one week of purchase, barring bank holidays and Sundays.',
    'We ship with the United States Postal Service, both Domestic and International.',
    'Priority shipping within the United States is not less than $10.',
    'Priority shipping to Canada is not less than $30.',
    'Priority shipping to anywhere else in the world is not less than $50.',
    'All shipping prices are subject to change and are determined by weight.',
    'Prices throughout the site are in USD.',
    'Sinesia Karol LLC is unable to combine shipping on orders.',
    'Sinesia Karol LLC will only ship to the shipping address in the Shipping Information field on the order.',
    'Sinesia Karol LLC is not responsible for customs fees or import duties in the User\'s destination country. If you have any questions or concerns about customs, please email customer service at contact@sinesiakarol.com. We are unable to lower the value of merchandise on customs forms.',
  ],
} as const;

const PRODUCT_SHIPPING_POLICY_PT = {
  title: 'Política de envio',
  email: 'contact@sinesiakarol.com',
  paragraphs: [
    'Todos os pedidos em estoque serão enviados em até uma semana após a compra, exceto feriados bancários e domingos.',
    'Enviamos pelo United States Postal Service, tanto doméstico quanto internacional.',
    'O envio prioritário dentro dos Estados Unidos não é inferior a US$ 10.',
    'O envio prioritário para o Canadá não é inferior a US$ 30.',
    'O envio prioritário para qualquer outro lugar do mundo não é inferior a US$ 50.',
    'Todos os preços de envio estão sujeitos a alterações e são determinados pelo peso.',
    'Os preços em todo o site estão em USD.',
    'A Sinesia Karol LLC não pode combinar envios em pedidos.',
    'A Sinesia Karol LLC enviará apenas para o endereço de entrega informado no campo Informações de Envio do pedido.',
    'A Sinesia Karol LLC não se responsabiliza por taxas alfandegárias ou impostos de importação no país de destino do usuário. Se tiver dúvidas ou preocupações sobre alfândega, envie um e-mail ao atendimento ao cliente em contact@sinesiakarol.com. Não podemos reduzir o valor da mercadoria em formulários alfandegários.',
  ],
} as const;

/** @deprecated Use getProductShippingPolicy(locale) */
export const PRODUCT_SHIPPING_POLICY = PRODUCT_SHIPPING_POLICY_EN;

export function getProductShippingPolicy(locale: string) {
  return locale === 'pt' ? PRODUCT_SHIPPING_POLICY_PT : PRODUCT_SHIPPING_POLICY_EN;
}
