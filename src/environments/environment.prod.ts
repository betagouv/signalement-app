export const environment = {
  production: true,
  dashboardBaseUrl: '${DASHBOARD_BASE_URL}',
  apiReportBaseUrl: '${API_BASE_URL}',
  skipReportEmailValidation: ('${SKIP_REPORT_EMAIL_VALIDATION}' as string | undefined) === 'true',
  apiReportBaseUrlX: ('${API_BASE_URL}' as string | undefined) === 'true',
  apiCompanyBaseUrl: 'https://entreprise.data.gouv.fr',
  apiAddressBaseUrl: 'https://api-adresse.data.gouv.fr',
  reponseConsoDisplayRate: Number('${REPONSECONSO_DISPLAY_PERCENTAGE}') || 0,
  reponseConsoForwardUrl: (id: string) => {
    const envUrl = '${REPONSECONSO_BASE_URL}' as string | undefined;
    const baseUrl = (!envUrl || envUrl === '') ? 'https://reclamation.conso.gouv.fr' : envUrl.replace('\/$', '');
    return `${baseUrl}/${id}`;
  },
  sentryDsn: '${SENTRY_DSN}',
};
