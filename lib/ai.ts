import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function generateDestinationDescription(
  name: string,
  country: string,
  highlights: string[]
): Promise<string> {
  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: `Você é um especialista em turismo. Crie uma descrição atraente para o destino "${name}", em ${country}.
Destaques: ${highlights.join(', ')}
Escreva 2-3 parágrafos em português brasileiro, focando em experiências únicas. Apenas texto corrido, sem markdown.`,
      },
    ],
  })
  const content = message.content[0]
  return content.type === 'text' ? content.text : ''
}

export async function generateOfferContent(
  offerTitle: string,
  destination: string,
  country: string,
  startDate: string,
  endDate: string,
  price: number,
  currency: string,
  includes: string[],
  itinerary: Array<{ dayNumber: number; title: string; description: string }>
): Promise<{ salesCopy: string; whatsappText: string; instagramCaption: string }> {
  const context = `
Pacote: ${offerTitle}
Destino: ${destination}, ${country}
Período: ${startDate} a ${endDate}
Preço: ${currency} ${price.toLocaleString('pt-BR')}
Inclui: ${includes.join(', ')}
Roteiro:
${itinerary.map((d) => `Dia ${d.dayNumber} - ${d.title}: ${d.description}`).join('\n')}
`

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    messages: [
      {
        role: 'user',
        content: `Você é um especialista em marketing de turismo. Com base nas informações abaixo, crie 3 tipos de conteúdo em português brasileiro.

${context}

Retorne APENAS um JSON válido com exatamente estas 3 chaves:
{
  "salesCopy": "texto de venda completo e persuasivo (3-4 parágrafos)",
  "whatsappText": "mensagem para WhatsApp com emojis, máximo 300 caracteres",
  "instagramCaption": "legenda para Instagram com hashtags, máximo 400 caracteres"
}`,
      },
    ],
  })

  const content = message.content[0]
  if (content.type === 'text') {
    try {
      const jsonMatch = content.text.match(/\{[\s\S]*\}/)
      if (jsonMatch) return JSON.parse(jsonMatch[0])
    } catch {
      // fallback
    }
  }
  return { salesCopy: '', whatsappText: '', instagramCaption: '' }
}
