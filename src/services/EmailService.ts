import sgMail from '@sendgrid/mail'

export default class EmailService {
  constructor() {
    sgMail.setApiKey(process.env.API_EMAIL_KEY!)
  }

  public async sendComplaintEmail(
    rentPlaceId: number,
    complaintType: string,
    ownerName: string,
    username: string,
    description: string
  ) {
    console.debug('Enviando email de denúncia...')

    let template =
      '<h1>Nova denúncia - Tipo: {type}</h1><p>O imóvel {id}, do usuário {owner}, recebeu uma denúncia do usuário {username}.</p><h2>Denúncia realizada</h2><p>{description}</p>'
    template = template
      .replace('{id}', rentPlaceId.toString())
      .replace('{type}', complaintType)
      .replace('{owner}', ownerName)
      .replace('{username}', username)
      .replace('{description}', description)

    const msg = {
      to: 'leduardovieirab@gmail.com',
      from: 'flyinghigh.myroom@gmail.com',
      subject: 'Nova reclamação recebida',
      html: template,
    }
    await sgMail.send(msg)
    console.debug(`Email enviado com sucesso`)
  }
}
