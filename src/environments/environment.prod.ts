export const environment = {
  production: true,
  apiReportBaseUrl: '',
  apiCompanyBaseUrl: 'https://entreprise.data.gouv.fr',
  apiAddressBaseUrl: 'https://api-adresse.data.gouv.fr',
  reponseConsoDisplayRate: Number('') || 0,
  reponseConsoForwardUrl: (id: string) => {
    const envUrl = '';
    // @ts-ignore
    const baseUrl = (!envUrl || envUrl === '') ? 'https://reclamation.conso.gouv.fr' : envUrl.replace('\/$', '');
    return `${baseUrl}/${id}`;
  },
  sentryDsn: '',
};
