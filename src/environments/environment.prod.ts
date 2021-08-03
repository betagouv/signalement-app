export const environment = {
  production: true,
  apiReportBaseUrl: '${API_BASE_URL}',
  apiCompanyBaseUrl: 'https://entreprise.data.gouv.fr',
  apiAddressBaseUrl: 'https://api-adresse.data.gouv.fr',
  reponseConsoDisplayRate: Number('${REPONSECONSO_DISPLAY_PERCENTAGE}') || 0,
  reponseConsoForwardUrl: (id: string) => {
    const envUrl = '${REPONSECONSO_BASE_URL}';
    // @ts-ignore
    const baseUrl = (!envUrl || envUrl === '') ? 'https://reclamation.conso.gouv.fr' : envUrl.replace('\/$', '');
    return `${baseUrl}/${id}`;
  },
  sentryDsn: '${SENTRY_DSN}',
};
